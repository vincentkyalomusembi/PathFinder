/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all files
    "./src/styles/**/*.{css}", // Ensures CSS files
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
  safelist: [ // Force all critical classes
    'grid',
    'grid-cols-1',
    'md:grid-cols-2',
    'md:grid-cols-4',
    'lg:grid-cols-2',
    'gap-4',
    'gap-6',
    'gap-8',
    'space-y-8',
    'text-3xl',
    'text-xl',
    'text-2xl',
    'font-bold',
    'text-text-primary',
    'bg-surface',
    'border-surface/50',
    'hover:shadow-md',
    'p-6',
    'rounded-xl',
    'transition-all',
    'flex',
    'flex-col',
    'sm:flex-row',
    'justify-between',
    'items-start',
    'sm:items-center',
    'space-x-4',
  ],
};