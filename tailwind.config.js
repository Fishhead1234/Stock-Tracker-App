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
          950: '#070D1E',
          900: '#0A1128',
          800: '#0F1E46',
          700: '#152C69',
          600: '#1E3A8A', // Deep Navy Blue brand
          500: '#2563EB',
          100: '#DBEAFE',
          50: '#EFF6FF',
        },
        growth: {
          900: '#064E3B',
          800: '#065F46',
          700: '#047857',
          600: '#059669', // Growth Green brand
          500: '#10B981',
          400: '#34D399',
          100: '#D1FAE5',
          50: '#ECFDF5',
        },
        gold: {
          900: '#78350F',
          800: '#92400E',
          700: '#B45309',
          600: '#D97706',
          500: '#F59E0B', // Action Gold brand
          400: '#FBBF24',
          100: '#FEF3C7',
          50: '#FFFBEB',
        },
        loss: {
          900: '#7F1D1D',
          600: '#DC2626',
          500: '#EF4444',
          100: '#FEE2E2',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'glow-gold': '0 0 20px -5px rgba(245, 158, 11, 0.3)',
        'glow-navy': '0 0 25px -5px rgba(30, 58, 138, 0.4)',
      }
    },
  },
  plugins: [],
}
