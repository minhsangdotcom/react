/**
 * Date parsing utility with timezone support using Day.js
 * Handles both date strings and Unix timestamps (in seconds or milliseconds)
 */

import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Input types for date parsing
 */
export type DateInput = string | number;

/**
 * IANA timezone string
 */
export type Timezone = string;

/**
 * Date format string using Day.js tokens
 */
export type DateFormat = string;

/**
 * Common date formats (Day.js format tokens)
 */
export const DateFormats = {
  ISO: 'YYYY-MM-DD HH:mm:ss',
  DATE_ONLY: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm:ss',
  DATETIME_12H: 'YYYY-MM-DD hh:mm:ss A',
  US_FORMAT: 'MM/DD/YYYY HH:mm:ss',
  EU_FORMAT: 'DD/MM/YYYY HH:mm:ss',
  FULL: 'dddd, MMMM D, YYYY h:mm A',
  SHORT: 'MMM D, YYYY',
} as const;

/**
 * Type for DateFormats keys
 */
export type DateFormatKey = keyof typeof DateFormats;

/**
 * Parse a date or Unix timestamp to a specific format with timezone
 * @param input - Date string or Unix timestamp (seconds or milliseconds)
 * @param format - Output format (default: 'YYYY-MM-DD HH:mm:ss')
 * @param tz - IANA timezone (default: system timezone)
 * @returns Formatted date string
 * @throws Error if input is invalid
 */
export function parseDateTime(
  input: DateInput,
  format: DateFormat = 'YYYY-MM-DD HH:mm:ss',
  tz: Timezone = dayjs.tz.guess()
): string {
  let dayjsObj: Dayjs;

  // Handle Unix timestamp (detect if it's in seconds or milliseconds)
  if (typeof input === 'number') {
    // If the number is less than 10000000000, it's likely in seconds
    if (input < 10000000000) {
      dayjsObj = dayjs.unix(input);
    } else {
      dayjsObj = dayjs(input);
    }
  } 
  // Handle date string
  else if (typeof input === 'string') {
    // Try parsing as Unix timestamp if it's a numeric string
    if (/^\d+$/.test(input)) {
      const num = parseInt(input, 10);
      if (num < 10000000000) {
        dayjsObj = dayjs.unix(num);
      } else {
        dayjsObj = dayjs(num);
      }
    } else {
      dayjsObj = dayjs(input);
    }
  } else {
    throw new Error('Input must be a date string or Unix timestamp');
  }

  // Validate date
  if (!dayjsObj.isValid()) {
    throw new Error('Invalid date input');
  }

  // Convert to target timezone and format
  return dayjsObj.tz(tz).format(format);
}

/**
 * Parse with 12-hour format (AM/PM)
 * @param input - Date string or Unix timestamp
 * @param tz - IANA timezone (default: system timezone)
 * @returns Formatted date string with AM/PM
 * @throws Error if input is invalid
 */
export function parseDateTime12h(
  input: DateInput,
  tz: Timezone = dayjs.tz.guess()
): string {
  let dayjsObj: Dayjs;

  if (typeof input === 'number') {
    if (input < 10000000000) {
      dayjsObj = dayjs.unix(input);
    } else {
      dayjsObj = dayjs(input);
    }
  } else if (typeof input === 'string') {
    if (/^\d+$/.test(input)) {
      const num = parseInt(input, 10);
      if (num < 10000000000) {
        dayjsObj = dayjs.unix(num);
      } else {
        dayjsObj = dayjs(num);
      }
    } else {
      dayjsObj = dayjs(input);
    }
  } else {
    throw new Error('Input must be a date string or Unix timestamp');
  }

  if (!dayjsObj.isValid()) {
    throw new Error('Invalid date input');
  }

  return dayjsObj.tz(tz).format('YYYY-MM-DD hh:mm:ss A');
}

/**
 * Get current timezone
 * @returns IANA timezone string
 */
export function getCurrentTimezone(): Timezone {
  return dayjs.tz.guess();
}

/**
 * Convert between timezones
 * @param input - Date string or Unix timestamp
 * @param fromTz - Source timezone
 * @param toTz - Target timezone
 * @param format - Output format (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns Formatted date string in target timezone
 * @throws Error if input is invalid
 */
export function convertTimezone(
  input: DateInput,
  fromTz: Timezone,
  toTz: Timezone,
  format: DateFormat = 'YYYY-MM-DD HH:mm:ss'
): string {
  let dayjsObj: Dayjs;
  
  if (typeof input === 'number') {
    dayjsObj = input < 10000000000 ? dayjs.unix(input) : dayjs(input);
  } else {
    dayjsObj = dayjs(input);
  }
  
  if (!dayjsObj.isValid()) {
    throw new Error('Invalid date input');
  }
  
  return dayjsObj.tz(fromTz).tz(toTz).format(format);
}

/**
 * Parse date and return Day.js object for advanced manipulation
 * @param input - Date string or Unix timestamp
 * @param tz - IANA timezone (default: system timezone)
 * @returns Day.js object
 * @throws Error if input is invalid
 */
export function parseDateObject(
  input: DateInput,
  tz: Timezone = dayjs.tz.guess()
): Dayjs {
  let dayjsObj: Dayjs;

  if (typeof input === 'number') {
    dayjsObj = input < 10000000000 ? dayjs.unix(input) : dayjs(input);
  } else if (typeof input === 'string') {
    if (/^\d+$/.test(input)) {
      const num = parseInt(input, 10);
      dayjsObj = num < 10000000000 ? dayjs.unix(num) : dayjs(num);
    } else {
      dayjsObj = dayjs(input);
    }
  } else {
    throw new Error('Input must be a date string or Unix timestamp');
  }

  if (!dayjsObj.isValid()) {
    throw new Error('Invalid date input');
  }

  return dayjsObj.tz(tz);
}