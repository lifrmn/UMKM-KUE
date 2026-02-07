import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8f0',
          100: '#ffecd9',
          200: '#ffd4a8',
          300: '#ffb871',
          400: '#ff974d',
          500: '#ff7a29',
          600: '#e85d0f',
          700: '#c24609',
          800: '#9a380c',
          900: '#7a2f0d',
        },
        accent: {
          brown: '#8B4513',
          tan: '#D2B48C',
          cream: '#FFFDD0',
          rose: '#FFE4E1',
        },
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
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'natural': '6px',
        'soft': '10px',
      },
    },
  },
  plugins: [],
};
export default config;
