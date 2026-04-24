/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        // Primary Kinvrs palette
        electric: '#4207C5',
        rich: '#040223',
        storm: '#26374A',
        // Secondary
        aqua: '#61cea0',
        cyan2: '#87eafa',
        coral: '#e8462a',
        gold: '#f1c44c',
        pink2: '#e5544e',
        magenta: '#df79e3',
      },
      fontFamily: {
        sans: ['"Gemunu Libre"', 'system-ui', 'sans-serif'],
        display: ['"Gemunu Libre"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'kinvrs-gradient': 'linear-gradient(135deg, #040223 0%, #1a0768 45%, #4207C5 100%)',
        'kinvrs-gradient-radial': 'radial-gradient(ellipse at top left, #4207C5 0%, #1a0768 45%, #040223 100%)',
        'grid-pattern': 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '48px 48px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
