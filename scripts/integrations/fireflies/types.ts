/** Fireflies GraphQL API shapes */
export interface FirefliesTranscript {
  id: string;
  title: string;
  date: number;           // Unix timestamp ms
  participants: string[];
  summary?: {
    overview?: string;
    action_items?: string;
    notes?: string;
    keywords?: string[];
  };
  transcript?: string;
  fireflies_users?: string[];
  meeting_link?: string;
}

export interface FirefliesListResponse {
  data: {
    transcripts: FirefliesTranscript[];
  };
  errors?: Array<{ message: string }>;
}

export interface FirefliesSingleResponse {
  data: {
    transcript: FirefliesTranscript | null;
  };
  errors?: Array<{ message: string }>;
}
