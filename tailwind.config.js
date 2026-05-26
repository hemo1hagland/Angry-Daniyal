/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', '"Space Grotesk"', "system-ui", "sans-serif"],
        body: ['"Space Grotesk"', "system-ui", "sans-serif"],
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0) rotate(0)" },
          "10%": { transform: "translateX(-6px) rotate(-4deg)" },
          "20%": { transform: "translateX(6px) rotate(4deg)" },
          "30%": { transform: "translateX(-6px) rotate(-3deg)" },
          "40%": { transform: "translateX(6px) rotate(3deg)" },
          "50%": { transform: "translateX(-4px) rotate(-2deg)" },
          "60%": { transform: "translateX(4px) rotate(2deg)" },
          "70%": { transform: "translateX(-2px) rotate(-1deg)" },
          "80%": { transform: "translateX(2px) rotate(1deg)" },
        },
        popOut: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "30%": { transform: "scale(1.12)", opacity: "1" },
          "100%": { transform: "scale(0)", opacity: "0" },
        },
        boomIn: {
          "0%": { transform: "scale(1)" },
          "15%": { transform: "scale(0.85)" },
          "40%": { transform: "scale(1.2)" },
          "60%": { transform: "scale(0.95)" },
          "80%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        floatUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        burst: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "40%": { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        countUp: {
          "0%": { transform: "scale(0.5) translateY(10px)", opacity: "0" },
          "50%": { transform: "scale(1.3) translateY(-5px)", opacity: "1" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        shake: "shake 0.6s ease-in-out",
        popOut: "popOut 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
        boomIn: "boomIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        pulseRing: "pulseRing 0.6s ease-out forwards",
        floatUp: "floatUp 0.5s ease-out both",
        burst: "burst 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        countUp: "countUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        glowPulse: "glowPulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
