# IndisStack Support

A single-page app for IndisStack's AI customer-support classifier — Hindi, Hinglish, and English messages analyzed into structured, auditable outputs.

## Setup

```bash
npm install
```

Create a `.env.local` file in the project root with your OpenAI API key:

```
OPENAI_API_KEY=your_key_here
```

Never commit API keys. `.env.local` is ignored by git.

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
npm start
```

## Support Inbox

Open [/inbox](http://localhost:3000/inbox) for the static **Support Inbox** prototype — a three-column demo workspace where support managers can review Hindi, Hinglish, and English customer messages, inspect deterministic IndisStack analysis, and approve, escalate, or resolve tickets locally. No API, authentication, or database is required.

## Analysis modes

### Live API mode

When `OPENAI_API_KEY` is configured and the OpenAI project has available quota, **Analyze message** calls `/api/analyze`, which uses the OpenAI Responses API (`gpt-5-mini`) on the server. The API key is never exposed to the browser.

### Local demo mode

If the live API returns a quota or billing failure, the UI automatically falls back to a **deterministic local preview** so the product can still be demonstrated at no cost. Demo output is clearly labeled **“Demo output — deterministic preview”** and is not presented as a live model result.

Demo mode uses keyword-based rules and fixed outputs for the built-in example messages. Other API errors (auth, rate limits, server failures) still show safe error messages and do not fall back silently.

## Deployment

For public demo deployments without OpenAI API billing, set:

```
NEXT_PUBLIC_DEMO_MODE=true
```

When enabled, the message analyzer uses deterministic local demo analysis immediately and does not call `/api/analyze`. Output is labeled **“Demo output — deterministic preview”**.

Do not expose or commit `OPENAI_API_KEY`. For local development with live analysis, keep the key in `.env.local` only and leave `NEXT_PUBLIC_DEMO_MODE` unset or `false`.
