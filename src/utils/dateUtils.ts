/**
 * Date validation utilities
 */

/**
 * Validates if a string is in ISO 8601 date format (YYYY-MM-DD)
 * @param date - String to validate
 * @returns true if date matches ISO format, false otherwise
 */
export const isValidISODate = (date: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

/**
 * Calculates the age of a date in days
 * @param date - Date string in ISO format (YYYY-MM-DD)
 * @returns Number of days since the given date (always positive)
 */
export const calculateDaysOld = (date: string): number => {
  const givenDate = new Date(date);
  const today = new Date();
  
  // Use UTC dates to ensure consistent calculation across timezones
  const utcGivenDate = new Date(Date.UTC(
    givenDate.getUTCFullYear(),
    givenDate.getUTCMonth(),
    givenDate.getUTCDate()
  ));
  
  const utcToday = new Date(Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  ));
  
  const diffTime = utcToday.getTime() - utcGivenDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};
