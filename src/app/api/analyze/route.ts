import OpenAI, { APIError } from "openai";
import { NextResponse } from "next/server";
import type { AnalysisResponse } from "@/lib/analysis";
import { MAX_MESSAGE_LENGTH } from "@/lib/analysis";
import { QUOTA_BILLING_ERROR_MESSAGE } from "@/lib/analysisErrors";

const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    intent: {
      type: "string",
      description:
        "Snake_case intent label describing the customer's support request.",
    },
    language: {
      type: "string",
      enum: ["hindi", "hinglish", "english", "other"],
    },
    priority: {
      type: "string",
      enum: ["low", "medium", "high"],
    },
    action: {
      type: "string",
      description:
        "Recommended internal action for support staff. Do not phrase as already completed.",
    },
    confidence: {
      type: "number",
      description: "Classification confidence from 0 to 1.",
    },
    reply: {
      type: "string",
      description:
        "Short, polite, customer-safe suggested reply in the customer's language/style.",
    },
    needsHuman: {
      type: "boolean",
      description:
        "Whether the conversation should be escalated to a human agent.",
    },
    reason: {
      type: "string",
      description: "Short internal explanation for the classification.",
    },
  },
  required: [
    "intent",
    "language",
    "priority",
    "action",
    "confidence",
    "reply",
    "needsHuman",
    "reason",
  ],
  additionalProperties: false,
} as const;

const SYSTEM_INSTRUCTION = `You classify customer-support messages for Indian e-commerce. Messages may be in Hindi, Hinglish, or English.

Return structured analysis only.

Rules:
- Never claim an order was changed, refunded, verified, or resolved in the reply.
- Recommend actions only. Do not state that any action was already taken.
- The reply must be short, polite, and customer-safe, matching the customer's language and style.
- The action field must describe a recommended internal next step, not a completed action.
- Set needsHuman to true for unclear messages, payment or refund disputes, account-security issues, abusive content, or when confidence is below 0.75.
- The reason field is a brief internal note for support staff.`;

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

function isValidMessage(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeAnalysis(raw: AnalysisResponse): AnalysisResponse {
  const confidence = Math.min(1, Math.max(0, raw.confidence));
  return {
    ...raw,
    confidence,
    needsHuman: raw.needsHuman || confidence < 0.75,
  };
}

type OpenAIErrorMetadata = {
  status: number | undefined;
  code: string | null | undefined;
  type: string | undefined;
};

function getOpenAIErrorMetadata(error: APIError): OpenAIErrorMetadata {
  return {
    status: error.status,
    code: error.code,
    type: error.type,
  };
}

function logOpenAIErrorMetadata(metadata: OpenAIErrorMetadata): void {
  console.error("[analyze] OpenAI API error", {
    status: metadata.status ?? null,
    code: metadata.code ?? null,
    type: metadata.type ?? null,
  });
}

function getUserSafeOpenAIErrorMessage(
  status: number | undefined,
  code: string | null | undefined,
  type: string | undefined,
): string {
  if (status === 401) {
    return "The analysis service is not configured.";
  }
  if (status === 403) {
    return "This model is not available for the current API project.";
  }
  if (status === 429) {
    if (code === "insufficient_quota" || type === "insufficient_quota") {
      return QUOTA_BILLING_ERROR_MESSAGE;
    }
    return "The analysis service is busy. Please try again shortly.";
  }
  return "Analysis could not be completed.";
}

function openAIErrorResponse(error: APIError) {
  const metadata = getOpenAIErrorMetadata(error);
  logOpenAIErrorMetadata(metadata);

  return NextResponse.json(
    {
      error: getUserSafeOpenAIErrorMessage(
        metadata.status,
        metadata.code,
        metadata.type,
      ),
    },
    { status: metadata.status ?? 502 },
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const message =
    body !== null &&
    typeof body === "object" &&
    "message" in body &&
    body.message;

  if (!isValidMessage(message)) {
    return NextResponse.json(
      { error: "Message must be a non-empty string." },
      { status: 400 },
    );
  }

  const trimmed = message.trim();

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` },
      { status: 400 },
    );
  }

  const openai = getOpenAIClient();
  if (!openai) {
    return NextResponse.json(
      { error: "Analysis is temporarily unavailable." },
      { status: 503 },
    );
  }

  try {
    const response = await openai.responses.create({
      model: "gpt-5-mini",
      store: false,
      input: [
        { role: "developer", content: SYSTEM_INSTRUCTION },
        { role: "user", content: trimmed },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "support_analysis",
          strict: true,
          schema: ANALYSIS_SCHEMA,
        },
      },
    });

    const outputText = response.output_text;
    if (!outputText) {
      return NextResponse.json(
        { error: "Analysis could not be completed." },
        { status: 502 },
      );
    }

    let parsed: AnalysisResponse;
    try {
      parsed = JSON.parse(outputText) as AnalysisResponse;
    } catch {
      return NextResponse.json(
        { error: "Analysis could not be completed." },
        { status: 502 },
      );
    }

    return NextResponse.json(normalizeAnalysis(parsed));
  } catch (error) {
    if (error instanceof APIError) {
      return openAIErrorResponse(error);
    }

    return NextResponse.json(
      { error: "Analysis could not be completed." },
      { status: 502 },
    );
  }
}
