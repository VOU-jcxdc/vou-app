export const formatDOB = (text: string) => {
  // Remove any non-numeric characters
  const cleaned = text.replace(/\D/g, '');

  // Format the cleaned input as DD-MM-YYYY
  let formatted = cleaned;
  if (cleaned.length > 4) {
    formatted = `${cleaned.slice(6, 8)}-${cleaned.slice(4, 6)}-${cleaned.slice(0, 4)}`;
  }
  if (cleaned.length > 6) {
    formatted = `${cleaned.slice(6, 8)}-${cleaned.slice(4, 6)}-${cleaned.slice(0, 4)}`;
  }

  return formatted;
};

export const isCurrentEvent = (beginDate: Date, endDate: Date) => {
  const today = new Date();
  return today >= beginDate && today <= endDate;
};
