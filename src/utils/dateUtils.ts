import { format, subYears, parseISO } from 'date-fns';

/**
 * Get date from exactly 100 years ago
 */
export const getHistoricalDate = (): Date => {
  const today = new Date();
  return subYears(today, 100);
};

/**
 * Format the historical date in various formats
 */
export const formatHistoricalDate = (date: Date, formatString: string = 'MMMM d, yyyy'): string => {
  return format(date, formatString);
};

/**
 * Format the historical date in New York Times style (e.g., "MONDAY, JUNE 15, 1924")
 */
export const formatNewspaperDate = (date: Date): string => {
  const day = format(date, 'EEEE').toUpperCase();
  const month = format(date, 'MMMM').toUpperCase();
  const dayOfMonth = format(date, 'd');
  const year = format(date, 'yyyy');
  
  return `${day}, ${month} ${dayOfMonth}, ${year}`;
};

/**
 * Format the current date in a standard format
 */
export const formatCurrentDate = (): string => {
  return format(new Date(), 'MMMM d, yyyy');
};

/**
 * Parse an ISO string date and return a Date object
 */
export const parseDate = (isoString: string): Date => {
  return parseISO(isoString);
};