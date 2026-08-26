import { Mail } from "lucide-react";

export function ContactInformationSection({
  editing,
  email,
  phoneNumber,
  onPhoneChange,
  phoneError,
  pageName,
  onPageNameChange,
  pageNameError,
  primaryPlatform,
  setPrimaryPlatform,
  pageUrls,
  onPageUrlsChange,
  pageUrlsError,
  country,
  setCountry,
  followerCount,
  setFollowerCount,
  followersSet,
  profile,
}) {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white">
          Contact Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <p className="font-inter text-[#111111] dark:text-white py-3 flex items-center">
            {email || "—"}
            <span className="ml-2 text-xs text-[#525252] dark:text-white dark:text-opacity-70 italic">
              (Cannot be changed)
            </span>
          </p>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          {editing ? (
            <div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => onPhoneChange(e.target.value)}
                required
                className={`w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border ${
                  phoneError
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-200 dark:border-gray-700"
                } rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 ${
                  phoneError
                    ? "focus:ring-red-500"
                    : "focus:ring-[#726BFF] dark:focus:ring-[#6366FF]"
                } transition-all duration-200`}
                placeholder="+1 (555) 123-4567"
              />
              {phoneError && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {phoneError}
                </p>
              )}
            </div>
          ) : (
            <p className="font-inter text-[#111111] dark:text-white py-3">
              {phoneNumber || "—"}
            </p>
          )}
        </div>

        {/* Page Name */}
        <div>
          <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
            Page Name <span className="text-red-500">*</span>
          </label>
          {editing ? (
            <div>
              <input
                type="text"
                value={pageName}
                onChange={(e) => onPageNameChange(e.target.value)}
                required
                className={`w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border ${
                  pageNameError
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-200 dark:border-gray-700"
                } rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 ${
                  pageNameError
                    ? "focus:ring-red-500"
                    : "focus:ring-[#726BFF] dark:focus:ring-[#6366FF]"
                } transition-all duration-200`}
                placeholder="My Awesome Page"
              />
              {pageNameError && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {pageNameError}
                </p>
              )}
            </div>
          ) : (
            <p className="font-inter text-[#111111] dark:text-white py-3">
              {pageName || "—"}
            </p>
          )}
        </div>

        {/* Primary Platform */}
        <div>
          <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
            Primary Platform <span className="text-red-500">*</span>
          </label>
          {editing ? (
            <select
              value={primaryPlatform}
              onChange={(e) => setPrimaryPlatform(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] transition-all duration-200"
            >
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
            </select>
          ) : (
            <p className="font-inter text-[#111111] dark:text-white py-3">
              {primaryPlatform || "—"}
            </p>
          )}
        </div>

        {/* Page URLs */}
        <div className="md:col-span-2">
          <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
            Page URLs <span className="text-red-500">*</span>
          </label>
          {editing ? (
            <div>
              <textarea
                value={pageUrls}
                onChange={(e) => onPageUrlsChange(e.target.value)}
                required
                rows={4}
                className={`w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border ${
                  pageUrlsError
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-200 dark:border-gray-700"
                } rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 ${
                  pageUrlsError
                    ? "focus:ring-red-500"
                    : "focus:ring-[#726BFF] dark:focus:ring-[#6366FF]"
                } transition-all duration-200`}
                placeholder="https://facebook.com/yourpage&#10;https://instagram.com/yourprofile&#10;https://tiktok.com/@yourhandle"
              />
              <p className="mt-1 text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                Enter one URL per line
              </p>
              {pageUrlsError && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {pageUrlsError}
                </p>
              )}
            </div>
          ) : (
            <div className="py-3">
              {profile?.page_urls && profile.page_urls.length > 0 ? (
                <div className="space-y-2">
                  {profile.page_urls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block font-inter text-[#726BFF] dark:text-[#6366FF] hover:underline"
                    >
                      {url}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="font-inter text-[#111111] dark:text-white">—</p>
              )}
            </div>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          {editing ? (
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] transition-all duration-200"
            />
          ) : (
            <p className="font-inter text-[#111111] dark:text-white py-3">
              {country || "—"}
            </p>
          )}
        </div>

        {/* Follower Count */}
        <div>
          <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2 flex items-center space-x-2">
            <span>Followers / Subscribers</span>
            {followersSet && (
              <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">
                Set
              </span>
            )}
          </label>
          {editing && !followersSet ? (
            <div>
              <input
                type="number"
                value={followerCount}
                onChange={(e) => setFollowerCount(e.target.value)}
                min="0"
                className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] transition-all duration-200"
                placeholder="e.g., 50000"
              />
              <p className="mt-1 text-xs text-orange-600 dark:text-orange-400 flex items-center space-x-1">
                <span>⚠️</span>
                <span>This can only be set once</span>
              </p>
            </div>
          ) : (
            <div>
              <p className="font-inter text-[#111111] dark:text-white py-3">
                {followerCount ? parseInt(followerCount).toLocaleString() : "—"}
              </p>
              {followersSet && (
                <p className="text-xs text-[#525252] dark:text-white dark:text-opacity-70 italic">
                  (This value was set permanently and cannot be changed)
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
