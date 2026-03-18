type Level = 'info' | 'warn' | 'error' | 'debug';

function fmt(level: Level, message: string, data?: unknown): string {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level.toUpperCase()}] ${message}`;
  return data !== undefined ? `${base} ${JSON.stringify(data)}` : base;
}

export const logger = {
  info:  (msg: string, data?: unknown) => console.log(fmt('info', msg, data)),
  warn:  (msg: string, data?: unknown) => console.warn(fmt('warn', msg, data)),
  error: (msg: string, data?: unknown) => console.error(fmt('error', msg, data)),
  debug: (msg: string, data?: unknown) => {
    if (process.env.DEBUG) console.log(fmt('debug', msg, data));
  },
};
