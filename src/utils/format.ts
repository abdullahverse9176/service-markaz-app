/**
 * Format a rating number to one decimal place
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

/**
 * Format distance in km — shows meters if < 1 km
 */
export const formatDistance = (km: number | null | undefined): string => {
  if (km == null) return '';
  if (km < 1) return `${Math.round(km * 1000)}m away`;
  return `${km.toFixed(1)} km away`;
};

/**
 * Format a phone number for display
 */
export const formatPhone = (phone: string): string => {
  return phone.startsWith('+') ? phone : `+92${phone.replace(/^0/, '')}`;
};

/**
 * Truncate text to a max length with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
};

/**
 * Format a date string to a human-readable relative time
 */
export const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

/**
 * Get initials from a name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

/**
 * Format lead status to display label
 */
export const formatLeadStatus = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'Pending',
    awaiting_response: 'Awaiting Response',
    confirmed: 'Confirmed',
    rejected: 'Rejected',
    disputed: 'Disputed',
  };
  return map[status] ?? status;
};
