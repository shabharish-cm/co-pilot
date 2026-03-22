import type { NextConfig } from 'next';
import { config } from 'dotenv';
import path from 'path';

// Selectively override process.env with non-empty values from .env.local.
// This ensures .env.local credentials win over stale system env vars,
// while preserving system-only vars (e.g. ANTHROPIC_API_KEY) if .env.local has them empty.
const localEnv = config({ path: path.resolve(process.cwd(), '.env.local') });
if (localEnv.parsed) {
  for (const [key, val] of Object.entries(localEnv.parsed)) {
    if (val !== '') process.env[key] = val;
  }
}

const nextConfig: NextConfig = {
  serverExternalPackages: ['google-auth-library'],
};

export default nextConfig;
