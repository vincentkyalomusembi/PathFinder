import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/jobs', label: 'Jobs' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/career', label: 'Career AI' },
    { path: '/kcse-guide', label: 'KCSE Guide' },
    { path: '/scraper', label: 'Job Scraper' },
  ];

  return (
    <nav className="navbar">
      <div className="container">
        <div className="flex items-center justify-between">
          <Link to="/" className="nav-brand">
            PathFinder
          </Link>
          
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;