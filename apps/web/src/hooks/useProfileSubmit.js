import {
  validatePhoneNumber,
  validatePageName,
  validatePageUrls,
} from "@/utils/profileValidation";

export function useProfileSubmit({
  setSaving,
  setError,
  setSuccess,
  setPhoneError,
  setPageNameError,
  setPageUrlsError,
  setProfile,
  setEditing,
  phoneNumber,
  pageName,
  pageUrls,
  fullName,
  dateOfBirth,
  homeAddress,
  primaryPlatform,
  country,
  bankAccountNumber,
  bankName,
  accountName,
  followerCount,
  followersSet,
  clearValidationErrors,
}) {
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    // Validate all fields before submitting
    const phoneErr = validatePhoneNumber(phoneNumber);
    const pageNameErr = validatePageName(pageName);
    const pageUrlsErr = validatePageUrls(pageUrls);

    setPhoneError(phoneErr);
    setPageNameError(pageNameErr);
    setPageUrlsError(pageUrlsErr);

    if (phoneErr || pageNameErr || pageUrlsErr) {
      setError("Please fix all validation errors before saving");
      setSaving(false);
      return;
    }

    try {
      // Convert page URLs from text area to array
      const pageUrlsArray = pageUrls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const requestBody = {
        fullName,
        dateOfBirth: dateOfBirth || null,
        homeAddress: homeAddress || null,
        pageName,
        pageUrls: pageUrlsArray,
        primaryPlatform,
        phoneNumber,
        country,
        bankAccountNumber: bankAccountNumber || null,
        bankName: bankName || null,
        accountName: accountName || null,
      };

      // Only include followerCount if it's being set for the first time
      if (!followersSet && followerCount) {
        requestBody.followerCount = followerCount;
      }

      const response = await fetch("/api/creator-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      const data = await response.json();
      setProfile(data.profile);
      setSuccess(
        "Profile updated successfully! Check if you've completed all requirements.",
      );
      setEditing(false);
      setSaving(false);

      // Clear validation errors
      clearValidationErrors();

      // Refresh the page after 2 seconds to update onboarding status
      setTimeout(() => {
        setSuccess("");
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update profile");
      setSaving(false);
    }
  };

  return { handleSave };
}
