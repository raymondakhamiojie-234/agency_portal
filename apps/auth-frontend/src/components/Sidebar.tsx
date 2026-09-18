import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  Landmark, 
  FileText, 
  Bell, 
  Settings,
  Users,
  DollarSign,
  MessageCircle,
  Trophy,
  X
} from 'lucide-react';

interface SidebarProps {
  role?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ role = 'CREATOR', isOpen = false, onClose }: SidebarProps) {
  const creatorLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Support & Manager', path: '/support', icon: MessageCircle },
    { name: 'Profile', path: '/profile', icon: Users },
    { name: 'Finances', path: '/finances', icon: DollarSign },
    { name: 'Loan Request', path: '/loan', icon: CreditCard },
    { name: 'Contracts', path: '/contracts', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Support & Manager', path: '/admin/support', icon: MessageCircle },
    { name: 'Creators', path: '/admin/creators', icon: Users },
    { name: 'Partners', path: '/admin/partners', icon: Users },
    { name: 'FB Profiles', path: '/admin/fb-profiles', icon: Users },
    { name: 'FB Pages', path: '/admin/fb-pages', icon: FileText },
    { name: 'Earnings', path: '/admin/earnings', icon: Wallet },
    { name: 'Monetization', path: '/admin/monetization', icon: TrendingUp },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Loans', path: '/admin/loans', icon: Landmark },
    { name: 'Invoices', path: '/admin/invoices', icon: FileText },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const partnerLinks = [
    { name: 'Dashboard', path: '/partner/dashboard', icon: LayoutDashboard },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'PARTNER' ? partnerLinks : creatorLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0b] md:bg-black/40 md:backdrop-blur-md border-r border-border flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <img src="/favicon.jpg" alt="Logo" className="w-8 h-8 rounded-lg shadow-md shadow-primary/20" />
              <h2 className="text-xl font-bold text-white tracking-tight">Falcus Media</h2>
            </div>
            <p className="text-xs text-primary font-medium mt-1 uppercase tracking-wider">
              {role} PORTAL
            </p>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/dashboard'}
              onClick={() => {
                if (onClose) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(99,102,255,0.15)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="mr-3 h-5 w-5" />
              {link.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
    </>
  );
}
