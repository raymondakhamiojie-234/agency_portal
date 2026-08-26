import { Edit2 } from "lucide-react";

export function ProfileHeader({ editing, onEdit }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-plus-jakarta-sans font-bold text-3xl text-[#111111] dark:text-white mb-2">
            My Profile
          </h1>
          <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#726BFF] dark:text-[#6366FF] mb-2">
            Personal Information
          </h3>
          <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
            View and manage your account details
          </p>
        </div>
        {!editing && (
          <button
            onClick={onEdit}
            className="inline-flex items-center space-x-2 bg-[#726BFF] dark:bg-[#6366FF] text-white font-plus-jakarta-sans font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#6259E6] dark:hover:bg-[#5856FF] transition-all duration-200"
          >
            <Edit2 size={16} />
            <span>Edit Profile</span>
          </button>
        )}
      </div>
    </div>
  );
}
