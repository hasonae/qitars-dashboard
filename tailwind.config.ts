import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-tajawal)", "Tajawal", "system-ui", "sans-serif"],
      },
      colors: {
        // هوية "Qitars" — تركواز شامي عميق + ذهبي دافئ
        teal: {
          50: "#effaf8",
          100: "#d7f1ec",
          200: "#b0e2da",
          300: "#7ccbc2",
          400: "#4aacaa",
          500: "#2d8f8e",
          600: "#1e7474",
          700: "#145757", // primary deep Levantine teal
          800: "#0e4444",
          900: "#0c3737",
          950: "#052121",
        },
        gold: {
          50: "#fdfaef",
          100: "#faf0d5",
          200: "#f5dfa8",
          300: "#eec873",
          400: "#e5ae46",
          500: "#d99a2b",
          600: "#c9a227", // warm gold accent
          700: "#a87c20",
          800: "#875e1e",
          900: "#6f4c1d",
        },
        sand: {
          50: "#faf9f5",
          100: "#f4f2ea",
          200: "#e8e4d5",
        },
        ink: "#1c2b2b",
      },
      boxShadow: {
        soft: "0 2px 16px -4px rgba(12, 55, 55, 0.08), 0 1px 3px rgba(12, 55, 55, 0.05)",
        lifted: "0 12px 32px -8px rgba(12, 55, 55, 0.18)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.35)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #eec873 0%, #c9a227 100%)",
        "teal-gradient": "linear-gradient(160deg, #145757 0%, #0c3737 100%)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
