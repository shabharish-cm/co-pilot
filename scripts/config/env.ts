import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

function required(key: string): string {
  const val = process.env[key];
  // In test environments, fall back to empty string to avoid crashing module load.
  // API calls will fail at runtime if the key is missing — that is correct behaviour.
  if (!val && process.env.NODE_ENV !== 'test') {
    throw new Error(`Missing required env var: ${key}`);
  }
  return val ?? '';
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const ENV = {
  todoist: {
    apiToken:   required('TODOIST_API_TOKEN'),
    projectId:  optional('TODOIST_PROJECT_ID', '6g8q49QQxHrFxRFx'),
  },
  gcal: {
    serviceAccountJson: required('GCAL_SERVICE_ACCOUNT_JSON'),
    calendarId:         optional('GCAL_CALENDAR_ID', 'primary'),
  },
  fireflies: {
    apiKey: required('FIREFLIES_API_KEY'),
  },
  timezone: optional('TIMEZONE', 'Asia/Kolkata'),
} as const;
