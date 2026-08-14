export type AnalysisLanguage = "hindi" | "hinglish" | "english" | "other";
export type AnalysisPriority = "low" | "medium" | "high";

export type AnalysisResponse = {
  intent: string;
  language: AnalysisLanguage;
  priority: AnalysisPriority;
  action: string;
  confidence: number;
  reply: string;
  needsHuman: boolean;
  reason: string;
};

export const MAX_MESSAGE_LENGTH = 2000;

export function formatLanguage(language: AnalysisLanguage): string {
  const labels: Record<AnalysisLanguage, string> = {
    hindi: "Hindi",
    hinglish: "Hinglish",
    english: "English",
    other: "Other",
  };
  return labels[language];
}

export function formatPriority(priority: AnalysisPriority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export function formatConfidence(confidence: number): number {
  return Math.round(Math.min(1, Math.max(0, confidence)) * 100);
}
