export type AnalysisResult = {
  intent: string;
  language: string;
  priority: "Low" | "Medium" | "High";
  recommendedAction: string;
  confidence: number;
  suggestedReply: string;
};

export const EXAMPLE_MESSAGES = {
  payment: "Bhai payment debit ho gaya but order confirm nahi hua, please check.",
  delivery: "Mera order abhi tak deliver nahi hua, 5 din ho gaye. Kya ho raha hai?",
  return: "Product defective hai, return karna chahta hoon. Refund kab milega?",
} as const;

export type ExampleKey = keyof typeof EXAMPLE_MESSAGES;

const PAYMENT_RESULT: AnalysisResult = {
  intent: "payment_debited_order_not_confirmed",
  language: "Hinglish",
  priority: "High",
  recommendedAction: "Create payment verification ticket",
  confidence: 92,
  suggestedReply:
    "Sorry for the inconvenience. Aapka payment verification request raise kar diya gaya hai. Hum jaldi update denge.",
};

const DELIVERY_RESULT: AnalysisResult = {
  intent: "delivery_delay_inquiry",
  language: "Hinglish",
  priority: "Medium",
  recommendedAction: "Check shipment status and send tracking update",
  confidence: 87,
  suggestedReply:
    "Maafi chahte hain delay ke liye. Aapka order transit mein hai — tracking details SMS par bhej diye gaye hain.",
};

const RETURN_RESULT: AnalysisResult = {
  intent: "return_request_defective_item",
  language: "Hinglish",
  priority: "Medium",
  recommendedAction: "Initiate return pickup and refund workflow",
  confidence: 68,
  suggestedReply:
    "Return request register ho gayi hai. Pickup 2–3 business days mein schedule hogi. Refund process hone par notify karenge.",
};

function normalizeMessage(message: string): string {
  return message.trim().toLowerCase().replace(/\s+/g, " ");
}

export function analyzeMessage(message: string): AnalysisResult {
  const normalized = normalizeMessage(message);

  if (normalized === normalizeMessage(EXAMPLE_MESSAGES.payment)) {
    return PAYMENT_RESULT;
  }

  if (normalized === normalizeMessage(EXAMPLE_MESSAGES.delivery)) {
    return DELIVERY_RESULT;
  }

  if (normalized === normalizeMessage(EXAMPLE_MESSAGES.return)) {
    return RETURN_RESULT;
  }

  const hasHindiScript = /[\u0900-\u097F]/.test(message);
  const hasEnglish = /[a-zA-Z]/.test(message);
  const language =
    hasHindiScript && hasEnglish ? "Hinglish" : hasHindiScript ? "Hindi" : "English";

  return {
    intent: "general_support_inquiry",
    language,
    priority: "Low",
    recommendedAction: "Route to support queue for manual review",
    confidence: 61,
    suggestedReply:
      "Thank you for reaching out. Hamari team aapki request review kar rahi hai aur jald hi respond karegi.",
  };
}
