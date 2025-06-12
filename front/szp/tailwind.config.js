/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",      // <- to jest potrzebne dla expo-router
    "./components/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",           // <- App.tsx w głównym katalogu
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};