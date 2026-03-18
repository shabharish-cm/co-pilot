import { todayKey, previousDayKey, dayStartUTC, dayEndUTC, dueSoonCutoff, isStale, isoNow, weekKey } from '../../../scripts/utils/date';

const TZ = 'Asia/Kolkata';

describe('date utils', () => {
  test('todayKey returns YYYY-MM-DD', () => {
    expect(todayKey(TZ)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('previousDayKey is one day before todayKey', () => {
    const today = new Date(todayKey(TZ));
    const prev  = new Date(previousDayKey(TZ));
    expect(today.getTime() - prev.getTime()).toBe(86400000);
  });

  test('dayStartUTC < dayEndUTC', () => {
    const start = dayStartUTC('2026-03-18', TZ);
    const end   = dayEndUTC('2026-03-18', TZ);
    expect(start.getTime()).toBeLessThan(end.getTime());
  });

  test('isStale returns true for null timestamp', () => {
    expect(isStale(null, 1000)).toBe(true);
  });

  test('isStale returns false for recent timestamp', () => {
    expect(isStale(new Date().toISOString(), 60_000)).toBe(false);
  });

  test('isStale returns true for old timestamp', () => {
    const old = new Date(Date.now() - 100_000).toISOString();
    expect(isStale(old, 10_000)).toBe(true);
  });

  test('isoNow returns valid ISO string', () => {
    expect(() => new Date(isoNow())).not.toThrow();
  });

  test('weekKey format', () => {
    expect(weekKey('2026-03-18')).toMatch(/^\d{4}-W\d{2}$/);
  });

  test('dueSoonCutoff is 3 calendar days from now', () => {
    const cutoff   = dueSoonCutoff(TZ);
    const today    = todayKey(TZ);
    const todayD   = new Date(today);
    const cutoffD  = new Date(cutoff);
    const diffDays = Math.round((cutoffD.getTime() - todayD.getTime()) / 86400000);
    expect(diffDays).toBe(3);
  });
});
