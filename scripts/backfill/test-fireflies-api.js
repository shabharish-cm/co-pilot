const FIREFLIES_API_KEY = "19c56f5b-adb9-4b60-99a7-984fea828c05";
const TRANSCRIPT_ID ="01KM0G8MPDGTB37681VC2EEMW0"; // Or hardcode your ID here

const query = `
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

async function getTranscript() {
  if (!FIREFLIES_API_KEY || !TRANSCRIPT_ID) {
    console.error("Missing FIREFLIES_API_KEY or UUID environment variables.");
    return;
  }

  try {
    const response = await fetch("https://api.fireflies.ai/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FIREFLIES_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        variables: { id: TRANSCRIPT_ID },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
    } else {
      console.log("Transcript Data:", JSON.stringify(result.data.transcript, null, 2));
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

getTranscript();