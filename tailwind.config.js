const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

/** Builds a scale whose values come from CSS variables holding "L C H" triplets. */
function scale(name) {
  return Object.fromEntries(
    STEPS.map((step) => [step, `oklch(var(--${name}-${step}) / <alpha-value>)`])
  );
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: scale("primary"),
        accent: scale("accent"),
        background: scale("background"),
        foreground: scale("foreground"),
      },
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ['"Space Grotesk"', '"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
