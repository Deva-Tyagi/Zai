// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        zai: {
          beige: "#F5F0E6",
          purple: "#6A4C93",
          gold: "#FFB75D",
          dark: "#2D1B3D"
        }
      }
    }
  },
  plugins: []
};
