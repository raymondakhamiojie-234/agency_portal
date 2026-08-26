import { useState, useEffect } from "react";

export function useAdminData() {
  const [stats, setStats] = useState(null);
  const [creators, setCreators] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentUploads, setRecentUploads] = useState([]);

  const fetchAdminData = async () => {
    try {
      const [statsRes, creatorsRes, settingsRes, earningsRes] =
        await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/creators"),
          fetch("/api/admin/settings"),
          fetch("/api/admin/earnings/recent"),
        ]);

      if (!statsRes.ok || !creatorsRes.ok || !settingsRes.ok) {
        throw new Error("Failed to fetch admin data");
      }

      const statsData = await statsRes.json();
      const creatorsData = await creatorsRes.json();
      const settingsData = await settingsRes.json();

      setStats(statsData.stats);
      setCreators(creatorsData.creators || []);
      setSettings(settingsData.settings || {});

      if (earningsRes.ok) {
        const earningsData = await earningsRes.json();
        setRecentUploads(earningsData.earnings || []);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load admin data");
      setLoading(false);
    }
  };

  return {
    stats,
    creators,
    settings,
    loading,
    error,
    recentUploads,
    fetchAdminData,
    setCreators,
    setSettings,
    setError,
  };
}
