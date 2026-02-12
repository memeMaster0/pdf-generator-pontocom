import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

/** @type {import('tailwindcss').Config} */
export default {
  content: [path.join(root, 'index.html'), path.join(root, 'src', '**', '*.{js,ts,jsx,tsx}')],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          border: 'var(--color-border)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          muted: 'var(--color-accent-muted)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0, 0, 0, 0.25)',
        glow: '0 0 20px rgba(229, 179, 24, 0.15)',
      },
    },
  },
  plugins: [],
};
