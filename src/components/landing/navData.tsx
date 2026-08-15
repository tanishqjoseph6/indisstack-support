import type { ReactNode } from "react";

export type NavLinkItem = {
  label: string;
  description?: string;
  href: string;
  isRoute?: boolean;
  icon: ReactNode;
};

export type NavMenu = {
  id: string;
  label: string;
  category: string;
  items: NavLinkItem[];
};

function IconInbox() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="2" y="4" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M2 6.5l7 4 7-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IconEngine() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M9 2.5v2M9 13.5v2M2.5 9h2M13.5 9h2M4.4 4.4l1.6 1.6M12 12l1.6 1.6M4.4 13.6l1.6-1.6M12 6l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconIntelligence() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M3 14.5V6.5l6-3.5 6 3.5v8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M7 10h4M7 12.5h2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IconEscalation() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M9 3v7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="9" cy="13.5" r="0.9" fill="currentColor" />
      <path
        d="M4.5 15.5h9"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconAnalysis() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M3 14V8M7 14V5M11 14V9M15 14V4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IconWorkflow() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="2.5" y="3" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.25" />
      <rect x="10.5" y="11" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.25" />
      <path d="M7.5 5h3a2 2 0 012 2v4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IconOperations() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M3 5.5h12M3 9h8M3 12.5h10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="14.5" cy="9" r="1.25" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function IconIntegrations() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M6.5 6.5a2.5 2.5 0 015 0v1a2.5 2.5 0 01-5 0v-1zM6.5 11.5a2.5 2.5 0 015 0v1a2.5 2.5 0 01-5 0v-1z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path d="M9 9v1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IconDocs() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M5 3.5h5.2L14 7.3V14.5a1 1 0 01-1 1H5a1 1 0 01-1-1V4.5a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M10 3.5V7.5h4" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

function IconDemo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="3" y="4" width="12" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M7.5 14.5h3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IconUseCases() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M4 5.5h10M4 9h7M4 12.5h9"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconChangelog() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M9 6.5V9l2 1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IconAbout() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M9 8v4M9 6h.01" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IconContact() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="2.5" y="4.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M2.5 6l6.5 4 6.5-4" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

function IconCareers() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="3" y="6.5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M6.5 6.5V5a2.5 2.5 0 015 0v1.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function IconPrivacy() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 3.5l4.5 2v4.5c0 2.8-1.9 4.4-4.5 5.5-2.6-1.1-4.5-2.7-4.5-5.5V5.5L9 3.5z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTerms() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M6 3.5h6l2 2v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-10a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M8 9h4M8 11.5h3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export const NAV_MENUS: NavMenu[] = [
  {
    id: "product",
    label: "Product",
    category: "PRODUCT",
    items: [
      {
        label: "Inbox",
        description: "Manage every customer conversation in one place.",
        href: "/inbox",
        isRoute: true,
        icon: <IconInbox />,
      },
      {
        label: "AI Decision Engine",
        description: "Turn conversations into structured decisions.",
        href: "#how-it-works",
        icon: <IconEngine />,
      },
      {
        label: "Ticket Intelligence",
        description: "Understand intent, urgency and context.",
        href: "#product",
        icon: <IconIntelligence />,
      },
      {
        label: "Human Escalation",
        description: "Route sensitive cases to the right person.",
        href: "#use-cases",
        icon: <IconEscalation />,
      },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    category: "PLATFORM",
    items: [
      {
        label: "AI Analysis",
        href: "#start-building",
        icon: <IconAnalysis />,
      },
      {
        label: "Decision Workflows",
        href: "#how-it-works",
        icon: <IconWorkflow />,
      },
      {
        label: "Support Operations",
        href: "#showcase",
        icon: <IconOperations />,
      },
      {
        label: "Integrations",
        href: "#developers",
        icon: <IconIntegrations />,
      },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    category: "RESOURCES",
    items: [
      {
        label: "Documentation",
        href: "#developers",
        icon: <IconDocs />,
      },
      {
        label: "Product Demo",
        href: "/inbox",
        isRoute: true,
        icon: <IconDemo />,
      },
      {
        label: "Use Cases",
        href: "#use-cases",
        icon: <IconUseCases />,
      },
      {
        label: "Changelog",
        href: "#showcase",
        icon: <IconChangelog />,
      },
    ],
  },
  {
    id: "company",
    label: "Company",
    category: "COMPANY",
    items: [
      {
        label: "About",
        href: "#",
        icon: <IconAbout />,
      },
      {
        label: "Contact",
        href: "mailto:hello@indisstack.in",
        icon: <IconContact />,
      },
      {
        label: "Careers",
        href: "mailto:hello@indisstack.in?subject=Careers",
        icon: <IconCareers />,
      },
      {
        label: "Privacy",
        href: "#privacy",
        icon: <IconPrivacy />,
      },
      {
        label: "Terms",
        href: "#terms",
        icon: <IconTerms />,
      },
    ],
  },
];
