import axios from 'axios';
import { withRetry } from '../../utils/retry';
import type { SlackMessage, SlackConversationsHistoryResponse } from './types';

const SLACK_API = 'https://slack.com/api';

export class SlackClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  /**
   * Fetch all messages from a channel within a time window.
   * Handles pagination automatically.
   * @param channelId  Slack channel ID (e.g. C08XXXXXX)
   * @param oldest     Start of window as Unix timestamp (seconds)
   * @param latest     End of window as Unix timestamp (seconds)
   */
  async getChannelMessages(channelId: string, oldest: number, latest: number): Promise<SlackMessage[]> {
    const messages: SlackMessage[] = [];
    let cursor: string | undefined;

    do {
      const params: Record<string, string | number> = {
        channel: channelId,
        oldest:  oldest,
        latest:  latest,
        limit:   200,
        inclusive: 1,
      };
      if (cursor) params.cursor = cursor;

      const res = await withRetry(async () => {
        const r = await axios.get<SlackConversationsHistoryResponse>(
          `${SLACK_API}/conversations.history`,
          {
            headers: { Authorization: `Bearer ${this.token}` },
            params,
          },
        );
        if (!r.data.ok) {
          throw new Error(`Slack API error: ${r.data.error ?? 'unknown'}`);
        }
        return r.data;
      }, { maxAttempts: 3 }, `slack:getChannelMessages:${channelId}`);

      messages.push(...res.messages);
      cursor = res.has_more ? (res as any).response_metadata?.next_cursor : undefined;
    } while (cursor);

    return messages;
  }
}
