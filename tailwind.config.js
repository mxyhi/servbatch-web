/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1677ff",
          light: "#4096ff",
          dark: "#0958d9",
        },
        success: {
          DEFAULT: "#52c41a",
          light: "#73d13d",
          dark: "#389e0d",
        },
        warning: {
          DEFAULT: "#faad14",
          light: "#ffc53d",
          dark: "#d48806",
        },
        error: {
          DEFAULT: "#ff4d4f",
          light: "#ff7875",
          dark: "#d9363e",
        },
        info: {
          DEFAULT: "#1677ff",
          light: "#4096ff",
          dark: "#0958d9",
        },
        neutral: {
          100: "#ffffff",
          200: "#f5f5f5",
          300: "#f0f0f0",
          400: "#d9d9d9",
          500: "#bfbfbf",
          600: "#8c8c8c",
          700: "#595959",
          800: "#434343",
          900: "#262626",
          1000: "#000000",
        },
      },
      borderRadius: {
        DEFAULT: "6px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 禁用 Tailwind 的基础样式重置，避免与 Ant Design 冲突
  },
};
