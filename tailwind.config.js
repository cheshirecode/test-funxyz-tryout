/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Noto Sans', 'system-ui', 'sans-serif'],
        'header': ['Lato', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Enhanced primary colors for better light/dark theme support
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Enhanced neutral colors for better theming
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        // Theme-aware background and text colors
        background: {
          light: '#ffffff',
          'light-secondary': '#f8fafc',
          dark: '#0f172a',
          'dark-secondary': '#1e293b',
        },
        surface: {
          light: '#ffffff',
          'light-secondary': '#f1f5f9',
          dark: '#1e293b',
          'dark-secondary': '#334155',
        },
        text: {
          'light-primary': '#0f172a',
          'light-secondary': '#475569',
          'light-muted': '#64748b',
          'dark-primary': '#f8fafc',
          'dark-secondary': '#cbd5e1',
          'dark-muted': '#94a3b8',
        },
      },
      spacing: {
        18: '4.5rem', // 72px for 44px+ touch targets
      },
      fontSize: {
        'token-amount': ['1.5rem', { lineHeight: '2rem' }], // 24px
        'token-amount-lg': ['1.75rem', { lineHeight: '2.25rem' }], // 28px
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
