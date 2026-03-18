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
      transcript
      meeting_link
    }
  }
`;
