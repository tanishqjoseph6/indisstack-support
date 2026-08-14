# IndisStack Support

A demo single-page app for an AI customer-support model that classifies Hindi, Hinglish, and English support messages into structured actions.

## Setup

```bash
npm install
```

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

## About the demo

The analysis shown in the UI is **mocked on the frontend** — no external APIs or API keys are used. Clicking **Analyze message** runs a local function that returns predefined results for the three example messages (payment issue, delivery delay, return request). Custom messages receive a generic fallback result with lower confidence to demonstrate human escalation.
