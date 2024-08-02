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

export const dateRegex = /^\d{4}-\d{2}-\d{2}$/;