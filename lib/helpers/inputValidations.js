export function validateContact(rawValue) {
  const value = rawValue.trim();
  if (!value) return { isValid: true, error: "" };

  if (/^[+\d]/.test(value)) {
    const isValidPHNumber = /^(\+639|09)\d{9}$/.test(value);
    if (!isValidPHNumber) {
      return {
        isValid: false,
        error: "Invalid phone number. Use 09XXXXXXXXX or +639XXXXXXXXX.",
      };
    }
    return { isValid: true, error: "" };
  }

  if (value.startsWith("@")) {
    const isValidHandle = /^@[a-zA-Z0-9._]{3,}$/.test(value);
    if (!isValidHandle) {
      return {
        isValid: false,
        error:
          "Handle must start with @ and have at least 3 characters (letters, numbers, . or _).",
      };
    }
    return { isValid: true, error: "" };
  }

  if (/^[a-zA-Z]/.test(value)) {
    const isValidEmail =
      /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    if (!isValidEmail) {
      return {
        isValid: false,
        error: "Invalid email address format (e.g., name@example.com).",
      };
    }
    return { isValid: true, error: "" };
  }

  return {
    isValid: false,
    error:
      "Contact must be a phone number (09/+639), @handle, or email address.",
  };
}

export function validateRequiredName(rawValue, label = "Name") {
  if (!rawValue.trim()) {
    return { isValid: false, error: `${label} is required.` };
  }
  return { isValid: true, error: "" };
}

export function validateCustomerName(rawValue) {
  const name = rawValue.trim();
  if (!name) {
    return { isValid: false, error: "Customer name is required." };
  }
  if (name.length < 3) {
    return {
      isValid: false,
      error: "Name must be at least 3 characters long.",
    };
  }
  return { isValid: true, error: "" };
}

export function validatePoints(rawValue) {
  const val = String(rawValue).trim();
  if (val === "") {
    return { isValid: false, error: "Points are required." };
  }
  const num = Number(val);
  if (!Number.isInteger(num) || num < 0) {
    return {
      isValid: false,
      error: "Points must be a whole non-negative number (0 or greater).",
    };
  }
  return { isValid: true, error: "" };
}

export function validateCustomerCode(rawValue) {
  const code = rawValue.trim();
  if (!code) {
    return { isValid: false, error: "Please enter a customer code." };
  }
  if (!/^\d{6}$/.test(code)) {
    return { isValid: false, error: "Code must be a 6-digit number." };
  }
  return { isValid: true, error: "" };
}
