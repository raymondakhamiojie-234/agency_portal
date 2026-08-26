export const validatePhoneNumber = (phone) => {
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, "");

  // Check if it has at least 10 digits (most phone numbers globally)
  if (digitsOnly.length < 10) {
    return "Phone number must be at least 10 digits";
  }

  if (digitsOnly.length > 15) {
    return "Phone number cannot exceed 15 digits";
  }

  // Basic format check - should contain only numbers, spaces, hyphens, parentheses, and plus sign
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    return "Phone number contains invalid characters";
  }

  return "";
};

export const validatePageName = (name) => {
  if (!name || name.trim().length === 0) {
    return "Page name is required";
  }

  if (name.trim().length < 2) {
    return "Page name must be at least 2 characters";
  }

  if (name.length > 255) {
    return "Page name cannot exceed 255 characters";
  }

  return "";
};

export const validatePageUrls = (urls) => {
  if (!urls || urls.trim().length === 0) {
    return "At least one page URL is required";
  }

  const urlList = urls.split("\n").filter((url) => url.trim().length > 0);

  if (urlList.length === 0) {
    return "At least one page URL is required";
  }

  // Validate each URL
  for (let url of urlList) {
    url = url.trim();

    // Check if it's a valid URL format
    try {
      // Add https:// if no protocol is present
      const urlToTest =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : `https://${url}`;

      new URL(urlToTest);

      // Check if it contains common social media domains or is a valid domain
      const validPattern =
        /^(https?:\/\/)?(www\.)?(facebook\.com|instagram\.com|tiktok\.com|youtube\.com|twitter\.com|x\.com|[\w\-]+\.[\w\-]+)/i;
      if (!validPattern.test(url)) {
        return `Invalid URL format: ${url}`;
      }
    } catch (e) {
      return `Invalid URL: ${url}`;
    }
  }

  return "";
};
