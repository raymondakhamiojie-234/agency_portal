import { useEffect } from "react";

export function useAdminAuth(user, userLoading, onAuthSuccess) {
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }

    if (!userLoading && user) {
      checkAdminAccess();
    }
  }, [user, userLoading]);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch("/api/admin/check");
      const data = await response.json();

      if (!response.ok || !data.isAdmin) {
        window.location.href = "/portal/admin/login";
        return;
      }

      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (err) {
      console.error(err);
      window.location.href = "/portal/admin/login";
    }
  };
}
