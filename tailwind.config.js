/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["System", "-apple-system", "BlinkMacSystemFont", "San Francisco", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        binance: {
          yellow: "#F0B90B",
          dark: "#1E2329",
          gray: "#707A8A",
          surface: "#FAFAFA",
          lightGray: "#EAECEF",
          bg: "#FFFFFF",
          text: "#1E2329"
        }
      }
    },
  },
  plugins: [],
};

