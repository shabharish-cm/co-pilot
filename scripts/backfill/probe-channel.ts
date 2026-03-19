/**
 * Probe a single channel for a date range and dump raw message content.
 * Usage: npx tsx scripts/backfill/probe-channel.ts [--channel cs|demo] [--from 2025-08-01] [--to 2025-08-07]
 */
import { format, subDays, startOfDay, endOfDay, parseISO } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { ENV } from '../config/env';
import { SlackClient } from '../integrations/slack/client';

const TZ = ENV.timezone;

function getArg(flag: string): string | null {
  const idx = process.argv.indexOf(flag);
  return idx === -1 ? null : process.argv[idx + 1] ?? null;
}

const channelArg = getArg('--channel') ?? 'demo';
const fromArg    = getArg('--from');
const toArg      = getArg('--to');

const channelId = channelArg === 'cs'
  ? ENV.slack.csCallSummaryChannelId
  : ENV.slack.demoSummaryChannelId;

function dayWindow(dayKey: string) {
  const zoned = toZonedTime(new Date(dayKey + 'T00:00:00'), TZ);
  return {
    oldest: fromZonedTime(startOfDay(zoned), TZ).getTime() / 1000,
    latest: fromZonedTime(endOfDay(zoned),   TZ).getTime() / 1000,
  };
}

async function main() {
  const now   = toZonedTime(new Date(), TZ);
  const from  = fromArg ?? format(subDays(now, 30), 'yyyy-MM-dd');
  const to    = toArg   ?? format(subDays(now, 1),  'yyyy-MM-dd');

  console.log(`\n━━━ Channel Probe ━━━`);
  console.log(`  Channel: ${channelArg} (${channelId})`);
  console.log(`  Range:   ${from} → ${to}\n`);

  const slack = new SlackClient(ENV.slack.botToken);

  // Build day list
  const days: string[] = [];
  let cur = parseISO(from);
  const end = parseISO(to);
  while (cur <= end) {
    days.push(format(cur, 'yyyy-MM-dd'));
    cur = new Date(cur.getTime() + 86400000);
  }

  for (const dayKey of days) {
    const { oldest, latest } = dayWindow(dayKey);
    let msgs: any[];
    try {
      msgs = await slack.getChannelMessages(channelId, oldest, latest);
    } catch (err) {
      console.log(`  ${dayKey}  ✗ ${(err as Error).message}`);
      await new Promise(r => setTimeout(r, 1500));
      continue;
    }

    if (msgs.length === 0) continue;

    console.log(`\n▶ ${dayKey}  (${msgs.length} messages)`);
    for (const msg of msgs) {
      console.log(`  ── ts=${msg.ts} bot_id=${msg.bot_id ?? '-'} ──`);

      if (msg.text) {
        console.log(`     text: ${msg.text.slice(0, 300).replace(/\n/g, ' ↵ ')}`);
      }

      for (const att of msg.attachments ?? []) {
        console.log(`     attachment:`);
        if (att.title)      console.log(`       title:      ${att.title}`);
        if (att.title_link) console.log(`       title_link: ${att.title_link}`);
        if (att.text)       console.log(`       text:       ${att.text.slice(0, 200).replace(/\n/g, ' ↵ ')}`);
        if (att.fallback)   console.log(`       fallback:   ${att.fallback.slice(0, 200)}`);
      }

      for (const block of msg.blocks ?? []) {
        if (block.text?.text) console.log(`     block.text: ${block.text.text.slice(0, 200).replace(/\n/g, ' ↵ ')}`);
        for (const el of block.elements ?? []) {
          if (el.url)  console.log(`     block.el.url: ${el.url}`);
          if (el.text) console.log(`     block.el.text: ${String(el.text).slice(0, 100)}`);
        }
      }
    }

    await new Promise(r => setTimeout(r, 1500)); // rate limit
  }

  console.log('\n━━━ Done ━━━');
}

main().catch(err => { console.error(err); process.exit(1); });
