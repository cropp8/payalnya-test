/**
 * Formats ISO date string to human readable
 */
export const formatDate = (isoString: string): string => {
  if (!isoString) return '';

  const date = new Date(isoString);

  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};
