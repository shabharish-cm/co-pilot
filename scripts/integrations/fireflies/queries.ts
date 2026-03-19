export const TRANSCRIPT_BY_ID_QUERY = `
  query GetTranscriptById($id: String!) {
    transcript(id: $id) {
      id
      title
      date
      participants
      summary {
        overview
        action_items
        notes
        keywords
      }
      sentences {
        index
        speaker_name
        raw_text
        start_time
      }
      meeting_link
    }
  }
`;

export const TRANSCRIPTS_QUERY = `
  query Transcripts($fromDate: DateTime, $toDate: DateTime) {
    transcripts(fromDate: $fromDate, toDate: $toDate) {
      id
      title
      date
      participants
      summary {
        overview
        action_items
        notes
        keywords
      }
      sentences {
        index
        speaker_name
        raw_text
        start_time
      }
      meeting_link
    }
  }
`;
