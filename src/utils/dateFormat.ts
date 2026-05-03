import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

// ─── Types ────────────────────────────────────────────────────────────────────

/** Accepts ISO strings, Unix timestamps (s or ms), or Date objects */
export type DateInput = string | number | Date;

export type Timezone = string;

/** Day.js format tokens */
export type DateFormat = string;

// ─── Constants ────────────────────────────────────────────────────────────────

const MS_THRESHOLD = 10_000_000_000;

export const DateFormats = {
  ISO: 'YYYY-MM-DD HH:mm:ss',
  DATE: 'YYYY-MM-DD',
  TIME_24: 'HH:mm:ss',
  TIME_12: 'hh:mm A',
  DATETIME_12: 'YYYY-MM-DD hh:mm A',
  US: 'MM/DD/YYYY',
  EU: 'DD/MM/YYYY',
  FULL: 'dddd, MMMM D, YYYY h:mm A',
  SHORT: 'MMM D, YYYY',
  MONTH_YEAR: 'MMMM YYYY',
} as const;

export type DateFormatKey = keyof typeof DateFormats;

// ─── Core (internal) ──────────────────────────────────────────────────────────

/**
 * Normalizes any DateInput into a Dayjs object.
 * Single source of truth — no duplication across functions.
 */
function toDayjs(input: DateInput): Dayjs {
  if (input instanceof Date) {
    return dayjs(input);
  }

  if (typeof input === 'number') {
    const d = input < MS_THRESHOLD ? dayjs.unix(input) : dayjs(input);
    if (!d.isValid()) throw new Error(`Invalid timestamp: ${input}`);
    return d;
  }

  // Numeric string → treat as Unix timestamp
  if (/^\d+$/.test(input)) {
    const num = Number(input);
    return num < MS_THRESHOLD ? dayjs.unix(num) : dayjs(num);
  }

  const d = dayjs(input);
  if (!d.isValid()) throw new Error(`Invalid date string: "${input}"`);
  return d;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * Format a date with optional timezone.
 * @example
 * formatDate(1714000000, DateFormats.FULL, 'Asia/Ho_Chi_Minh')
 * // → "Monday, April 25, 2024 12:26 AM"
 */
export function formatDate(
  input: DateInput,
  format: DateFormat = DateFormats.ISO,
  tz: Timezone = dayjs.tz.guess()
): string {
  return toDayjs(input).tz(tz).format(format);
}

/**
 * Human-readable relative time.
 * @example
 * timeAgo('2024-04-01') // → "a month ago"
 */
export function timeAgo(input: DateInput): string {
  return toDayjs(input).fromNow();
}

/**
 * Convert a date from one timezone to another.
 */
export function convertTz(
  input: DateInput,
  fromTz: Timezone,
  toTz: Timezone,
  format: DateFormat = DateFormats.ISO
): string {
  return toDayjs(input).tz(fromTz).tz(toTz).format(format);
}

/**
 * Returns a raw Dayjs object for advanced manipulation.
 * Escape hatch — prefer the typed helpers above.
 */
export function toDateObject(
  input: DateInput,
  tz: Timezone = dayjs.tz.guess()
): Dayjs {
  return toDayjs(input).tz(tz);
}

/** Returns the current system IANA timezone string. */
export const guessTimezone = (): Timezone => dayjs.tz.guess();

/**
 * Convert any DateInput to a UTC ISO 8601 string with Z suffix.
 * @example
 * toUTC('2024-04-25 07:00:00')     // → "2024-04-25T00:00:00.000Z"
 * toUTC(1714000000)                // → "2024-04-25T05:06:40.000Z"
 * toUTC(new Date())                // → "2026-05-03T12:00:00.000Z"
 */
export function toUTC(input: DateInput): string {
  return toDayjs(input).utc().toISOString();
}
