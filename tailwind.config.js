/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#14C8B1",
        monochrome: {
          900: "#0D0D0D",
          800: "#1A1A1A",
          700: "#2B2B2B",
          100: "#F5F5F5",
          50: "#FFFFFF"
        }
      }
    },
  },
  plugins: [],
}
