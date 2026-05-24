/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', '"Space Grotesk"', "system-ui", "sans-serif"],
        body: ['"Space Grotesk"', "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0a0a0f",
        plum: "#15101f",
        ember: "#ff4d4d",
        gold: "#ffb443",
        violet: "#a855f7",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-8px) rotate(-3deg)" },
          "40%, 80%": { transform: "translateX(8px) rotate(3deg)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.88)" },
          "100%": { transform: "scale(1)" },
        },
        floatUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.75" },
        },
        burst: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "40%": { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
        pop: "pop 0.25s ease-in-out",
        floatUp: "floatUp 0.5s ease-out both",
        glowPulse: "glowPulse 4s ease-in-out infinite",
        burst: "burst 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
      },
    },
  },
  plugins: [],
}
