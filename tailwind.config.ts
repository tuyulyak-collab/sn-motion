import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/remotion/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F8F4EC",
        soft: "#FFFDF8",
        pink: "#F6A7C1",
        peach: "#F7C8A6",
        yellow: "#F7E68C",
        lavender: "#B9A7FF",
        purple: "#9B7CF6",
        mint: "#BFEAD8",
        teal: "#A8E6E2",
        ink: "#2F2B3A",
        muted: "#8A8396",
      },
      fontFamily: {
        display: ["var(--font-plus-jakarta)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-plus-jakarta)", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        glass: "28px",
      },
      boxShadow: {
        glass: "0 24px 70px rgba(142, 113, 161, 0.18)",
        glow: "0 0 0 4px rgba(185, 167, 255, 0.22)",
      },
      backdropBlur: {
        glass: "24px",
      },
    },
  },
  plugins: [],
};

export default config;
