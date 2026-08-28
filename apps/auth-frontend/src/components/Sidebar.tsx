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
  MessageCircle
} from 'lucide-react';

interface SidebarProps {
  role?: string;
}

export default function Sidebar({ role = 'CREATOR' }: SidebarProps) {
  const creatorLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Support & Manager', path: '/support', icon: MessageCircle },
    { name: 'Profile', path: '/profile', icon: Users },
    { name: 'Finances', path: '/finances', icon: DollarSign },
    { name: 'Loan Request', path: '/loan', icon: CreditCard },
    { name: 'Contracts', path: '/contracts', icon: FileText },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Creators', path: '/admin/creators', icon: Users },
    { name: 'Earnings', path: '/admin/earnings', icon: Wallet },
    { name: 'Monetization', path: '/admin/monetization', icon: TrendingUp },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Loans', path: '/admin/loans', icon: Landmark },
    { name: 'Invoices', path: '/admin/invoices', icon: FileText },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const links = role === 'ADMIN' ? adminLinks : creatorLinks;

  return (
    <aside className="w-64 h-screen bg-black/40 backdrop-blur-md border-r border-border hidden md:flex flex-col sticky top-0">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Falcus Media</h2>
        <p className="text-xs text-primary font-medium mt-1 uppercase tracking-wider">
          {role} PORTAL
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/dashboard'}
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
  );
}
