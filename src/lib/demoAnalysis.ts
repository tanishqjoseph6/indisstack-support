import type { AnalysisResponse } from "@/lib/analysis";
import { detectDemoLanguage } from "@/lib/demoLanguage";
import { EXAMPLE_MESSAGES } from "@/lib/examples";

function normalizeMessage(message: string): string {
  return message.trim().toLowerCase().replace(/\s+/g, " ");
}

type DemoRule = {
  intent: string;
  priority: AnalysisResponse["priority"];
  action: string;
  confidence: number;
  reply: string;
  needsHuman: boolean;
  reason: string;
};

const EXAMPLE_RESULTS: Record<keyof typeof EXAMPLE_MESSAGES, DemoRule> = {
  payment: {
    intent: "payment_debited_order_not_confirmed",
    priority: "high",
    action: "Escalate to payments team for transaction verification",
    confidence: 0.92,
    reply:
      "Sorry for the inconvenience. We can help review your payment status once a support agent verifies the transaction.",
    needsHuman: true,
    reason: "Payment debited without order confirmation.",
  },
  delivery: {
    intent: "delivery_delay",
    priority: "medium",
    action: "Check shipment status and send updated delivery timeline",
    confidence: 0.87,
    reply:
      "Maafi chahte hain delay ke liye. Hum aapke order ki delivery status check karke update share karenge.",
    needsHuman: false,
    reason: "Clear delivery delay inquiry.",
  },
  return: {
    intent: "return_request",
    priority: "medium",
    action: "Create return request and share refund timeline policy",
    confidence: 0.81,
    reply:
      "Return request ke liye hum aapko next steps aur expected refund timeline share kar sakte hain.",
    needsHuman: false,
    reason: "Standard defective-product return request.",
  },
};

type KeywordRule = {
  keywords: string[];
  result: DemoRule;
};

const KEYWORD_RULES: KeywordRule[] = [
  {
    keywords: [
      "scammer",
      "idiot",
      "bakwas",
      "bekaar",
      "worst service",
      "beekar",
      "chutiya",
      "report you",
    ],
    result: {
      intent: "abusive_message",
      priority: "high",
      action: "Escalate to human agent and apply abuse handling policy",
      confidence: 0.88,
      reply:
        "We understand your frustration. A support agent will review this conversation shortly.",
      needsHuman: true,
      reason: "Abusive or threatening language detected.",
    },
  },
  {
    keywords: [
      "hack",
      "hacked",
      "unauthorized",
      "someone else",
      "login otp",
      "password change",
      "account se",
      "email changed",
      "compromised",
      "अनधिकृत",
    ],
    result: {
      intent: "account_login_compromised",
      priority: "high",
      action: "Escalate to account security team and lock account pending review",
      confidence: 0.9,
      reply:
        "Account security matters. A specialist will review this and help secure your account.",
      needsHuman: true,
      reason: "Possible account security issue.",
    },
  },
  {
    keywords: [
      "refund nahi",
      "refund not",
      "refund abhi",
      "refund pending",
      "refund not credited",
      "refund not received",
      "paisa wapas",
      "double charge",
      "charged twice",
      "duplicate payment",
      "do baar payment",
      "money deducted",
      "payment failed",
      "debit ho gaya",
      "amount deducted",
      "payment debit",
      "रिफंड",
    ],
    result: {
      intent: "refund_not_credited",
      priority: "high",
      action: "Escalate to refunds team to trace refund status",
      confidence: 0.86,
      reply:
        "We can help review your payment or refund status once our team verifies the transaction details.",
      needsHuman: true,
      reason: "Payment or refund dispute requires human review.",
    },
  },
  {
    keywords: ["track", "tracking", "kahan hai", "where is", "parcel", "shipment"],
    result: {
      intent: "order_tracking",
      priority: "low",
      action: "Send current shipment tracking status and ETA",
      confidence: 0.84,
      reply: "Aapke order ki tracking details check karke hum status share karenge.",
      needsHuman: false,
      reason: "Tracking status inquiry.",
    },
  },
  {
    keywords: ["delay", "late", "deliver nahi", "not deliver", "not received yet"],
    result: {
      intent: "delivery_delay",
      priority: "medium",
      action: "Check shipment status and send updated delivery timeline",
      confidence: 0.83,
      reply:
        "Delivery delay ke liye maafi. Hum updated timeline check karke batayenge.",
      needsHuman: false,
      reason: "Delivery delay without payment dispute.",
    },
  },
  {
    keywords: ["address change", "address update", "pata badal", "shipping address"],
    result: {
      intent: "address_change",
      priority: "medium",
      action: "Verify order not dispatched and update delivery address",
      confidence: 0.82,
      reply: "Address change possible ho to hum next steps share karenge.",
      needsHuman: false,
      reason: "Pre-dispatch address change request.",
    },
  },
  {
    keywords: ["cancel", "cancellation", "cancel kar", "रद्द"],
    result: {
      intent: "order_cancellation",
      priority: "medium",
      action: "Check cancellation eligibility and process order cancellation",
      confidence: 0.82,
      reply: "Cancellation eligibility check karke hum aapko options batayenge.",
      needsHuman: false,
      reason: "Order cancellation request.",
    },
  },
  {
    keywords: ["exchange", "size", "साइज", "galat size"],
    result: {
      intent: "size_exchange",
      priority: "medium",
      action: "Initiate size exchange workflow with pickup scheduling",
      confidence: 0.8,
      reply: "Size exchange ke liye hum pickup aur replacement steps share kar sakte hain.",
      needsHuman: false,
      reason: "Size or exchange request.",
    },
  },
  {
    keywords: ["coupon", "promo", "discount code", "कूपन"],
    result: {
      intent: "coupon_not_applied",
      priority: "low",
      action: "Verify coupon eligibility and apply credit or explain rejection",
      confidence: 0.79,
      reply: "Coupon eligibility check karke hum reason ya next step share karenge.",
      needsHuman: false,
      reason: "Coupon not applied at checkout.",
    },
  },
  {
    keywords: ["invoice", "gst", "bill pdf", "tax invoice"],
    result: {
      intent: "invoice_request",
      priority: "low",
      action: "Generate and email GST invoice with provided billing details",
      confidence: 0.78,
      reply: "Invoice request ke liye hum required details confirm karke process karenge.",
      needsHuman: false,
      reason: "Invoice or GST bill request.",
    },
  },
  {
    keywords: ["defective", "damaged", "return", "वापसी", "wrong item", "galat product"],
    result: {
      intent: "return_request",
      priority: "medium",
      action: "Create return request and share refund timeline policy",
      confidence: 0.8,
      reply: "Return process ke steps aur timeline hum aapko share kar sakte hain.",
      needsHuman: false,
      reason: "Standard return or damaged-item request.",
    },
  },
];

function isUnclearMessage(message: string): boolean {
  const trimmed = message.trim();
  if (trimmed.length <= 3) return true;
  if (/^[\?\!\.]+$/.test(trimmed)) return true;
  if (/^(help|hi|hello|hey)$/i.test(trimmed)) return true;
  if (/^[a-z]{1,4}$/i.test(trimmed) && !/\d/.test(trimmed)) return true;
  if (/^(asdf|jkl|test|ok|ye wala)$/i.test(trimmed)) return true;
  return false;
}

function matchKeywordRule(message: string): DemoRule | null {
  const normalized = normalizeMessage(message);
  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.result;
    }
  }
  return null;
}

function buildResponse(message: string, rule: DemoRule): AnalysisResponse {
  const confidence = Math.min(1, Math.max(0, rule.confidence));
  return {
    intent: rule.intent,
    language: detectDemoLanguage(message),
    priority: rule.priority,
    action: rule.action,
    confidence,
    reply: rule.reply,
    needsHuman: rule.needsHuman || confidence < 0.75,
    reason: rule.reason,
  };
}

export function analyzeDemoMessage(message: string): AnalysisResponse {
  const normalized = normalizeMessage(message);

  for (const [key, example] of Object.entries(EXAMPLE_MESSAGES) as Array<
    [keyof typeof EXAMPLE_MESSAGES, string]
  >) {
    if (normalized === normalizeMessage(example)) {
      return buildResponse(message, EXAMPLE_RESULTS[key]);
    }
  }

  if (isUnclearMessage(message)) {
    return buildResponse(message, {
      intent: "unclear_message",
      priority: "low",
      action: "Route to human agent for clarification",
      confidence: 0.58,
      reply: "Kripya thoda aur detail share karein taaki hum sahi madad kar saken.",
      needsHuman: true,
      reason: "Message too vague to classify safely.",
    });
  }

  const keywordMatch = matchKeywordRule(message);
  if (keywordMatch) {
    return buildResponse(message, keywordMatch);
  }

  return buildResponse(message, {
    intent: "general_support_inquiry",
    priority: "low",
    action: "Route to support queue for manual review",
    confidence: 0.64,
    reply:
      "Thank you for reaching out. Hamari team aapki request review karke respond karegi.",
    needsHuman: false,
    reason: "No strong keyword match; general support routing.",
  });
}
