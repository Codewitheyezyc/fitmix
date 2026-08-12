/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0D0E12',
          surface: '#16181E',
          card: '#1F222A',
          elevated: '#282C37',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-strong': 'rgba(255, 255, 255, 0.16)',
        },
        editorial: {
          DEFAULT: '#FAFAFC',
          surface: '#FFFFFF',
          card: '#F1F3F7',
          elevated: '#E5E8EF',
          border: 'rgba(0, 0, 0, 0.08)',
          'border-strong': 'rgba(0, 0, 0, 0.16)',
        },
        lime: {
          accent: '#E2FF66',
          glow: 'rgba(226, 255, 102, 0.35)',
          muted: '#C4E538',
        },
        violet: {
          accent: '#9D4EDD',
          glow: 'rgba(157, 78, 221, 0.35)',
          dark: '#5A189A',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'float-medium': 'floatMedium 5s ease-in-out infinite',
        'float-reverse': 'floatReverse 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(3deg)' },
        },
        floatMedium: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(-3deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      boxShadow: {
        'glass-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 20px 0 rgba(226, 255, 102, 0.15)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        'neon-lime': '0 0 25px rgba(226, 255, 102, 0.4)',
      },
    },
  },
  plugins: [],
}
