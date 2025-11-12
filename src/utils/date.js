import { formatDistanceToNow, parseISO } from 'date-fns';

export const formatTimeAgo = (dateString) => {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Recently';
  }
};

export const formatDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return '';
  }
};
