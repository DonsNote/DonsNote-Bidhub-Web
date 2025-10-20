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
        primary: {
          DEFAULT: "#268CF5",
          dark: "#1a6bc9",
        },
        text: {
          primary: "#121417",
          secondary: "#61758A",
        },
        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#F0F2F5",
        },
        border: "#E5E8EB",
      },
      fontFamily: {
        sans: ["Work Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
