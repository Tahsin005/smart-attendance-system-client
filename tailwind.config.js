/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        wise: {
          lime: "#9FE870",
          dark: "#2E3333",
          surface: "#F2F5F7",
          bg: "#FFFFFF",
          text: "#253342"
        }
      }
    },
  },
  plugins: [],
};

