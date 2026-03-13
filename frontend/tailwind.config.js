/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#eef9ff',
          100: '#d8f1ff',
          200: '#b9e8ff',
          300: '#89daff',
          400: '#52c2ff',
          500: '#2aa2ff',
          600: '#1482f5',
          700: '#0d69e1',
          800: '#1255b6',
          900: '#14498f',
          950: '#112d57',
        },
        surface: {
          DEFAULT: '#0a0f1e',
          1: '#0f1629',
          2: '#151d36',
          3: '#1c2644',
        },
        accent: {
          cyan:   '#00e5ff',
          violet: '#7c3aed',
          amber:  '#f59e0b',
          rose:   '#f43f5e',
          emerald:'#10b981',
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(42,162,255,0.04) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(42,162,255,0.04) 1px, transparent 1px)`,
        'glow-brand':  'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(42,162,255,0.18) 0%, transparent 70%)',
        'glow-violet': 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '32px 32px',
      },
      boxShadow: {
        'glow-sm': '0 0 16px rgba(42,162,255,0.25)',
        'glow':    '0 0 32px rgba(42,162,255,0.3)',
        'glow-lg': '0 0 64px rgba(42,162,255,0.35)',
        'card':    '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease both',
        'fade-in':    'fadeIn 0.4s ease both',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':  'spin 8s linear infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp:  { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
