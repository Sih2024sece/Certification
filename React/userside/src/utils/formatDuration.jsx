// utils/formatDuration.js

export const formatDuration = (seconds) => {
    if (seconds >= 2592000) { // 30 days
      const months = Math.floor(seconds / 2592000);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else if (seconds >= 604800) { // 7 days
      const weeks = Math.floor(seconds / 604800);
      return `${weeks} week${weeks > 1 ? 's' : ''}`;
    } else if (seconds >= 86400) { // 1 day
      const days = Math.floor(seconds / 86400);
      return `${days} day${days > 1 ? 's' : ''}`;
    } else {
      return `${Math.floor(seconds / 3600)} hour${seconds >= 7200 ? 's' : ''}`;
    }
  };
  