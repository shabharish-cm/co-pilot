/** Slack Web API response shapes (subset used for message fetching) */

export interface SlackMessage {
  type: string;
  ts: string;           // Unix timestamp as string e.g. "1742220000.123456"
  user?: string;
  bot_id?: string;
  text?: string;
  blocks?: SlackBlock[];
  attachments?: SlackAttachment[];
}

export interface SlackBlock {
  type: string;
  text?: { type: string; text: string };
  elements?: Array<{ type: string; text?: string; url?: string }>;
}

export interface SlackAttachment {
  text?: string;
  fallback?: string;
  title?: string;
  title_link?: string;
}

export interface SlackConversationsHistoryResponse {
  ok: boolean;
  messages: SlackMessage[];
  has_more: boolean;
  error?: string;
}