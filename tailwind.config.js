/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navbar: "var(--col-navbar)",
        sidebar: "var(--col-sidebar)",
        accent: "var(--col-accent)",
        altAccent: "var(--col-altAccent)",
        accentContrast: "var(--col-accentContrast)",
        background: "var(--col-background)",
        container: "var(--col-container)",
        subContainer: "var(--col-subContainer)",
        textPrimary: "var(--col-textPrimary)",
        textSecondary: "var(--col-textSecondary)",
      }
    },
  },
  plugins: [],
};
