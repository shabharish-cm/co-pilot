import { logger } from './logger';

interface RetryOptions {
  maxAttempts: number;
  initialDelayMs: number;
  backoffFactor: number;
}

const DEFAULT_OPTS: RetryOptions = {
  maxAttempts: 3,
  initialDelayMs: 500,
  backoffFactor: 2,
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: Partial<RetryOptions> = {},
  label = 'operation',
): Promise<T> {
  const { maxAttempts, initialDelayMs, backoffFactor } = { ...DEFAULT_OPTS, ...opts };
  let delay = initialDelayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      logger.warn(`${label} failed (attempt ${attempt}/${maxAttempts}), retrying in ${delay}ms`, err);
      await new Promise(r => setTimeout(r, delay));
      delay *= backoffFactor;
    }
  }
  throw new Error('unreachable');
}
