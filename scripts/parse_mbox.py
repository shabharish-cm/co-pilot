#!/usr/bin/env python3
"""
Parse a Gmail .mbox export and extract sender/receiver pairs per message.

Usage:
    python3 scripts/parse_mbox.py <path-to-file.mbox> [--output output.csv]

Output columns:
    date, message_id, thread_subject, from_name, from_email, to_name, to_email, cc_emails
"""

import mailbox
import csv
import sys
import argparse
from email.header import decode_header
from email.utils import parseaddr, getaddresses
import re


def decode_str(value: str) -> str:
    """Decode RFC 2822 encoded header values (e.g. =?UTF-8?B?...?=)."""
    if not value:
        return ""
    parts = decode_header(value)
    result = []
    for part, encoding in parts:
        if isinstance(part, bytes):
            result.append(part.decode(encoding or "utf-8", errors="replace"))
        else:
            result.append(part)
    return " ".join(result).strip()


def parse_address(raw: str) -> tuple[str, str]:
    """Return (display_name, email) from a raw address string."""
    name, email = parseaddr(decode_str(raw))
    return name.strip(), email.strip().lower()


def parse_address_list(raw: str) -> list[str]:
    """Return a flat list of email addresses from a To/Cc header."""
    if not raw:
        return []
    decoded = decode_str(raw)
    pairs = getaddresses([decoded])
    return [email.strip().lower() for _, email in pairs if email.strip()]


def clean_subject(subject: str) -> str:
    """Strip Re:/Fwd: prefixes for cleaner thread grouping."""
    return re.sub(r"^(re|fwd|fw):\s*", "", subject, flags=re.IGNORECASE).strip()


def parse_mbox(mbox_path: str) -> list[dict]:
    mbox = mailbox.mbox(mbox_path)
    rows = []

    for i, message in enumerate(mbox):
        try:
            from_name, from_email = parse_address(message.get("From", ""))
            to_raw = message.get("To", "")
            to_name, to_email = parse_address(to_raw)
            cc_emails = parse_address_list(message.get("Cc", ""))

            subject = decode_str(message.get("Subject", ""))
            thread_subject = clean_subject(subject)
            date = message.get("Date", "").strip()
            message_id = message.get("Message-ID", "").strip()

            rows.append({
                "date": date,
                "message_id": message_id,
                "subject": subject,
                "thread_subject": thread_subject,
                "from_name": from_name,
                "from_email": from_email,
                "to_name": to_name,
                "to_email": to_email,
                "cc_emails": "; ".join(cc_emails),
            })
        except Exception as e:
            print(f"  Warning: skipped message {i} — {e}", file=sys.stderr)

    return rows


def write_csv(rows: list[dict], output_path: str):
    if not rows:
        print("No messages found.")
        return
    fieldnames = ["date", "message_id", "subject", "thread_subject",
                  "from_name", "from_email", "to_name", "to_email", "cc_emails"]
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print(f"Wrote {len(rows)} messages → {output_path}")


def main():
    parser = argparse.ArgumentParser(description="Parse Gmail .mbox export")
    parser.add_argument("mbox_file", help="Path to the .mbox file")
    parser.add_argument("--output", default="mbox_contacts.csv",
                        help="Output CSV path (default: mbox_contacts.csv)")
    args = parser.parse_args()

    print(f"Parsing {args.mbox_file} ...")
    rows = parse_mbox(args.mbox_file)
    print(f"Found {len(rows)} messages.")
    write_csv(rows, args.output)


if __name__ == "__main__":
    main()
