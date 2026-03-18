# Slack App Setup — PM Co-Pilot

The fastest way to create the app is via manifest — one paste, done. Manual steps are included below as a fallback.

---

## Option A — Create from Manifest (recommended)

### Step 1 — Create the app

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps)
2. Click **Create New App**
3. Choose **From an app manifest**
4. Select your CultureMonkey workspace → **Next**
5. Paste the manifest below into the **JSON** tab → **Next** → **Create**

```json
{
  "display_information": {
    "name": "TranscriptSurfer",
    "description": "Reads Fireflies call summaries from Slack channels for the PM Co-Pilot daily sync.",
    "background_color": "#1a1a2e"
  },
  "features": {
    "bot_user": {
      "display_name": "TranscriptSurfer",
      "always_online": false
    }
  },
  "oauth_config": {
    "scopes": {
      "bot": [
        "channels:history",
        "channels:read",
        "groups:history",
        "groups:read"
      ]
    }
  },
  "settings": {
    "org_deploy_enabled": false,
    "socket_mode_enabled": false,
    "is_hosted": false,
    "token_rotation_enabled": false
  }
}
```

> `channels:*` covers public channels. `groups:*` covers private channels. Add both so it works regardless of how `cs-call-summary` and `demo-summary` are configured.

### Step 2 — Install to workspace

1. After creation you'll land on the app's **Basic Information** page
2. Scroll to **Install your app** → click **Install to Workspace** → **Allow**
3. Go to **OAuth & Permissions** in the sidebar
4. Copy the **Bot User OAuth Token** — this is your `SLACK_BOT_TOKEN`

### Step 3 — Invite the bot to both channels

In Slack, open each channel and run:
```
/invite @TranscriptSurfer
```
Do this for both `cs-call-summary` and `demo-summary`.

### Step 4 — Get channel IDs

**From the Slack UI:** Right-click the channel name → **View channel details** → scroll to the bottom. The ID looks like `C08ABC1234`.

**From the browser URL:** Open the channel in Slack in your browser. The URL is `https://app.slack.com/client/TXXXXXXX/C08ABC1234` — the last segment is the channel ID.

Collect:
- `cs-call-summary` → `SLACK_CS_CALL_SUMMARY_CHANNEL_ID`
- `demo-summary` → `SLACK_DEMO_SUMMARY_CHANNEL_ID`

### Step 5 — Add secrets to GitHub

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
|---|---|
| `SLACK_BOT_TOKEN` | Bot User OAuth Token from Step 2 |
| `SLACK_CS_CALL_SUMMARY_CHANNEL_ID` | Channel ID for `cs-call-summary` |
| `SLACK_DEMO_SUMMARY_CHANNEL_ID` | Channel ID for `demo-summary` |

---

## Option B — Manual setup (fallback)

If you prefer to configure scopes by hand:

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps) → **Create New App** → **From scratch**
2. Name it `TranscriptSurfer`, select your workspace → **Create App**
3. Go to **OAuth & Permissions → Bot Token Scopes**, add: `channels:history`, `channels:read`, `groups:history`, `groups:read`
4. Click **Install to Workspace** → **Allow** → copy the Bot User OAuth Token
5. Follow Steps 3–5 from Option A above

---

## Verify

Trigger the workflow manually: **Actions → Daily Fireflies Sync → Run workflow**

Check the logs for:
```
Fetching Slack messages { channels: 2, date: 'YYYY-MM-DD' }
Fireflies IDs extracted from Slack { count: N }
Fireflies transcripts fetched { requested: N, retrieved: N }
Fireflies sync complete { normalized: N, dayKey: 'YYYY-MM-DD' }
```

If `count: 0` on a day with calls, check that the bot was invited to both channels (Step 3).

---

## Troubleshooting

| Error | Fix |
|---|---|
| `not_in_channel` | Run `/invite @TranscriptSurfer` in the channel |
| `channel_not_found` | Wrong channel ID — re-check Step 4 |
| `missing_scope` | Re-check the manifest scopes and reinstall the app |
| `Fireflies API error` | Transcript may be inaccessible with your API key — expected for some calls |
| `count: 0` on a call day | Fireflies bot may have posted outside the day window — check Slack timestamps |
