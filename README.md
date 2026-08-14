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

## Analysis modes

### Live API mode

When `OPENAI_API_KEY` is configured and the OpenAI project has available quota, **Analyze message** calls `/api/analyze`, which uses the OpenAI Responses API (`gpt-5-mini`) on the server. The API key is never exposed to the browser.

### Local demo mode

If the live API returns a quota or billing failure, the UI automatically falls back to a **deterministic local preview** so the product can still be demonstrated at no cost. Demo output is clearly labeled **“Demo output — deterministic preview”** and is not presented as a live model result.

Demo mode uses keyword-based rules and fixed outputs for the built-in example messages. Other API errors (auth, rate limits, server failures) still show safe error messages and do not fall back silently.
