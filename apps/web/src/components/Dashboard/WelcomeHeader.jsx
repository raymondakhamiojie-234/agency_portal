export function WelcomeHeader({ profile, userName }) {
  return (
    <div
      className="mb-8 opacity-0 animate-fade-in-up"
      style={{ animationDelay: "0.1s" }}
    >
      <h1 className="font-plus-jakarta-sans font-bold text-3xl text-[#111111] dark:text-white mb-2">
        Welcome back, {profile?.full_name || userName}!
      </h1>
      <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#726BFF] dark:text-[#6366FF] mb-2">
        {profile?.page_name || "Dashboard"}
      </h3>
      <p className="font-inter text-[#525252] dark:text-white dark:text-opacity-70">
        Here's what's happening with your creator account
      </p>
    </div>
  );
}
