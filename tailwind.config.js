/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // For root-level "app" folder
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // For "app" in "src"
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        shrine: {
          background: "#0D1117", // Dark grayish-blue
          primary: "#FF4D88", // Bright pink
          secondary: "#F47174", // Soft coral pink
          accent: "#1F6FEB", // Vibrant blue
        },
        of: {
          background: "#1A1A1A", // Shared background color
          primary: "#EC4899", // Pinkish primary
          secondary: "#F472B6", // Light coral
          interactive: "#B83280", // Interactive accent
        },
      },
      fontFamily: {
        sans: ["Roboto", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.2)", // Elegant card shadow
        button:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // Button shadow
      },
    },
  },
  plugins: [],
};
