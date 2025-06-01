/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'newspaper-black': '#121212',
        'newspaper-dark': '#333333',
        'newspaper-mid': '#555555',
        'newspaper-light': '#f5f5f0',
        'newspaper-sepia': '#f4f1e9',
        'newspaper-accent': '#e6e1d5',
      },
      fontFamily: {
        'serif': ['"Playfair Display"', 'Georgia', 'serif'],
        'body': ['"Source Serif 4"', 'Georgia', 'serif'],
        'sans': ['"Source Sans 3"', 'sans-serif'],
      },
      fontSize: {
        'headline': '2.5rem',
        'subhead': '1.75rem',
        'title': '1.35rem',
      },
      spacing: {
        '128': '32rem',
      },
      gridTemplateColumns: {
        'newspaper': 'repeat(12, minmax(0, 1fr))',
      },
      boxShadow: {
        'newspaper': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};