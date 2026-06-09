export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateApplication(body: any): ValidationResult {
  const { name, mobile, amount, purpose, language } = body;

  // Validate Name
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return {
      isValid: false,
      error: "name: Name must be a string with at least 2 characters",
    };
  }

  // Validate Mobile
  if (!mobile || typeof mobile !== "string" || !/^\d{10}$/.test(mobile)) {
    return {
      isValid: false,
      error: "mobile: Mobile number must be exactly a 10-digit numeric value",
    };
  }

  // Validate Amount
  const parsedAmount = Number(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return {
      isValid: false,
      error: "amount: Amount must be a positive number greater than 0",
    };
  }

  // Validate Purpose
  if (!purpose || typeof purpose !== "string" || purpose.trim().length < 10) {
    return {
      isValid: false,
      error: "purpose: Purpose is required and must be at least 10 characters long",
    };
  }

  // Validate Language
  const allowedLanguages = ["Hindi", "Tamil", "Telugu", "Marathi", "English"];
  if (!language || !allowedLanguages.includes(language)) {
    return {
      isValid: false,
      error: `language: Language must be one of: ${allowedLanguages.join(", ")}`,
    };
  }

  return { isValid: true };
}
