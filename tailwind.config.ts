import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-card": "var(--bg-card)",
        "bg-card-hover": "var(--bg-card-hover)",
        "bg-elevated": "var(--bg-elevated)",
        "bg-surface": "var(--bg-surface)",
        border: "var(--border-clr)",
        "border-subtle": "var(--border-subtle)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-muted": "var(--primary-muted)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        success: "var(--success)",
        "success-light": "var(--success-light)",
        warning: "var(--warning)",
        "warning-light": "var(--warning-light)",
        danger: "var(--danger)",
        "danger-light": "var(--danger-light)",
        txt: "var(--txt)",
        "txt-secondary": "var(--txt-secondary)",
        "txt-muted": "var(--txt-muted)",
        "txt-inverted": "var(--txt-inverted)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
