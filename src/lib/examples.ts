export const EXAMPLE_MESSAGES = {
  payment: "Bhai payment debit ho gaya but order confirm nahi hua, please check.",
  delivery: "Mera order abhi tak deliver nahi hua, 5 din ho gaye. Kya ho raha hai?",
  return: "Product defective hai, return karna chahta hoon. Refund kab milega?",
} as const;

export type ExampleKey = keyof typeof EXAMPLE_MESSAGES;
