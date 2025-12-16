/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "system-ui", "sans-serif"],
      },
      colors: {
        dark: "#0b0f19",
        neon: "#7c7cff",
        neonBlue: "#38bdf8",
        glass: "rgba(255,255,255,0.08)",
      },
      boxShadow: {
        neon: "0 0 20px rgba(124,124,255,0.35)",
        soft: "0 10px 30px rgba(0,0,0,0.4)",
      },
      backdropBlur: {
        glass: "10px",
      },
    },
  },
  plugins: [],
};
