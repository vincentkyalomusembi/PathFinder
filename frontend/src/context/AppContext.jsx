import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [user, theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    toast.success(`Switched to ${newTheme} mode`);
  };

  // Memoized value to prevent re-renders on every parent update
  const value = useMemo(() => ({
    user,
    setUser,
    theme,
    toggleTheme,
    loading,
    setLoading,
  }), [user, theme, loading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};