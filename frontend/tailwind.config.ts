import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#ffffff",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f8fafc",
        },
        ink: {
          DEFAULT: "#0f172a",
          soft: "#334155",
          muted: "#64748b",
          faint: "#94a3b8",
        },
        accent: {
          DEFAULT: "#475569",
          soft: "#64748b",
          muted: "#94a3b8",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
      },
      boxShadow: {
        cinematic:
          "0 24px 60px -24px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(226, 232, 240, 0.9)",
        card: "0 1px 3px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(226, 232, 240, 0.9)",
        "card-hover":
          "0 12px 40px -12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(203, 213, 225, 0.9)",
        lifted:
          "0 20px 50px -20px rgba(15, 23, 42, 0.14), 0 8px 16px -8px rgba(15, 23, 42, 0.06)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-100% 0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(1.2)" },
        },
        "pulse-ring": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(15, 23, 42, 0.0)",
          },
          "50%": {
            boxShadow: "0 0 0 6px rgba(15, 23, 42, 0.08)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "border-spin": {
          to: { transform: "rotate(360deg)" },
        },
        "scroll-hint": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.5" },
          "50%": { transform: "translateY(6px)", opacity: "1" },
        },
        "line-grow": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out both",
        shimmer: "shimmer 3.5s ease-in-out infinite",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
        "border-spin": "border-spin 8s linear infinite",
        "scroll-hint": "scroll-hint 2s ease-in-out infinite",
        "line-grow": "line-grow 0.8s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
