export default function HeroVisual() {
  return (
    <div
      className="relative aspect-[4/3] w-full max-w-lg border border-[var(--border)] bg-[var(--surface)] lg:aspect-square lg:max-w-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 480 480"
        fill="none"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dot-pattern"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.5" fill="var(--border)" />
          </pattern>
        </defs>

        <rect width="480" height="480" fill="url(#dot-pattern)" opacity="0.4" />

        {/* Convergence paths */}
        <path
          d="M 72 96 Q 200 140 280 220"
          stroke="var(--border)"
          strokeWidth="1"
          className="hero-path"
        />
        <path
          d="M 96 200 Q 200 200 280 220"
          stroke="var(--border)"
          strokeWidth="1"
          className="hero-path hero-path-delay-1"
        />
        <path
          d="M 64 304 Q 200 260 280 220"
          stroke="var(--border)"
          strokeWidth="1"
          className="hero-path hero-path-delay-2"
        />
        <path
          d="M 120 380 Q 210 300 280 220"
          stroke="var(--border)"
          strokeWidth="1"
          className="hero-path hero-path-delay-3"
        />

        {/* Input fragments — multilingual tokens */}
        <g className="hero-token hero-token-1">
          <rect
            x="40"
            y="80"
            width="88"
            height="28"
            stroke="var(--border)"
            strokeWidth="1"
            fill="var(--background)"
          />
          <text
            x="84"
            y="98"
            textAnchor="middle"
            fill="var(--muted)"
            fontSize="11"
            fontFamily="var(--font-geist-mono)"
          >
            payment debit
          </text>
        </g>

        <g className="hero-token hero-token-2">
          <rect
            x="48"
            y="186"
            width="72"
            height="28"
            stroke="var(--border)"
            strokeWidth="1"
            fill="var(--background)"
          />
          <text
            x="84"
            y="204"
            textAnchor="middle"
            fill="var(--muted)"
            fontSize="12"
            fontFamily="var(--font-geist-sans)"
          >
            भुगतान
          </text>
        </g>

        <g className="hero-token hero-token-3">
          <rect
            x="32"
            y="290"
            width="96"
            height="28"
            stroke="var(--border)"
            strokeWidth="1"
            fill="var(--background)"
          />
          <text
            x="80"
            y="308"
            textAnchor="middle"
            fill="var(--muted)"
            fontSize="11"
            fontFamily="var(--font-geist-mono)"
          >
            order confirm?
          </text>
        </g>

        <g className="hero-token hero-token-4">
          <rect
            x="56"
            y="368"
            width="80"
            height="28"
            stroke="var(--border)"
            strokeWidth="1"
            fill="var(--background)"
          />
          <text
            x="96"
            y="386"
            textAnchor="middle"
            fill="var(--muted)"
            fontSize="11"
            fontFamily="var(--font-geist-sans)"
          >
            please check
          </text>
        </g>

        {/* Structured output */}
        <g className="hero-output">
          <rect
            x="280"
            y="168"
            width="168"
            height="104"
            stroke="var(--foreground)"
            strokeWidth="1"
            fill="var(--background)"
          />
          <line
            x1="296"
            y1="192"
            x2="432"
            y2="192"
            stroke="var(--border)"
            strokeWidth="1"
          />
          <line
            x1="296"
            y1="216"
            x2="400"
            y2="216"
            stroke="var(--border)"
            strokeWidth="1"
          />
          <line
            x1="296"
            y1="240"
            x2="416"
            y2="240"
            stroke="var(--border)"
            strokeWidth="1"
          />

          <text
            x="296"
            y="184"
            fill="var(--muted)"
            fontSize="8"
            fontFamily="var(--font-geist-mono)"
            letterSpacing="1"
          >
            INTENT
          </text>
          <text
            x="296"
            y="210"
            fill="var(--foreground)"
            fontSize="9"
            fontFamily="var(--font-geist-mono)"
          >
            payment_verify
          </text>
          <text
            x="296"
            y="234"
            fill="var(--muted)"
            fontSize="8"
            fontFamily="var(--font-geist-mono)"
            letterSpacing="1"
          >
            ACTION
          </text>
          <text
            x="296"
            y="258"
            fill="var(--accent)"
            fontSize="9"
            fontFamily="var(--font-geist-mono)"
          >
            create_ticket
          </text>
        </g>

        {/* Convergence node */}
        <circle
          cx="280"
          cy="220"
          r="4"
          fill="var(--accent)"
          className="hero-node"
        />
      </svg>
    </div>
  );
}
