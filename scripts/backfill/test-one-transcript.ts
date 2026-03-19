/**
 * Test script: find the oldest Fireflies transcript in the 6-month Slack window.
 * Extensive logging to diagnose "no calls" issues.
 *
 * Usage: npx tsx scripts/backfill/test-one-transcript.ts
 */

import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { ENV } from '../config/env';
import { SlackClient } from '../integrations/slack/client';
import { extractFirefliesIds } from '../integrations/slack/extractor';
import { FirefliesClient } from '../integrations/fireflies/client';
import { mapFirefliesTranscript } from '../integrations/fireflies/mapper';

const TZ   = ENV.timezone;
const DAYS = 180;

const FIREFLIES_URL_RE = /https:\/\/app\.fireflies\.ai\/view\/(?:[\w-]+::)?([\w-]+)/g;

function dayWindow(dayKey: string) {
  const zoned = toZonedTime(new Date(dayKey + 'T00:00:00'), TZ);
  const start = fromZonedTime(startOfDay(zoned), TZ);
  const end   = fromZonedTime(endOfDay(zoned),   TZ);
  return {
    oldest: start.getTime() / 1000,
    latest: end.getTime()   / 1000,
    startISO: start.toISOString(),
    endISO:   end.toISOString(),
  };
}

function scanForFirefliesUrls(text: string): string[] {
  const re = new RegExp(FIREFLIES_URL_RE.source, 'g');
  const found: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) found.push(m[0]);
  return found;
}

async function main() {
  console.log('\n━━━ Fireflies Backfill Diagnostic ━━━\n');
  console.log(`  Timezone:   ${TZ}`);
  console.log(`  Bot token:  ${ENV.slack.botToken ? ENV.slack.botToken.slice(0, 14) + '...' : '❌ NOT SET'}`);
  console.log(`  CS channel: ${ENV.slack.csCallSummaryChannelId || '❌ NOT SET'}`);
  console.log(`  Demo ch:    ${ENV.slack.demoSummaryChannelId   || '❌ NOT SET'}`);
  console.log(`  FF api key: ${ENV.fireflies.apiKey ? ENV.fireflies.apiKey.slice(0, 8) + '...' : '❌ NOT SET'}`);
  console.log();

  const channelIds = [
    ENV.slack.csCallSummaryChannelId,
    ENV.slack.demoSummaryChannelId,
  ].filter(Boolean);

  if (channelIds.length === 0) {
    console.error('✗ No channel IDs set. Check .env');
    process.exit(1);
  }

  const slack     = new SlackClient(ENV.slack.botToken);
  const fireflies = new FirefliesClient(ENV.fireflies.apiKey);
  const now       = toZonedTime(new Date(), TZ);

  // ── Step 1: probe a single recent day to verify Slack connectivity ──────────
  console.log('─── Step 1: Slack connectivity check (yesterday) ───\n');
  const yesterday = format(subDays(now, 1), 'yyyy-MM-dd');
  const win = dayWindow(yesterday);
  console.log(`  Day:    ${yesterday}`);
  console.log(`  Window: ${win.startISO} → ${win.endISO}`);
  console.log(`  oldest: ${win.oldest}  latest: ${win.latest}\n`);

  for (const channelId of channelIds) {
    try {
      const msgs = await slack.getChannelMessages(channelId, win.oldest, win.latest);
      console.log(`  Channel ${channelId}: ${msgs.length} message(s)`);
      if (msgs.length > 0) {
        console.log(`    First msg ts=${msgs[0].ts} text=${JSON.stringify((msgs[0].text ?? '').slice(0, 80))}`);
      }
    } catch (err) {
      console.error(`  Channel ${channelId}: ✗ ERROR — ${(err as Error).message}`);
    }
  }

  // ── Step 2: scan last 14 days with full message dump ────────────────────────
  console.log('\n─── Step 2: Scanning last 14 days (verbose) ───\n');

  let foundDay: string | null = null;
  let foundIds: string[] = [];

  for (let i = 14; i >= 1; i--) {
    const dayKey = format(subDays(now, i), 'yyyy-MM-dd');
    const { oldest, latest } = dayWindow(dayKey);

    let totalMsgs = 0;
    let allMsgs: any[] = [];

    for (const channelId of channelIds) {
      try {
        const msgs = await slack.getChannelMessages(channelId, oldest, latest);
        totalMsgs += msgs.length;
        allMsgs.push(...msgs);
      } catch (err) {
        console.log(`  ${dayKey} [${channelId}] ✗ ${(err as Error).message}`);
      }
    }

    if (totalMsgs === 0) {
      console.log(`  ${dayKey}  — 0 messages`);
      continue;
    }

    // Check each message for any fireflies.ai content
    let ffUrlsFound = 0;
    for (const msg of allMsgs) {
      const texts: string[] = [];
      if (msg.text) texts.push(msg.text);
      for (const att of msg.attachments ?? []) {
        if (att.text)       texts.push(att.text);
        if (att.fallback)   texts.push(att.fallback);
        if (att.title_link) texts.push(att.title_link);
      }
      for (const block of msg.blocks ?? []) {
        if (block.text?.text) texts.push(block.text.text);
        for (const el of block.elements ?? []) {
          if (el.text) texts.push(el.text);
          if (el.url)  texts.push(el.url);
        }
      }

      const combined = texts.join(' ');
      const urls = scanForFirefliesUrls(combined);
      if (urls.length > 0) {
        ffUrlsFound += urls.length;
        console.log(`  ${dayKey}  ✓ ${totalMsgs} msg(s) — Fireflies URL found: ${urls.join(', ')}`);
      }
    }

    if (ffUrlsFound === 0) {
      // Show what messages ARE there so we can understand the content
      console.log(`  ${dayKey}  — ${totalMsgs} msg(s), no Fireflies URLs`);
      for (const msg of allMsgs.slice(0, 3)) {
        const preview = (msg.text ?? '[no text]').slice(0, 120).replace(/\n/g, ' ');
        const hasAtt  = (msg.attachments?.length ?? 0) > 0;
        const hasBlk  = (msg.blocks?.length ?? 0) > 0;
        console.log(`    ts=${msg.ts} att=${hasAtt} blocks=${hasBlk} "${preview}"`);
      }
    }

    const ids = extractFirefliesIds(allMsgs);
    if (ids.length > 0 && !foundDay) {
      foundDay = dayKey;
      foundIds = ids;
    }
  }

  // ── Step 3: if nothing found in 14 days, scan full 180 days silently ────────
  if (!foundDay) {
    console.log('\n─── Step 3: No hits in last 14 days — scanning full 180 days ───\n');

    for (let i = DAYS; i >= 15; i--) {
      const dayKey = format(subDays(now, i), 'yyyy-MM-dd');
      const { oldest, latest } = dayWindow(dayKey);
      const allMsgs: any[] = [];

      for (const channelId of channelIds) {
        try {
          const msgs = await slack.getChannelMessages(channelId, oldest, latest);
          allMsgs.push(...msgs);
        } catch { /* skip */ }
        await new Promise(r => setTimeout(r, 1500)); // rate limit
      }

      const ids = extractFirefliesIds(allMsgs);
      if (ids.length > 0) {
        console.log(`  First hit: ${dayKey} — IDs: ${ids.join(', ')}`);
        foundDay = dayKey;
        foundIds = ids;
        break;
      }

      if (allMsgs.length > 0) {
        process.stdout.write(`  ${dayKey}: ${allMsgs.length} msgs, no FF URLs\n`);
      }
    }
  }

  // ── Step 4: fetch the transcript ────────────────────────────────────────────
  if (!foundDay || foundIds.length === 0) {
    console.log('\n✗ No Fireflies transcripts found in 180 days.');
    console.log('\nPossible causes:');
    console.log('  1. Fireflies bot posts in a different channel than configured');
    console.log('  2. URL format in messages does not match the regex');
    console.log('  3. Messages are in threads (not top-level) — SlackClient only reads top-level');
    console.log('  4. Channel IDs are wrong');
    process.exit(1);
  }

  console.log(`\n─── Step 4: Fetching transcript from Fireflies ───`);
  console.log(`  Day: ${foundDay}  ID: ${foundIds[0]}\n`);

  const raw = await fireflies.getTranscriptById(foundIds[0]);
  if (!raw) {
    console.error('✗ Fireflies returned null — transcript not accessible via API');
    process.exit(1);
  }

  const normalized = mapFirefliesTranscript(raw, foundDay);
  console.log('✓ Success!');
  console.log(`  Title:        ${raw.title}`);
  console.log(`  Date:         ${raw.date}`);
  console.log(`  Participants: ${raw.participants?.join(', ')}`);
  console.log(`  Overview:     ${(raw.summary?.overview ?? '').slice(0, 150)}...`);
  console.log(`  Sentences:    ${normalized.transcript?.length ?? 0}`);
}

main().catch(err => { console.error(err); process.exit(1); });
