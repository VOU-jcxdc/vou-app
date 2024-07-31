export const formatPhoneNumber = (text: string) => {
  // Ensure the '+84 ' prefix is always present
  if (!text.startsWith('+84 ')) {
    text = '+84 ' + text.replace(/^\+84\s*/, '');
  }

  let formatted = text.startsWith('+84') ? text : `+84 ${text}`;

  // Truncate the number if it exceeds the length limit
  if (formatted.length > 14) {
    formatted = formatted.slice(0, 14);
  }

  return formatted;
};

export const phoneRegex = /^\+84\s\d{9,10}$/; // Adjust the regex pattern according to your phone number format
