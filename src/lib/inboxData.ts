import type { AnalysisPriority } from "@/lib/analysis";

export type InboxChannel = "WhatsApp" | "Email" | "Web chat";
export type InboxStatus = "unresolved" | "escalated" | "resolved";
export type InboxFilter = "all" | "needs_attention" | "resolved";

export type ConversationMessage = {
  id: string;
  role: "customer" | "support";
  text: string;
  time: string;
};

export type InboxAnalysis = {
  intent: string;
  language: "hindi" | "hinglish" | "english" | "other";
  priority: AnalysisPriority;
  confidence: number;
  action: string;
  reply: string;
  needsHuman: boolean;
};

export type InboxTicket = {
  id: string;
  customerName: string;
  preview: string;
  channel: InboxChannel;
  timestamp: string;
  priority: AnalysisPriority;
  status: InboxStatus;
  orderId: string;
  language: InboxAnalysis["language"];
  messages: ConversationMessage[];
  analysis: InboxAnalysis;
};

export const INBOX_TICKETS: InboxTicket[] = [
  {
    id: "ticket-001",
    customerName: "Rahul Mehta",
    preview: "Bhai payment debit ho gaya but order confirm nahi hua...",
    channel: "WhatsApp",
    timestamp: "10 min ago",
    priority: "high",
    status: "unresolved",
    orderId: "ORD-88291",
    language: "hinglish",
    messages: [
      {
        id: "m1",
        role: "customer",
        text: "Bhai payment debit ho gaya but order confirm nahi hua, please check.",
        time: "2:14 PM",
      },
      {
        id: "m2",
        role: "support",
        text: "Hi Rahul, thanks for reaching out. We're looking into this.",
        time: "2:16 PM",
      },
      {
        id: "m3",
        role: "customer",
        text: "UPI se 1,299 cut ho gaya, screenshot bhejun?",
        time: "2:18 PM",
      },
    ],
    analysis: {
      intent: "payment_debited_order_not_confirmed",
      language: "hinglish",
      priority: "high",
      confidence: 0.92,
      action: "Escalate to payments team for transaction verification",
      reply:
        "Sorry for the inconvenience. We can help review your payment status once a support agent verifies the transaction.",
      needsHuman: true,
    },
  },
  {
    id: "ticket-002",
    customerName: "Ananya Iyer",
    preview: "Mera order abhi tak deliver nahi hua, 5 din ho gaye...",
    channel: "Email",
    timestamp: "32 min ago",
    priority: "medium",
    status: "unresolved",
    orderId: "ORD-55231",
    language: "hinglish",
    messages: [
      {
        id: "m1",
        role: "customer",
        text: "Mera order abhi tak deliver nahi hua, 5 din ho gaye. Kya ho raha hai?",
        time: "1:42 PM",
      },
      {
        id: "m2",
        role: "support",
        text: "Hello Ananya, we apologise for the delay.",
        time: "1:50 PM",
      },
      {
        id: "m3",
        role: "customer",
        text: "Tracking pe out for delivery dikha raha hai 2 din se.",
        time: "1:52 PM",
      },
      {
        id: "m4",
        role: "support",
        text: "Let me check with the courier partner.",
        time: "1:55 PM",
      },
    ],
    analysis: {
      intent: "delivery_delay",
      language: "hinglish",
      priority: "medium",
      confidence: 0.87,
      action: "Check shipment status and send updated delivery timeline",
      reply:
        "Maafi chahte hain delay ke liye. Hum aapke order ki delivery status check karke update share karenge.",
      needsHuman: false,
    },
  },
  {
    id: "ticket-003",
    customerName: "Vikram Singh",
    preview: "Size small aa gaya, M chahiye exchange possible?",
    channel: "Web chat",
    timestamp: "1 hr ago",
    priority: "medium",
    status: "unresolved",
    orderId: "ORD-44102",
    language: "hinglish",
    messages: [
      {
        id: "m1",
        role: "customer",
        text: "Size small aa gaya, M chahiye exchange possible?",
        time: "12:58 PM",
      },
      {
        id: "m2",
        role: "support",
        text: "Hi Vikram, I can help with a size exchange.",
        time: "1:01 PM",
      },
    ],
    analysis: {
      intent: "size_exchange",
      language: "hinglish",
      priority: "medium",
      confidence: 0.8,
      action: "Initiate size exchange workflow with pickup scheduling",
      reply:
        "Size exchange ke liye hum pickup aur replacement steps share kar sakte hain.",
      needsHuman: false,
    },
  },
  {
    id: "ticket-004",
    customerName: "Sneha Patel",
    preview: "Box khula aaya aur product toota hua tha",
    channel: "WhatsApp",
    timestamp: "1 hr ago",
    priority: "high",
    status: "unresolved",
    orderId: "ORD-77340",
    language: "hinglish",
    messages: [
      {
        id: "m1",
        role: "customer",
        text: "Box khula aaya aur product toota hua tha",
        time: "12:40 PM",
      },
      {
        id: "m2",
        role: "customer",
        text: "Photos bhej du? Ceramic mug completely cracked hai.",
        time: "12:41 PM",
      },
      {
        id: "m3",
        role: "support",
        text: "Sorry to hear that, Sneha. Yes, please share photos.",
        time: "12:45 PM",
      },
    ],
    analysis: {
      intent: "damaged_product_return",
      language: "hinglish",
      priority: "high",
      confidence: 0.84,
      action: "Open damaged-item claim and arrange replacement or return",
      reply:
        "Return process ke steps aur timeline hum aapko share kar sakte hain.",
      needsHuman: false,
    },
  },
  {
    id: "ticket-005",
    customerName: "Arjun Khanna",
    preview: "Return ho gaya 10 din pehle refund abhi tak nahi aaya",
    channel: "Email",
    timestamp: "2 hr ago",
    priority: "high",
    status: "unresolved",
    orderId: "ORD-99102",
    language: "hinglish",
    messages: [
      {
        id: "m1",
        role: "customer",
        text: "Return ho gaya 10 din pehle refund abhi tak nahi aaya",
        time: "11:20 AM",
      },
      {
        id: "m2",
        role: "support",
        text: "Hi Arjun, I understand your concern about the refund timeline.",
        time: "11:35 AM",
      },
      {
        id: "m3",
        role: "customer",
        text: "You said 5-7 days. It's been 12 days. Paisa wapas karo.",
        time: "11:40 AM",
      },
    ],
    analysis: {
      intent: "refund_not_credited",
      language: "hinglish",
      priority: "high",
      confidence: 0.86,
      action: "Escalate to refunds team to trace refund status",
      reply:
        "We can help review your payment or refund status once our team verifies the transaction details.",
      needsHuman: true,
    },
  },
  {
    id: "ticket-006",
    customerName: "Kavita Desai",
    preview: "शिपमेंट से पहले पता बदलना है...",
    channel: "Web chat",
    timestamp: "3 hr ago",
    priority: "medium",
    status: "unresolved",
    orderId: "ORD-66018",
    language: "hindi",
    messages: [
      {
        id: "m1",
        role: "customer",
        text: "शिपमेंट से पहले पता बदलना है। ऑर्डर 66018",
        time: "10:15 AM",
      },
      {
        id: "m2",
        role: "customer",
        text: "नया पता: फ्लैट 302, ग्रीन पार्क, नई दिल्ली 110016",
        time: "10:16 AM",
      },
      {
        id: "m3",
        role: "support",
        text: "Sure, let me verify dispatch status first.",
        time: "10:20 AM",
      },
    ],
    analysis: {
      intent: "address_change",
      language: "hindi",
      priority: "medium",
      confidence: 0.82,
      action: "Verify order not dispatched and update delivery address",
      reply: "Address change possible ho to hum next steps share karenge.",
      needsHuman: false,
    },
  },
  {
    id: "ticket-007",
    customerName: "James Wilson",
    preview: "Promo code WELCOME10 didn't work on my cart",
    channel: "Email",
    timestamp: "4 hr ago",
    priority: "low",
    status: "unresolved",
    orderId: "ORD-22847",
    language: "english",
    messages: [
      {
        id: "m1",
        role: "customer",
        text: "Promo code WELCOME10 didn't work on my cart",
        time: "9:05 AM",
      },
      {
        id: "m2",
        role: "support",
        text: "Hello James, I'll check the coupon eligibility for your order.",
        time: "9:18 AM",
      },
    ],
    analysis: {
      intent: "coupon_not_applied",
      language: "english",
      priority: "low",
      confidence: 0.79,
      action: "Verify coupon eligibility and apply credit or explain rejection",
      reply:
        "We'll check the coupon eligibility for your order and share the next step shortly.",
      needsHuman: false,
    },
  },
  {
    id: "ticket-008",
    customerName: "Unknown",
    preview: "???",
    channel: "WhatsApp",
    timestamp: "5 hr ago",
    priority: "low",
    status: "unresolved",
    orderId: "—",
    language: "other",
    messages: [
      {
        id: "m1",
        role: "customer",
        text: "???",
        time: "8:30 AM",
      },
      {
        id: "m2",
        role: "support",
        text: "Hi, how can we help you today?",
        time: "8:32 AM",
      },
      {
        id: "m3",
        role: "customer",
        text: "ye wala",
        time: "8:33 AM",
      },
    ],
    analysis: {
      intent: "unclear_message",
      language: "other",
      priority: "low",
      confidence: 0.58,
      action: "Route to human agent for clarification",
      reply:
        "Kripya thoda aur detail share karein taaki hum sahi madad kar saken.",
      needsHuman: true,
    },
  },
];

export function getInitials(name: string): string {
  if (name === "Unknown") return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatInboxLanguage(
  language: InboxAnalysis["language"],
): string {
  const labels: Record<InboxAnalysis["language"], string> = {
    hindi: "Hindi",
    hinglish: "Hinglish",
    english: "English",
    other: "Other",
  };
  return labels[language];
}

export function formatInboxStatus(status: InboxStatus): string {
  const labels: Record<InboxStatus, string> = {
    unresolved: "Unresolved",
    escalated: "Escalated",
    resolved: "Resolved",
  };
  return labels[status];
}

export function matchesFilter(ticket: InboxTicket, filter: InboxFilter): boolean {
  if (filter === "all") return true;
  if (filter === "resolved") return ticket.status === "resolved";
  return ticket.status === "unresolved" || ticket.status === "escalated";
}

export function countTicketsForFilter(
  tickets: InboxTicket[],
  filter: InboxFilter,
): number {
  return tickets.filter((ticket) => matchesFilter(ticket, filter)).length;
}
