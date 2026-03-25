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
        primary: "#118a7e",
        surface: "#EFF7F3",
        card: "#FFFFFF",
        text: {
          dark: "#0B2A20",
          light: "#7F918C"
        },
        button: {
          dark: "#062C22",
          light: "#E8EAE8"
        }
      },
      fontFamily: {
        sans: ['System', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
