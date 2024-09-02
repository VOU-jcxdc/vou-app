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
