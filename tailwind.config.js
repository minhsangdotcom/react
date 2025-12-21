module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./**/*.html"],
  theme: {
    extend: {
      screens: {
        xs: "320px",
        sm: "640px", // ≥640px: small tablets & large phones
        md: "768px", // ≥768px: tablets
        lg: "1024px", // ≥1024px: laptops
        xl: "1280px", // ≥1280px: desktops
        "2xl": "1536px", // ≥1536px: wide screens
      },
    },
  },
  plugins: [],
};
