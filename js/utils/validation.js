// Pure validation helpers. Each returns an error message, or "" when valid.

export function validateName(value) {
  const name = value.trim();
  if (!name) return "Full name is required.";
  if (name.length < 3) return "Full name must be at least 3 characters.";
  if (!/^[A-Za-z][A-Za-z .'-]*$/.test(name)) {
    return "Name can only contain letters, spaces, dots, apostrophes and hyphens.";
  }
  return "";
}

export function validateEmail(value) {
  const email = value.trim();
  if (!email) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return "Enter a valid email address, e.g. name@example.com.";
  }
  return "";
}

// Indian mobile numbers: 10 digits starting with 6-9.
// An optional +91 / 91 / 0 prefix is tolerated.
export function normalizePhone(value) {
  return value.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");
}

export function validatePhone(value) {
  if (!value.trim()) return "Phone number is required.";
  if (!/^[6-9]\d{9}$/.test(normalizePhone(value))) {
    return "Enter a valid 10-digit Indian mobile number (starts with 6-9).";
  }
  return "";
}

export function validateLocation(value) {
  return value ? "" : "Please select a pickup location.";
}

export function validatePickupDate(value, todayStr) {
  if (!value) return "Pickup date is required.";
  if (value < todayStr) return "Pickup date cannot be in the past.";
  return "";
}

export function validateReturnDate(returnValue, pickupValue) {
  if (!returnValue) return "Return date is required.";
  if (pickupValue && returnValue <= pickupValue) {
    return "Return date must be after the pickup date.";
  }
  return "";
}

export function validateTerms(checked) {
  return checked ? "" : "You must accept the terms and conditions to continue.";
}
