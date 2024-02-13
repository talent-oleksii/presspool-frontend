/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        main: "#7FFBAE",
        cardBg: "rgba(255, 255, 255, 0.35)",
      },
      height: {
        "calc-vh": "calc(100% - 80px)",
      },
      boxShadow: {
        card: "0px 5px 40px 0px rgba(113, 144, 175, 0.1)",
        cardHover: "0 5px 40px 0 rgba(113,144,175,.503)",
      },
    },
    fontSize: {
      xs: "0.6rem",
      sm: "0.8rem",
      base: "1rem",
      lg: "1.25rem",
      xl: "1.125rem",
      "2xl": "1.5rem",
      "3xl": "1.688rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
