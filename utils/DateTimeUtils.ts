export const formatDOB = (text: string) => {
  // Remove any non-numeric characters
  const cleaned = text.replace(/\D/g, '');

  // Format the cleaned input as YYYY-MM-DD
  let formatted = '';
  if (cleaned.length > 0) {
    formatted = cleaned.slice(0, 4);
  }
  if (cleaned.length > 4) {
    formatted += `-${cleaned.slice(4, 6)}`;
  }
  if (cleaned.length > 6) {
    formatted += `-${cleaned.slice(6, 8)}`;
  }

  return formatted;
};

export const isDateAvailable = (begin: Date, end: Date) => {
  const today = new Date();
  return today >= begin && today <= end;
};

export const getTimestamp = (date: Date) => {
  const hours = date.getHours() > 10 ? date.getHours() : `0${date.getHours()}`;
  const minutes = date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`;
  return `${hours}:${minutes}`;
};

export const getEventDateInfo = (begin: Date, end: Date) => {
  const beginDate = new Date(begin).toLocaleDateString();
  const endDate = new Date(end).toLocaleDateString();

  const beginTimestamp = getTimestamp(new Date(begin));
  const endTimestamp = getTimestamp(new Date(end));

  const isCurrent = isDateAvailable(new Date(begin), new Date(end));
  return { beginDate, endDate, beginTimestamp, endTimestamp, isCurrent };
};

export const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const getDiff = (assigned_on: string, duration: number) => {
  const date = new Date(assigned_on.replace(' ', 'T'));
  date.setSeconds(date.getSeconds() + duration);
  // count hours to expired
  const diff = date.getTime() - Date.now();
  const diffHours = Math.floor(diff / 3600000);
  const diffDays = Math.floor(diff / 86400000);

  return { date, diff, diffHours, diffDays };
};

export const getTimeDifference = (sendDate: string): string => {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(sendDate).getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}min`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInDays < 30) {
    return `${diffInWeeks}w`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInDays < 365) {
    return `${diffInMonths}m`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y`;
};
