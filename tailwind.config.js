/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: "#0B0D17",
          panel: "rgba(14, 22, 40, 0.7)",
        },
        neon: {
          cyan: "#00f3ff",
          yellow: "#ffd600",
          orange: "#ff9100",
          red: "#ff2a55",
          green: "#00ff88",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["Space Mono", "Consolas", "monospace"],
      }
    },
  },
  plugins: [],
}

