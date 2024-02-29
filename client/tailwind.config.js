/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#665BFF",
        alert: "#FF5340",
        deep: "#333333",
        sunny: "#FFC550",
      },
      boxShadow: {
        inners: "0px -25px 5px -22px inset rgba(0, 0, 0,0.5)",
      },
    },
  },
  plugins: [],
};
