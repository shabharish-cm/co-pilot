import type { SlackMessage } from './types';

/**
 * Matches https://app.fireflies.ai/view/<id>
 * The ID is alphanumeric with possible hyphens.
 */
const FIREFLIES_URL_RE = /https:\/\/app\.fireflies\.ai\/view\/([\w-]+)/g;

/**
 * Extract all unique Fireflies transcript IDs from a list of Slack messages.
 * Searches message text, attachment text/title_link, and block element URLs.
 */
export function extractFirefliesIds(messages: SlackMessage[]): string[] {
  const ids = new Set<string>();

  for (const msg of messages) {
    const candidates: string[] = [];

    // Plain text body
    if (msg.text) candidates.push(msg.text);

    // Attachments (Fireflies bot posts the URL as title_link or in text)
    for (const att of msg.attachments ?? []) {
      if (att.text)       candidates.push(att.text);
      if (att.fallback)   candidates.push(att.fallback);
      if (att.title_link) candidates.push(att.title_link);
    }

    // Block kit elements
    for (const block of msg.blocks ?? []) {
      if (block.text?.text) candidates.push(block.text.text);
      for (const el of block.elements ?? []) {
        if (el.text) candidates.push(el.text);
        if (el.url)  candidates.push(el.url);
      }
    }

    for (const text of candidates) {
      const re = new RegExp(FIREFLIES_URL_RE.source, 'g');
      let match: RegExpExecArray | null;
      while ((match = re.exec(text)) !== null) {
        ids.add(match[1]);
      }
    }
  }

  return [...ids];
}
