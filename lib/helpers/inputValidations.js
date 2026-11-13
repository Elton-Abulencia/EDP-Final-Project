export function getContactError(rawValue) {
  const value = rawValue.trim();
  if (!value) return "";

  if (/^[+\d]/.test(value)) {
    const isValidPHNumber = /^(\+639|09)\d{9}$/.test(value);
    if (!isValidPHNumber) {
      return "Invalid phone number. Use 09XXXXXXXXX or +639XXXXXXXXX.";
    }
    return "";
  }

  if (value.startsWith("@")) {
    const isValidHandle = /^@[a-zA-Z0-9._]{3,}$/.test(value);
    if (!isValidHandle) {
      return "Handle must start with @ and have at least 3 characters (letters, numbers, . or _).";
    }
    return "";
  }

  if (/^[a-zA-Z]/.test(value)) {
    const isValidEmail =
      /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    if (!isValidEmail) {
      return "Invalid email address format (e.g., name@example.com).";
    }
    return "";
  }

  return "Contact must be a phone number (09/+639), @handle, or email address.";
}
