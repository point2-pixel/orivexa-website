import Anthropic from "@anthropic-ai/sdk";

/**
 * Server-only Anthropic client. Never import this from a Client Component —
 * it reads a secret API key that must not reach the browser.
 */
export function createAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it in Vercel → Settings → Environment Variables."
    );
  }
  return new Anthropic({ apiKey });
}

export const CLAUDE_MODEL = "claude-sonnet-5";
