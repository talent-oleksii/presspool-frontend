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
        "calc-vh": "calc(100% - 50px)",
      },
      boxShadow: {
        card: "0px 5px 40px 0px rgba(113, 144, 175, 0.1)",
        cardHover: "0 5px 40px 0 rgba(113,144,175,.503)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
