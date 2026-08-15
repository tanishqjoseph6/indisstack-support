import "server-only";

/**
 * Canonical demo inbox seed content (7 tickets).
 * Stable `seedKey` values drive deterministic per-workspace IDs.
 */

export type DemoMessageSeed = {
  seedKey: string;
  senderType: "customer" | "agent" | "system";
  senderName: string;
  content: string;
  minutesAgo: number;
};

export type DemoAnalysisSeed = {
  intent: string;
  priority: "low" | "medium" | "high";
  recommendedAction: string;
  confidence: number;
  escalationRequired: boolean;
  suggestedReply: string;
  minutesAgo: number;
};

export type DemoTicketSeed = {
  seedKey: string;
  customerName: string;
  customerInitials: string;
  preview: string;
  channel: "WhatsApp" | "Email" | "Web chat";
  language: "hindi" | "hinglish" | "english";
  priority: "low" | "medium" | "high";
  status: "unresolved";
  minutesAgo: number;
  messages: DemoMessageSeed[];
  analysis: DemoAnalysisSeed;
};

export const DEMO_TICKET_SEEDS: DemoTicketSeed[] = [
  {
    seedKey: "demo-01-rahul-mehta",
    customerName: "Rahul Mehta",
    customerInitials: "RM",
    preview: "Bhai payment debit ho gaya but order confirm nahi hua...",
    channel: "WhatsApp",
    language: "hinglish",
    priority: "high",
    status: "unresolved",
    minutesAgo: 10,
    messages: [
      {
        seedKey: "demo-01-m1",
        senderType: "customer",
        senderName: "Rahul Mehta",
        content:
          "Bhai payment debit ho gaya but order confirm nahi hua, please check.",
        minutesAgo: 12,
      },
      {
        seedKey: "demo-01-m2",
        senderType: "agent",
        senderName: "Support",
        content: "Hi Rahul, thanks for reaching out. We're looking into this.",
        minutesAgo: 10,
      },
      {
        seedKey: "demo-01-m3",
        senderType: "customer",
        senderName: "Rahul Mehta",
        content: "UPI se 1,299 cut ho gaya, screenshot bhejun?",
        minutesAgo: 8,
      },
    ],
    analysis: {
      intent: "payment_debited_order_not_confirmed",
      priority: "high",
      recommendedAction: "Escalate to payments team for transaction verification",
      confidence: 92,
      escalationRequired: true,
      suggestedReply:
        "Sorry for the inconvenience. We can help review your payment status once a support agent verifies the transaction.",
      minutesAgo: 10,
    },
  },
  {
    seedKey: "demo-02-ananya-iyer",
    customerName: "Ananya Iyer",
    customerInitials: "AI",
    preview: "Mera order abhi tak deliver nahi hua, 5 din ho gaye...",
    channel: "Email",
    language: "hinglish",
    priority: "medium",
    status: "unresolved",
    minutesAgo: 32,
    messages: [
      {
        seedKey: "demo-02-m1",
        senderType: "customer",
        senderName: "Ananya Iyer",
        content:
          "Mera order abhi tak deliver nahi hua, 5 din ho gaye. Kya ho raha hai?",
        minutesAgo: 40,
      },
      {
        seedKey: "demo-02-m2",
        senderType: "agent",
        senderName: "Support",
        content: "Hello Ananya, we apologise for the delay.",
        minutesAgo: 35,
      },
      {
        seedKey: "demo-02-m3",
        senderType: "customer",
        senderName: "Ananya Iyer",
        content: "Tracking pe out for delivery dikha raha hai 2 din se.",
        minutesAgo: 33,
      },
      {
        seedKey: "demo-02-m4",
        senderType: "agent",
        senderName: "Support",
        content: "Let me check with the courier partner.",
        minutesAgo: 30,
      },
    ],
    analysis: {
      intent: "delivery_delay",
      priority: "medium",
      recommendedAction: "Check shipment status and send updated delivery timeline",
      confidence: 87,
      escalationRequired: false,
      suggestedReply:
        "Maafi chahte hain delay ke liye. Hum aapke order ki delivery status check karke update share karenge.",
      minutesAgo: 32,
    },
  },
  {
    seedKey: "demo-03-vikram-singh",
    customerName: "Vikram Singh",
    customerInitials: "VS",
    preview: "Size small aa gaya, M chahiye exchange possible?",
    channel: "Web chat",
    language: "hinglish",
    priority: "medium",
    status: "unresolved",
    minutesAgo: 60,
    messages: [
      {
        seedKey: "demo-03-m1",
        senderType: "customer",
        senderName: "Vikram Singh",
        content: "Size small aa gaya, M chahiye exchange possible?",
        minutesAgo: 62,
      },
      {
        seedKey: "demo-03-m2",
        senderType: "agent",
        senderName: "Support",
        content: "Hi Vikram, I can help with a size exchange.",
        minutesAgo: 59,
      },
    ],
    analysis: {
      intent: "size_exchange",
      priority: "medium",
      recommendedAction: "Initiate size exchange workflow with pickup scheduling",
      confidence: 80,
      escalationRequired: false,
      suggestedReply:
        "Size exchange ke liye hum pickup aur replacement steps share kar sakte hain.",
      minutesAgo: 60,
    },
  },
  {
    seedKey: "demo-04-sneha-patel",
    customerName: "Sneha Patel",
    customerInitials: "SP",
    preview: "Box khula aaya aur product toota hua tha",
    channel: "WhatsApp",
    language: "hinglish",
    priority: "high",
    status: "unresolved",
    minutesAgo: 60,
    messages: [
      {
        seedKey: "demo-04-m1",
        senderType: "customer",
        senderName: "Sneha Patel",
        content: "Box khula aaya aur product toota hua tha",
        minutesAgo: 80,
      },
      {
        seedKey: "demo-04-m2",
        senderType: "customer",
        senderName: "Sneha Patel",
        content: "Photos bhej du? Ceramic mug completely cracked hai.",
        minutesAgo: 79,
      },
      {
        seedKey: "demo-04-m3",
        senderType: "agent",
        senderName: "Support",
        content: "Sorry to hear that, Sneha. Yes, please share photos.",
        minutesAgo: 75,
      },
    ],
    analysis: {
      intent: "damaged_product_return",
      priority: "high",
      recommendedAction: "Open damaged-item claim and arrange replacement or return",
      confidence: 84,
      escalationRequired: false,
      suggestedReply:
        "Return process ke steps aur timeline hum aapko share kar sakte hain.",
      minutesAgo: 60,
    },
  },
  {
    seedKey: "demo-05-arjun-khanna",
    customerName: "Arjun Khanna",
    customerInitials: "AK",
    preview: "Return ho gaya 10 din pehle refund abhi tak nahi aaya",
    channel: "Email",
    language: "hinglish",
    priority: "high",
    status: "unresolved",
    minutesAgo: 120,
    messages: [
      {
        seedKey: "demo-05-m1",
        senderType: "customer",
        senderName: "Arjun Khanna",
        content: "Return ho gaya 10 din pehle refund abhi tak nahi aaya",
        minutesAgo: 130,
      },
      {
        seedKey: "demo-05-m2",
        senderType: "agent",
        senderName: "Support",
        content: "Hi Arjun, I understand your concern about the refund timeline.",
        minutesAgo: 120,
      },
      {
        seedKey: "demo-05-m3",
        senderType: "customer",
        senderName: "Arjun Khanna",
        content: "You said 5-7 days. It's been 12 days. Paisa wapas karo.",
        minutesAgo: 115,
      },
    ],
    analysis: {
      intent: "refund_not_credited",
      priority: "high",
      recommendedAction: "Escalate to refunds team to trace refund status",
      confidence: 86,
      escalationRequired: true,
      suggestedReply:
        "We can help review your payment or refund status once our team verifies the transaction details.",
      minutesAgo: 120,
    },
  },
  {
    seedKey: "demo-06-kavita-desai",
    customerName: "Kavita Desai",
    customerInitials: "KD",
    preview: "शिपमेंट से पहले पता बदलना है...",
    channel: "Web chat",
    language: "hindi",
    priority: "medium",
    status: "unresolved",
    minutesAgo: 180,
    messages: [
      {
        seedKey: "demo-06-m1",
        senderType: "customer",
        senderName: "Kavita Desai",
        content: "शिपमेंट से पहले पता बदलना है। ऑर्डर 66018",
        minutesAgo: 185,
      },
      {
        seedKey: "demo-06-m2",
        senderType: "customer",
        senderName: "Kavita Desai",
        content: "नया पता: फ्लैट 302, ग्रीन पार्क, नई दिल्ली 110016",
        minutesAgo: 184,
      },
      {
        seedKey: "demo-06-m3",
        senderType: "agent",
        senderName: "Support",
        content: "Sure, let me verify dispatch status first.",
        minutesAgo: 180,
      },
    ],
    analysis: {
      intent: "address_change",
      priority: "medium",
      recommendedAction: "Verify order not dispatched and update delivery address",
      confidence: 82,
      escalationRequired: false,
      suggestedReply: "Address change possible ho to hum next steps share karenge.",
      minutesAgo: 180,
    },
  },
  {
    seedKey: "demo-07-james-wilson",
    customerName: "James Wilson",
    customerInitials: "JW",
    preview: "Promo code WELCOME10 didn't work on my cart",
    channel: "Email",
    language: "english",
    priority: "low",
    status: "unresolved",
    minutesAgo: 240,
    messages: [
      {
        seedKey: "demo-07-m1",
        senderType: "customer",
        senderName: "James Wilson",
        content: "Promo code WELCOME10 didn't work on my cart",
        minutesAgo: 250,
      },
      {
        seedKey: "demo-07-m2",
        senderType: "agent",
        senderName: "Support",
        content: "Hello James, I'll check the coupon eligibility for your order.",
        minutesAgo: 240,
      },
    ],
    analysis: {
      intent: "coupon_not_applied",
      priority: "low",
      recommendedAction:
        "Verify coupon eligibility and apply credit or explain rejection",
      confidence: 79,
      escalationRequired: false,
      suggestedReply:
        "We'll check the coupon eligibility for your order and share the next step shortly.",
      minutesAgo: 240,
    },
  },
];

export const DEMO_PROBE_SEED_KEY = DEMO_TICKET_SEEDS[0].seedKey;
