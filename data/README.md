# IndisStack Support evaluation data

## `indisstack-support-eval-v0.jsonl`

Synthetic v0 evaluation set for IndisStack Support. **This is evaluation data, not training data.** Use it to measure classifier quality on held-out examples before shipping model or prompt changes.

## Privacy

Examples are fully synthetic. They must **not** contain real customer PII — no real names, phone numbers, emails, full addresses, payment identifiers, or order IDs tied to real people. When adding rows, keep messages realistic but fictional.

## Schema

Each JSONL line is one object:

| Field | Description |
|-------|-------------|
| `id` | Stable example ID (`eval-001` … `eval-100`) |
| `message` | Customer message as written |
| `expected_intent` | Target intent label (snake_case) |
| `expected_language` | `hindi`, `hinglish`, `english`, or `other` |
| `expected_priority` | `low`, `medium`, or `high` |
| `expected_action` | Recommended internal action (not a completed action) |
| `expected_needs_human` | Whether the case should escalate to a human |
| `notes` | Brief curator note on edge cases or labeling rationale |

## Adding examples consistently

1. Pick or define an intent label and keep naming stable across versions.
2. Write the message in the target register: Devanagari Hindi, Roman Hindi, Hinglish, or English. Include natural noise (typos, shorthand, mixed script) where relevant.
3. Set `expected_needs_human` to `true` for payment/refund disputes, account-security issues, unclear messages, and abusive content.
4. Prefer routable `expected_action` values for tracking, delivery delay, address change, cancellation, size/exchange, and coupon issues when the message is clear.
5. Add a short `notes` field explaining ambiguous labeling decisions.
6. Validate locally before committing:

```bash
node -e "require('fs').readFileSync('data/indisstack-support-eval-v0.jsonl','utf8').trim().split('\n').forEach((l,i)=>JSON.parse(l)); console.log('ok')"
```

## Intended evaluation metrics

| Metric | Definition |
|--------|------------|
| **Intent accuracy** | Exact or normalized match on `expected_intent` |
| **Language accuracy** | Match on `expected_language` |
| **Priority accuracy** | Match on `expected_priority` |
| **Action match** | Semantic or normalized match on `expected_action` |
| **Human-escalation recall** | Fraction of `expected_needs_human: true` cases correctly flagged for escalation |

Track regressions per intent and per language bucket when iterating on prompts, models, or routing rules.

## v0 coverage

- **100** examples across **20** intents
- Hindi (Devanagari), Roman Hindi, Hinglish, and English
- Payment/refund disputes, account security, unclear, and abusive cases require human escalation
- Routine operational intents (tracking, delays, address changes, cancellations, exchanges, coupons) are safely routable where appropriate
