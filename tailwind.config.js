/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#d9722e",
          dark: "#b85a1f",
          light: "#fbeadb",
        },
        espresso: {
          900: "#2a2320",
          800: "#352c28",
          700: "#463b36",
        },
        cream: "#fbf7f0",
      },
    },
  },
  plugins: [],
};