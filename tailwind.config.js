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
        accent: "#00D09C",
        surface: "#EFF7F3",
        card: "#FFFFFF",
        success: "#22c55e",
        forest: {
          deep: "#0B2A20",
          mid: "#0F3B2A",
          light: "#1B5E40",
        },
        text: {
          dark: "#0B2A20",
          muted: "#4A7064",
          light: "#7F918C"
        },
        button: {
          dark: "#062C22",
          accent: "#00D09C",
          light: "#E8EAE8"
        },
        pill: {
          active: "#0B2A20",
          inactive: "#E8F4EF",
        }
      },
      fontFamily: {
        sans: ['System', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
