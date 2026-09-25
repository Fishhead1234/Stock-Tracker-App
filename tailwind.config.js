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
        // System Neutral Palette (antigravity_handoff.md)
        neutral: {
          bg: 'var(--bg-primary)',
          canvas: 'var(--bg-secondary)',
          surface: 'var(--bg-primary)',
          tertiary: 'var(--bg-tertiary)',
          text: 'var(--text-primary)',
          label: 'var(--text-secondary)',
          hint: 'var(--text-tertiary)',
          border: 'var(--border-light)',
          borderSubtle: 'var(--border-subtle)',
          action: 'var(--primary-action)',
          green: 'var(--status-green)',
          red: 'var(--status-red)',
          orange: 'var(--status-orange)',
        },
        navy: {
          950: '#070D1E',
          900: '#0A1128',
          800: '#0F1E46',
          700: '#152C69',
          600: '#1E3A8A',
          500: '#2563EB',
          100: '#DBEAFE',
          50: '#EFF6FF',
        },
        growth: {
          900: '#064E3B',
          800: '#065F46',
          700: '#047857',
          600: '#059669',
          500: '#34C759', // Refined to iOS Success Green #34C759
          400: '#34C759',
          100: '#D1FAE5',
          50: '#ECFDF5',
        },
        gold: {
          900: '#78350F',
          800: '#92400E',
          700: '#B45309',
          600: '#D97706',
          500: '#FF9500', // Refined to iOS Alert Orange #FF9500
          400: '#FFAA33',
          100: '#FEF3C7',
          50: '#FFFBEB',
        },
        loss: {
          900: '#7F1D1D',
          600: '#DC2626',
          500: '#FF3B30', // Refined to iOS Alert Red #FF3B30
          100: '#FEE2E2',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Inter', 'sans-serif'],
        heading: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Inter', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        display: ['32px', { lineHeight: '1.25', letterSpacing: '-0.03em' }],
        title: ['20px', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        body: ['16px', { lineHeight: '1.6', letterSpacing: '-0.02em' }],
        label: ['13px', { lineHeight: '1.5', letterSpacing: '-0.02em' }],
        caption: ['12px', { lineHeight: '1.4' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'touch': '48px',
        'nav': '56px',
        'safe-top': '47px',
        'safe-bottom': '34px',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'float': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'nav': '0 -1px 3px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
