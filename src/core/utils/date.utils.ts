/**
 * Get the current date in YYYYMMDDHHIISS format
 * @returns string Current date formatted as YYYYMMDDHHIISS
 */
export const getCurrentDateYYYYMMDDHHIISS = (): string => {
  const now = new Date();
  return now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');
};

/**
 * Get a future date in YYYYMMDDHHIISS format by adding seconds to current date
 * @param seconds Number of seconds to add to current date
 * @returns string Future date in YYYYMMDDHHIISS format
 */
export const getFutureDate = (seconds: number): string => {
  const futureDate = new Date();
  futureDate.setSeconds(futureDate.getSeconds() + seconds);
  return futureDate.getFullYear() +
    String(futureDate.getMonth() + 1).padStart(2, '0') +
    String(futureDate.getDate()).padStart(2, '0') +
    String(futureDate.getHours()).padStart(2, '0') +
    String(futureDate.getMinutes()).padStart(2, '0') +
    String(futureDate.getSeconds()).padStart(2, '0');
}; 