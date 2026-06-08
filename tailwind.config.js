/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      colors: {
        bg: {
          base:     "var(--bg-base)",
          surface:  "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
          hover:    "var(--bg-hover)",
        },
        accent: {
          primary:   "var(--accent-primary)",
          secondary: "var(--accent-secondary)",
        },
        border: {
          subtle: "var(--border-subtle)",
          muted:  "var(--border-muted)",
          accent: "var(--border-accent)",
        },
        text: {
          primary:   "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted:     "var(--text-muted)",
          accent:    "var(--text-accent)",
        },
      },
      boxShadow: {
        glow: "0 0 32px rgba(124,111,247,0.25)",
        "glow-lg": "0 0 60px rgba(124,111,247,0.3)",
        "user-bubble": "0 4px 20px rgba(124,111,247,0.3)",
      },
      backgroundImage: {
        "user-bubble": "linear-gradient(135deg, #7c6ff7 0%, #5b52d4 100%)",
        "brand-text":  "var(--brand-text)",
        "hero-text":   "var(--hero-text)",
      },
      animation: {
        "message-in":  "messageIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        "welcome-in":  "welcomeIn 0.6s cubic-bezier(0.34,1.2,0.64,1) both",
        "dot-bounce":  "dotBounce 1.4s ease-in-out infinite",
        "cursor-blink":"cursorBlink 1s ease-in-out infinite",
        "float1":      "float1 20s ease-in-out infinite",
        "float2":      "float2 25s ease-in-out infinite",
        "spin-slow":   "spin 12s linear infinite",
        "spin-mid":    "spin 8s linear infinite reverse",
        "spin-inner":  "spin 5s linear infinite",
        "slide-up":    "slideUp 0.2s ease both",
        "pop-in":      "popIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
        "fade-in":     "fadeIn 0.2s ease both",
      },
      keyframes: {
        messageIn: {
          from: { opacity: "0", transform: "translateY(12px) scale(0.97)" },
          to:   { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        welcomeIn: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        dotBounce: {
          "0%,80%,100%": { transform: "scale(0.6)", opacity: "0.4" },
          "40%":          { transform: "scale(1)",   opacity: "1" },
        },
        cursorBlink: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0" },
        },
        float1: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%":     { transform: "translate(-30px,20px) scale(1.05)" },
          "66%":     { transform: "translate(20px,-30px) scale(0.95)" },
        },
        float2: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%":     { transform: "translate(40px,-20px) scale(1.1)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        popIn: {
          from: { opacity: "0", transform: "scale(0.7)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
