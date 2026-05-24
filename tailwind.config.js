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
        ink: "#0d0b14",
        plum: "#16111f",
        // Varmere, mykere aksenter
        coral: "#eb7364",
        peach: "#f4a574",
        gold: "#f0c76e",
        violet: "#9b7dcf",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-6px) rotate(-2deg)" },
          "40%, 80%": { transform: "translateX(6px) rotate(2deg)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.92)" },
          "100%": { transform: "scale(1)" },
        },
        floatUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "0.5" },
        },
        burst: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "40%": { transform: "scale(1.12)", opacity: "1" },
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
