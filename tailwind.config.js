/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      inset: {
        "35vh": "35vh",
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        main: "#7FFBAE",
        cardBg: "rgba(255, 255, 255, 0.35)",
        primary: "#000000",
        secondry1: "#43474A",
        secondry2: "#7F8182",
        secondry3: "#A3A3A3",
        error: "#FF4D42",
      },
      height: {
        "calc-vh": "calc(100% - 62px)",
      },
      boxShadow: {
        card: "0px 5px 40px 0px rgba(113, 144, 175, 0.1)",
        cardHover: "0 5px 40px 0 rgba(113,144,175,.503)",
        green: "0 10px 10px 2px rgba(127, 251, 174, 0.5)",
        red: "0 10px 2px 2px rgba(255, 77, 66, 0.5)",
      },
    },
    screens: {
      xxs: { min: "320px" },
      // => @media (min-width: 320px) { ... }
      xs: { min: "375px" },
      // => @media (min-width: 375px) { ... }
      sm: { min: "414px" },
      // => @media (min-width: 414px) { ... }
      md: { min: "768px" },
      // => @media (min-width: 768px) { ... }
      lg: { min: "1024px" },
      // => @media (min-width: 1024px) { ... }
      xl: { min: "1280px" },
      // => @media (min-width: 1280px) { ... }
      "2xl": { min: "1366px" },
      // => @media (min-width: 1366px) { ... }
      "3xl": { min: "1440px" },
      // => @media (min-width: 1440px) { ... }
      "4xl": { min: "1700px" },
      // => @media (min-width: 1700px) { ... }
      "5xl": { min: "1920px" },
      // => @media (min-width: 1920px) { ... }

      // Only For Mobile's Conditional Classs, max width 767px
      xsm: { max: "767px" },
      // => @media (max-width: 767px) { ... }
      // Only For Tab's Conditional Classs, max width 1023px
      mdm: { max: "1023px" },
      // only for extra small mobile
      exsm: { max: "374px" },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
