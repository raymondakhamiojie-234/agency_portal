import { useState } from "react";

export function useProfileForm(profile, user) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  // Validation errors
  const [phoneError, setPhoneError] = useState("");
  const [pageNameError, setPageNameError] = useState("");
  const [pageUrlsError, setPageUrlsError] = useState("");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [pageName, setPageName] = useState("");
  const [pageUrls, setPageUrls] = useState("");
  const [email, setEmail] = useState("");
  const [primaryPlatform, setPrimaryPlatform] = useState("Facebook");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [followerCount, setFollowerCount] = useState("");
  const [followersSet, setFollowersSet] = useState(false);

  const populateForm = (profileData) => {
    setFullName(profileData.full_name || "");
    setDateOfBirth(profileData.date_of_birth || "");
    setHomeAddress(profileData.home_address || "");
    setPageName(profileData.page_name || "");
    setPageUrls(profileData.page_urls ? profileData.page_urls.join("\n") : "");
    setEmail(user?.email || "");
    setPrimaryPlatform(profileData.primary_platform || "Facebook");
    setPhoneNumber(profileData.phone_number || "");
    setCountry(profileData.country || "");
    setBankAccountNumber(profileData.bank_account_number || "");
    setBankName(profileData.bank_name || "");
    setAccountName(profileData.account_name || "");
    setFollowerCount(profileData.follower_count || "");
    setFollowersSet(profileData.followers_set || false);
  };

  const clearValidationErrors = () => {
    setPhoneError("");
    setPageNameError("");
    setPageUrlsError("");
  };

  return {
    editing,
    setEditing,
    saving,
    setSaving,
    success,
    setSuccess,
    phoneError,
    setPhoneError,
    pageNameError,
    setPageNameError,
    pageUrlsError,
    setPageUrlsError,
    fullName,
    setFullName,
    dateOfBirth,
    setDateOfBirth,
    homeAddress,
    setHomeAddress,
    pageName,
    setPageName,
    pageUrls,
    setPageUrls,
    email,
    setEmail,
    primaryPlatform,
    setPrimaryPlatform,
    phoneNumber,
    setPhoneNumber,
    country,
    setCountry,
    bankAccountNumber,
    setBankAccountNumber,
    bankName,
    setBankName,
    accountName,
    setAccountName,
    followerCount,
    setFollowerCount,
    followersSet,
    setFollowersSet,
    populateForm,
    clearValidationErrors,
  };
}
