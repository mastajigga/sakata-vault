/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        foret: "#0A1F15",
        eau: "#0C2920",
        brume: "#D4DDD7",
        ivoire: "#F0EDE5",
        or: "#C4A035",
      },
      fontFamily: {
        display: ["var(--font-satoshi)", "var(--font-outfit)", "sans-serif"],
        body: ["var(--font-outfit)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
}
