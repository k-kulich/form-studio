import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background:   '#0F0F11',
        surface:      '#1A1A1E',
        'surface-2':  '#232328',
        gold:         '#C6A96B',
        champagne:    '#D9C7A7',
        foreground:   '#F5F2ED',
        muted:        '#9B9790',
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-unbounded)', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 20px 50px -20px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};

export default config;