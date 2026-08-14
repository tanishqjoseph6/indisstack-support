/** @typedef {"hindi" | "hinglish" | "english" | "other"} DemoLanguage */

const STRONG_HINGLISH_SIGNALS = [
  "aapka",
  "aapke",
  "abhi",
  "acha",
  "bhai",
  "bhej",
  "bhejo",
  "chahiye",
  "galat",
  "gaya",
  "gayi",
  "hai",
  "hain",
  "hamari",
  "ho",
  "hoga",
  "hua",
  "hui",
  "hue",
  "hum",
  "kab",
  "kahan",
  "kaise",
  "kar",
  "karna",
  "karo",
  "krdo",
  "krna",
  "kripya",
  "kya",
  "kyu",
  "kyun",
  "maafi",
  "mera",
  "mere",
  "meri",
  "mujhe",
  "nahi",
  "nahin",
  "paisa",
  "paise",
  "pls",
  "tak",
  "theek",
  "wapas",
  "yaar",
];

const SHARED_COMMERCE_SIGNALS = [
  "confirm",
  "debit",
  "delivery",
  "order",
  "payment",
  "please",
  "refund",
  "track",
];

/**
 * @param {string} message
 * @returns {string[]}
 */
function tokenize(message) {
  return message
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * @param {string[]} tokens
 * @param {string[]} signals
 */
function countSignals(tokens, signals) {
  const signalSet = new Set(signals);
  return tokens.filter((token) => signalSet.has(token)).length;
}

/**
 * @param {string} message
 * @returns {DemoLanguage}
 */
export function detectDemoLanguage(message) {
  const trimmed = message.trim();
  if (!trimmed) return "other";

  const hasDevanagari = /[\u0900-\u097F]/.test(trimmed);
  const hasLatin = /[a-zA-Z]/.test(trimmed);

  if (hasDevanagari && hasLatin) return "hinglish";
  if (hasDevanagari) return "hindi";

  const tokens = tokenize(trimmed);
  if (tokens.length === 0) return "other";

  const strongCount = countSignals(tokens, STRONG_HINGLISH_SIGNALS);
  const sharedCount = countSignals(tokens, SHARED_COMMERCE_SIGNALS);

  if (strongCount >= 1) return "hinglish";
  if (hasLatin && (sharedCount >= 1 || tokens.length > 0)) return "english";

  return "other";
}
