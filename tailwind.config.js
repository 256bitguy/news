/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#12203A',
          700: '#1B2E4E',
          500: '#334361',
        },
        paper: {
          DEFAULT: '#FAF7F0',
          dim: '#F1ECE0',
        },
        slate: {
          DEFAULT: '#5B6472',
        },
        gold: {
          DEFAULT: '#C9971D',
          dim: '#E4C878',
        },
        correct: '#2F6B4F',
        incorrect: '#B23A32',
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        wideish: '0.02em',
      },
    },
  },
  plugins: [],
};
