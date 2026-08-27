import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get('/api/auth/session', {
          withCredentials: true,
        });
        
        if (response.data && typeof response.data === 'object' && response.data.user) {
          // Since we need the full user object including role, we might need a separate API 
          // call if session doesn't contain it. For now we assume standard user object.
          setSession(response.data);
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // Fallback role to CREATOR if not set in session
  const role = session?.user?.role || 'CREATOR';

  return (
    <div className="min-h-screen bg-background flex text-white overflow-hidden relative">
      {/* Global Background Glow */}
      <div className="fixed top-0 left-1/4 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      
      <Sidebar role={role} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <Topbar user={session?.user} />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet context={{ user: session?.user, role }} />
        </main>
      </div>
    </div>
  );
}
