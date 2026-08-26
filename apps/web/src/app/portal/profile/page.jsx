"use client";

import { useEffect } from "react";
import useUser from "@/utils/useUser";
import PortalNav from "@/components/PortalNav";
import { useProfile } from "@/hooks/useProfile";
import { useProfileForm } from "@/hooks/useProfileForm";
import { useProfileSubmit } from "@/hooks/useProfileSubmit";
import {
  validatePhoneNumber,
  validatePageName,
  validatePageUrls,
} from "@/utils/profileValidation";
import { LoadingState } from "@/components/ProfilePage/LoadingState";
import { ProfileHeader } from "@/components/ProfilePage/ProfileHeader";
import { AlertMessage } from "@/components/ProfilePage/AlertMessage";
import { PersonalDetailsSection } from "@/components/ProfilePage/PersonalDetailsSection";
import { ContactInformationSection } from "@/components/ProfilePage/ContactInformationSection";
import { BankingInformationSection } from "@/components/ProfilePage/BankingInformationSection";
import { ActionButtons } from "@/components/ProfilePage/ActionButtons";

export default function ProfilePage() {
  const { data: user, loading: userLoading } = useUser();
  const { profile, loading, error, setProfile, setError } = useProfile(
    user,
    userLoading,
  );

  const formState = useProfileForm(profile, user);

  const {
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
    populateForm,
    clearValidationErrors,
  } = formState;

  useEffect(() => {
    if (profile) {
      populateForm(profile);
    }
  }, [profile]);

  const { handleSave } = useProfileSubmit({
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
  });

  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
    if (editing) {
      const error = validatePhoneNumber(value);
      setPhoneError(error);
    }
  };

  const handlePageNameChange = (value) => {
    setPageName(value);
    if (editing) {
      const error = validatePageName(value);
      setPageNameError(error);
    }
  };

  const handlePageUrlsChange = (value) => {
    setPageUrls(value);
    if (editing) {
      const error = validatePageUrls(value);
      setPageUrlsError(error);
    }
  };

  const handleCancel = () => {
    populateForm(profile);
    setEditing(false);
    setError("");
    clearValidationErrors();
  };

  if (userLoading || loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <PortalNav activePage="/portal/profile" />

      <main className="max-w-[1240px] mx-auto px-6 py-8">
        <ProfileHeader editing={editing} onEdit={() => setEditing(true)} />

        {success && <AlertMessage type="success" message={success} />}
        {error && <AlertMessage type="error" message={error} />}

        <form onSubmit={handleSave}>
          <PersonalDetailsSection
            editing={editing}
            fullName={fullName}
            setFullName={setFullName}
            dateOfBirth={dateOfBirth}
            setDateOfBirth={setDateOfBirth}
            homeAddress={homeAddress}
            setHomeAddress={setHomeAddress}
          />

          <ContactInformationSection
            editing={editing}
            email={email}
            phoneNumber={phoneNumber}
            onPhoneChange={handlePhoneChange}
            phoneError={phoneError}
            pageName={pageName}
            onPageNameChange={handlePageNameChange}
            pageNameError={pageNameError}
            primaryPlatform={primaryPlatform}
            setPrimaryPlatform={setPrimaryPlatform}
            pageUrls={pageUrls}
            onPageUrlsChange={handlePageUrlsChange}
            pageUrlsError={pageUrlsError}
            country={country}
            setCountry={setCountry}
            followerCount={followerCount}
            setFollowerCount={setFollowerCount}
            followersSet={followersSet}
            profile={profile}
          />

          <BankingInformationSection
            editing={editing}
            bankName={bankName}
            setBankName={setBankName}
            accountName={accountName}
            setAccountName={setAccountName}
            bankAccountNumber={bankAccountNumber}
            setBankAccountNumber={setBankAccountNumber}
          />

          {editing && <ActionButtons saving={saving} onCancel={handleCancel} />}
        </form>
      </main>
    </div>
  );
}
