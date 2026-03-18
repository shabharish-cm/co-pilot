import axios from 'axios';
import { withRetry } from '../../utils/retry';
import { TRANSCRIPTS_QUERY, TRANSCRIPT_BY_ID_QUERY } from './queries';
import type { FirefliesTranscript, FirefliesListResponse, FirefliesSingleResponse } from './types';

const ENDPOINT = 'https://api.fireflies.ai/graphql';

export class FirefliesClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getTranscriptById(id: string): Promise<FirefliesTranscript | null> {
    return withRetry(async () => {
      const res = await axios.post<FirefliesSingleResponse>(
        ENDPOINT,
        { query: TRANSCRIPT_BY_ID_QUERY, variables: { id } },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (res.data.errors?.length) {
        throw new Error(`Fireflies API error: ${res.data.errors[0].message}`);
      }

      return res.data.data?.transcript ?? null;
    }, { maxAttempts: 3 }, `fireflies:getTranscriptById:${id}`);
  }

  async getTranscripts(fromDate: Date, toDate: Date): Promise<FirefliesTranscript[]> {
    return withRetry(async () => {
      const res = await axios.post<FirefliesListResponse>(
        ENDPOINT,
        {
          query: TRANSCRIPTS_QUERY,
          variables: {
            fromDate: fromDate.toISOString(),
            toDate:   toDate.toISOString(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (res.data.errors?.length) {
        throw new Error(`Fireflies API error: ${res.data.errors[0].message}`);
      }

      return res.data.data?.transcripts ?? [];
    }, { maxAttempts: 3 }, 'fireflies:getTranscripts');
  }
}
