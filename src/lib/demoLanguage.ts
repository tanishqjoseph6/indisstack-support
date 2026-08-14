import type { AnalysisLanguage } from "@/lib/analysis";
import { detectDemoLanguage as detectDemoLanguageImpl } from "@/lib/demoLanguage.mjs";

export function detectDemoLanguage(message: string): AnalysisLanguage {
  return detectDemoLanguageImpl(message) as AnalysisLanguage;
}
