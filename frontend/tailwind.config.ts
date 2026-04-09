import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#6366f1", // Indigo
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#a855f7", // Purple
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#06b6d4", // Cyan
          foreground: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        outfit: ["var(--font-outfit)", "sans-serif"],
      },
      animation: {
        'glow': 'glow 4s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.3)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
