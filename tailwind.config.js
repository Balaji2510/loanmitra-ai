/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070C18',
          900: '#101B35', // Primary Deep Navy
          800: '#19284F',
          700: '#233667',
          600: '#324C8C',
          500: '#4667B8',
        },
        electric: {
          500: '#2563EB', // Secondary Electric Blue
          600: '#1D4ED8',
          400: '#3B82F6',
          100: '#DBEAFE',
          50: '#EFF6FF',
        },
        cyanAccent: {
          400: '#22D3EE',
          500: '#06B6D4', // Accent Cyan
          600: '#0891B2',
          100: '#CFFAFE',
          50: '#ECFEFF',
        },
        surface: {
          light: '#F5F7FB',
          card: '#FFFFFF',
          darkBg: '#0A0F1D',
          darkCard: '#111827',
          darkBorder: '#1F2937',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        tamil: ['"Noto Sans Tamil"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(16, 27, 53, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(37, 99, 235, 0.16)',
        'glow': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
