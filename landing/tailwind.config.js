/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        cyan: { glow: '#00f5ff', DEFAULT: '#00f5ff' },
        violet: { glow: '#8b5cf6', DEFAULT: '#8b5cf6' },
        gold: { glow: '#ffd700', DEFAULT: '#ffd700' },
        base: '#030712',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) rotate(1deg)' },
          '66%': { transform: 'translateY(-6px) rotate(-1deg)' },
        },
        pulse_glow: {
          '0%,100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        spin_slow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        ticker: 'ticker 30s linear infinite',
        float: 'float 8s ease-in-out infinite',
        float_slow: 'float 12s ease-in-out infinite',
        pulse_glow: 'pulse_glow 3s ease-in-out infinite',
        spin_slow: 'spin_slow 20s linear infinite',
      },
    },
  },
  plugins: [],
}
