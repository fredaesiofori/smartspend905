import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Settings,
  Crown,
  Menu,
  X,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Transactions', url: '/transactions', icon: ArrowLeftRight },
  { title: 'Reports', url: '/reports', icon: BarChart3 },
  { title: 'Settings', url: '/settings', icon: Settings },
  { title: 'Upgrade', url: '/upgrade', icon: Crown },
];

const AppSidebar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card shadow-card border border-border"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-5 flex items-center justify-between border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">SmartSpend</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.title}
                {item.title === 'Upgrade' && (
                  <span className="ml-auto text-[10px] bg-warning text-warning-foreground px-1.5 py-0.5 rounded-full font-semibold">
                    PRO
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom CTA */}
        <div className="p-4 border-t border-border">
          <div className="rounded-lg bg-primary/5 p-3 text-center">
            <p className="text-xs font-semibold text-primary">SmartSpend Premium</p>
            <p className="text-[11px] text-muted-foreground mt-1">Unlock advanced analytics</p>
            <Link
              to="/upgrade"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
            >
              Upgrade Now →
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
