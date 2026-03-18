# Slack App Setup — PM Co-Pilot

This guide walks you through creating a Slack app, granting the right permissions, and getting the tokens and channel IDs needed for the Fireflies sync workflow.

---

## Step 1 — Create the Slack App

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps)
2. Click **Create New App**
3. Choose **From scratch**
4. Enter:
   - **App Name:** `pm-copilot-bot` (or any name you like)
   - **Workspace:** Select your CultureMonkey Slack workspace
5. Click **Create App**

---

## Step 2 — Add OAuth Scopes

1. In the left sidebar, click **OAuth & Permissions**
2. Scroll down to **Scopes → Bot Token Scopes**
3. Click **Add an OAuth Scope** and add the following:

| Scope | Why it's needed |
|---|---|
| `channels:history` | Read messages from public channels |
| `channels:read` | Look up channel metadata |
| `groups:history` | Read messages from private channels (if either channel is private) |
| `groups:read` | Look up private channel metadata |

> **Note:** If `cs-call-summary` and `demo-summary` are **public** channels, you only need `channels:history` and `channels:read`. If either is **private**, also add the `groups:*` scopes.

---

## Step 3 — Install the App to Your Workspace

1. Still on the **OAuth & Permissions** page, scroll up to the top
2. Click **Install to Workspace**
3. Review the permissions and click **Allow**
4. You'll be redirected back — copy the **Bot User OAuth Token**
   - It starts with `xoxb-` followed by your workspace and token segments
   - This is your `SLACK_BOT_TOKEN`

---

## Step 4 — Invite the Bot to the Channels

The bot must be a member of each channel to read its history.

1. In Slack, open the `cs-call-summary` channel
2. Type `/invite @pm-copilot-bot` and press Enter
3. Repeat for the `demo-summary` channel

---

## Step 5 — Get the Channel IDs

Slack channel IDs (not names) are needed as env vars. There are two easy ways:

**Option A — From the Slack UI:**
1. Right-click the channel name in the sidebar → **View channel details**
2. Scroll to the bottom of the About tab
3. The Channel ID is shown at the bottom (e.g. `C08ABC1234`)

**Option B — From the URL:**
1. Open the channel in Slack in your browser
2. The URL looks like: `https://app.slack.com/client/T0XXXXXXX/C08ABC1234`
3. The last segment (`C08ABC1234`) is the channel ID

Collect:
- `cs-call-summary` channel ID → `SLACK_CS_CALL_SUMMARY_CHANNEL_ID`
- `demo-summary` channel ID → `SLACK_DEMO_SUMMARY_CHANNEL_ID`

---

## Step 6 — Add Secrets to GitHub

1. Go to your GitHub repo → **Settings → Secrets and variables → Actions**
2. Click **New repository secret** for each of the following:

| Secret name | Value |
|---|---|
| `SLACK_BOT_TOKEN` | Your Bot User OAuth Token (from Step 3) |
| `SLACK_CS_CALL_SUMMARY_CHANNEL_ID` | Channel ID for `cs-call-summary` |
| `SLACK_DEMO_SUMMARY_CHANNEL_ID` | Channel ID for `demo-summary` |

> `FIREFLIES_API_KEY` should already be set from your existing setup. If not, add it too.

---

## Step 7 — Verify

Once secrets are set, trigger the workflow manually:

1. Go to **Actions → Daily Fireflies Sync**
2. Click **Run workflow**
3. Check the logs — you should see:
   ```
   Fetching Slack messages { channels: 2, date: 'YYYY-MM-DD' }
   Fireflies IDs extracted from Slack { count: N }
   Fireflies transcripts fetched { requested: N, retrieved: N }
   Fireflies sync complete { normalized: N, dayKey: 'YYYY-MM-DD' }
   ```

If `count: 0`, either no Fireflies posts were found for the previous day (expected on days with no calls) or the bot doesn't have access to the channel — re-check Step 4.

---

## Troubleshooting

| Error | Fix |
|---|---|
| `Slack API error: not_in_channel` | Bot hasn't been invited — run `/invite @pm-copilot-bot` in the channel |
| `Slack API error: channel_not_found` | Wrong channel ID — re-check Step 5 |
| `Slack API error: missing_scope` | Re-check Step 2 and re-install the app (Step 3) |
| `Fireflies API error: ...` | Transcript may be inaccessible with your API key — expected for some calls |
| `count: 0` on a day that had calls | Fireflies bot may have posted before or after the day window — check Slack timestamps |
