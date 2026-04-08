/**
 * Formats a number as a currency string.
 * @param amount - The amount to format.
 * @param locale - The locale to use (default: 'vi-VN').
 * @param currency - The currency code (default: 'VND').
 */
export const formatCurrency = (amount: number, locale: string = 'vi-VN', currency: string = 'VND') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Formats a date object or string into a readable string.
 * @param date - The date to format.
 * @param locale - The locale to use (default: 'vi-VN').
 */
export const formatDate = (date: Date | string, locale: string = 'vi-VN') => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(d);
};
