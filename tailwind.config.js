/** @type {import('tailwindcss').Config} */
const daisyui = require("daisyui");
const typography = require("@tailwindcss/typography");
const tailwind_theme = require("tailwindcss/defaultTheme");

export default {
  content: ["*.{html,js,css}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Tourney Variable", ...tailwind_theme.fontFamily.sans],
        mono: ["Roboto", ...tailwind_theme.fontFamily.mono],
      },
    },
  },
  plugins: [daisyui, typography],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#ffffff",
          "primary-content": "#171717",
          secondary: "#FFC358",
          "secondary-content": "#160E03",
          accent: "#22D3EE",
          "accent-content": "#001014",
          neutral: "#040404",
          "neutral-content": "#c4c4c4",
          "base-100": "#000000",
          "base-200": "#1f1f1f",
          "base-300": "#969696",
          "base-content": "#ffffff",
          info: "#00a6ff",
          "info-content": "#000a16",
          success: "#34d399",
          "success-content": "#011008",
          warning: "#facc15",
          "warning-content": "#150f00",
          error: "#E11D48",
          "error-content": "#FFD8D9",
        },
      },
    ],
  },
};
