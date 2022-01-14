const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Rubik", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        sparkle: "rgb(99, 42, 199)",
        "sparkle-darker": "rgb(84, 35, 169)" /* darker by 15% */,
        "warning-red": "rgb(190, 33, 52)",
        "sparkle-gradient-blue": "rgb(0, 246, 213)",
        "sparkle-gradient-purple": "rgb(111, 67, 255)",
        "sparkle-gradient-pink": "rgb(225, 90, 218)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
