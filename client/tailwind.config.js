/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        68: "271px", // Remove the space and the quotation marks if specifying a direct value
      },
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
