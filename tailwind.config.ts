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
          50: '#fef5ee',
          100: '#fde9d6',
          200: '#fad0ad',
          300: '#f6af78',
          400: '#f28441',
          500: '#ee641b',
          600: '#df4a11',
          700: '#b93510',
          800: '#932c14',
          900: '#762613',
        },
        bakery: {
          cream: '#FFF8E7',
          peach: '#FFE5D9',
          pink: '#FFC8DD',
          lavender: '#E4C1F9',
          mint: '#D8F3DC',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
