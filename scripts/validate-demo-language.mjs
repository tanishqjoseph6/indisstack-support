import { detectDemoLanguage } from "../src/lib/demoLanguage.mjs";

const PAYMENT_EXAMPLE =
  "Bhai payment debit ho gaya but order confirm nahi hua, please check.";

const HINDI_DEVANAGARI_EXAMPLE =
  "कृपया मेरे ऑर्डर की डिलीवरी स्थिति बताएं। ऑर्डर नंबर 441209";

const ENGLISH_TRACKING_EXAMPLE = "where is my parcel";

/** @type {Array<{ name: string; message: string; expected: string }>} */
const cases = [
  {
    name: "payment example",
    message: PAYMENT_EXAMPLE,
    expected: "hinglish",
  },
  {
    name: "Devanagari Hindi example",
    message: HINDI_DEVANAGARI_EXAMPLE,
    expected: "hindi",
  },
  {
    name: "plain English tracking example",
    message: ENGLISH_TRACKING_EXAMPLE,
    expected: "english",
  },
];

let failed = 0;

for (const testCase of cases) {
  const actual = detectDemoLanguage(testCase.message);
  if (actual !== testCase.expected) {
    failed += 1;
    console.error(
      `FAIL: ${testCase.name} — expected ${testCase.expected}, got ${actual}`,
    );
  } else {
    console.log(`ok: ${testCase.name} → ${actual}`);
  }
}

if (failed > 0) {
  process.exit(1);
}

console.log(`All ${cases.length} demo language checks passed.`);
