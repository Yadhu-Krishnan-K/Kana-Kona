/** @type {import('tailwindcss').Config} */
import defTheme from 'tailwindcss/defaultTheme'
import daisyui from 'daisyui'
import {THEMES} from './constants/index.js'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roundFont: ["Exo 2", ...defTheme.fontFamily.sans]
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes:THEMES,
  }
}

