export const formatDOB = (text: string) => {
  // Remove any non-numeric characters
  const cleaned = text.replace(/\D/g, '');

  // Format the cleaned input as DD-MM-YYYY
  let formatted = '';
  if (cleaned.length > 0) {
    formatted = cleaned.slice(0, 2);
  }
  if (cleaned.length > 2) {
    formatted += `-${cleaned.slice(2, 4)}`;
  }
  if (cleaned.length > 4) {
    formatted += `-${cleaned.slice(4, 8)}`;
  }

  return formatted;
};

export const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
