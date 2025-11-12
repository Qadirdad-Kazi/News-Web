import forms from '@tailwindcss/forms';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00E5FF',
          blue: '#0EA5E9',
          purple: '#A855F7',
        },
      },
    },
  },
  plugins: [forms],
}
