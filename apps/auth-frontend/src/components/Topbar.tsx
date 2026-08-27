
import { LogOut, Menu, Bell, Search } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  user: any;
}

export default function Topbar({ user }: TopbarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        '/api/auth/signout',
        new URLSearchParams({ redirect: 'false' }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          withCredentials: true,
        }
      );
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <header className="h-20 bg-black/20 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center flex-1">
        <button className="md:hidden text-gray-400 hover:text-white mr-4">
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="hidden md:flex relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-sm transition-all"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button className="text-gray-400 hover:text-white relative transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
        </button>

        <div className="flex items-center space-x-3 border-l border-border pl-6">
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium text-white">{user?.name}</div>
            <div className="text-xs text-gray-400">{user?.email}</div>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-0.5">
            <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="ml-2 text-gray-400 hover:text-red-400 p-2 transition-colors"
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
