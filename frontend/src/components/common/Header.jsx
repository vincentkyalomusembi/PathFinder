import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { Menu, User, Moon, Sun } from 'lucide-react';
import clsx from 'clsx';

export default function Header() {
  const { theme, toggleTheme, user } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/jobs', label: 'Jobs' },
    { to: '/career', label: 'Career' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/about', label: 'About' },
  ];

  return (
    <header className="bg-surface shadow-md fixed w-full top-0 z-50" role="banner">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0" role="navigation" aria-label="Main">
        <Link to="/" className="text-2xl font-bold text-primary">PathFinder</Link>
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <Menu className="w-6 h-6 text-text-secondary" />
        </button>
        <ul className={clsx(
          'md:flex md:items-center md:space-x-6 space-y-2 md:space-y-0',
          'absolute md:relative top-full left-0 w-full md:w-auto bg-surface md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none',
          mobileOpen ? 'block' : 'hidden'
        )}>
          {navItems.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={clsx(
                  'block py-2 px-4 text-text-secondary hover:text-primary transition-colors md:inline-block',
                  { 'text-primary font-semibold': location.pathname === to }
                )}
                onClick={() => setMobileOpen(false)}
                aria-current={location.pathname === to ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          {user ? <User className="w-5 h-5" aria-label="User profile" /> : <button className="btn-primary px-4 py-2 rounded">Login</button>}
        </div>
      </nav>
    </header>
  );
}