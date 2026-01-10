import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Search, Brain, Activity, Info, Menu } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { to: '/jobs', label: 'Job Search', icon: Search },
    { to: '/career', label: 'Career Recommender', icon: Brain },
    { to: '/analytics', label: 'Analytics', icon: Activity },
    { to: '/about', label: 'About', icon: Info },
  ];

  return (
    <aside className={clsx(
      'bg-surface shadow-md transition-all duration-300 fixed md:static h-screen md:h-auto z-40',
      collapsed ? 'w-16' : 'w-64'
    )} aria-label="Sidebar navigation">
      <div className="p-4 flex justify-between items-center border-b border-surface/50">
        <h2 className={clsx(collapsed ? 'sr-only' : 'block', 'text-xl font-bold text-primary')}>Menu</h2>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-secondary hover:text-primary transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <nav className="p-4 space-y-2" role="navigation">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={clsx(
              'flex items-center space-x-3 p-3 rounded-lg transition-colors w-full',
              'text-text-secondary hover:bg-primary/10 hover:text-primary',
              { 'bg-primary/10 text-primary': location.pathname === to }
            )}
            aria-current={location.pathname === to ? 'page' : undefined}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className={clsx({ 'sr-only': collapsed })}>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}