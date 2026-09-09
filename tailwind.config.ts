import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        // Core Brand Palette
        cinnamon: {
          DEFAULT: "#7B241C", // Deep Cinnamon
          50: "#FDF2F0",
          100: "#F9E1DD",
          200: "#F3C3BC",
          300: "#E89B90",
          400: "#B8473C",
          500: "#7B241C",
          600: "#651D17",
          700: "#501612",
          800: "#3D100D",
          900: "#2B0B09",
        },
        turmeric: {
          DEFAULT: "#D4AC0D", // Golden Turmeric
          50: "#FCF9EC",
          100: "#F8F2D0",
          200: "#F0E2A2",
          300: "#E8D373",
          400: "#DEC244",
          500: "#D4AC0D",
          600: "#B5930B",
          700: "#917509",
          800: "#6D5807",
          900: "#4D3E05",
        },
        cardamom: {
          DEFAULT: "#196F3D", // Cardamom Emerald
          50: "#EEF7F2",
          100: "#DCF0E4",
          200: "#BDE2CC",
          300: "#95CEAE",
          400: "#5DB386",
          500: "#196F3D",
          600: "#145931",
          700: "#104627",
          800: "#0C341D",
          900: "#082414",
        },
        cream: {
          DEFAULT: "#FDFBF7", // Warm Cream
          50: "#FFFFFF",
          100: "#FDFBF7",
          200: "#FAF5EC",
          300: "#F4ECE0",
          400: "#EADDCB",
          500: "#DCCAB1",
        },
        charcoal: {
          DEFAULT: "#1E1E1E", // Dark Charcoal
          50: "#7A7A7A",
          100: "#636363",
          200: "#4D4D4D",
          300: "#383838",
          400: "#2A2A2A",
          500: "#1E1E1E",
          600: "#171717",
          700: "#111111",
          800: "#0A0A0A",
          900: "#000000",
        },
        spice: {
          DEFAULT: "#7B241C",
          dark: "#14110F",
          charcoal: "#1F1A17",
          muted: "#6B7280",
          light: "#FDFBF7",
        },
        // Component-level tokens mapped to brand
        primary: {
          DEFAULT: "#7B241C", // Deep Cinnamon as primary CTA/accent
          50: "#FDF2F0",
          100: "#F9E1DD",
          200: "#F3C3BC",
          300: "#E89B90",
          400: "#B8473C",
          500: "#7B241C",
          600: "#651D17",
          700: "#501612",
          800: "#3D100D",
          900: "#2B0B09",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#196F3D", // Cardamom Emerald as secondary badge/trust color
          50: "#EEF7F2",
          100: "#DCF0E4",
          200: "#BDE2CC",
          300: "#95CEAE",
          400: "#5DB386",
          500: "#196F3D",
          600: "#145931",
          700: "#104627",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#D4AC0D",
          foreground: "#1E1E1E",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        display: ["var(--font-display)", "sans-serif"],
      },
      boxShadow: {
        'spice-sm': '0 2px 8px -2px rgba(123, 36, 28, 0.08)',
        'spice-md': '0 8px 24px -4px rgba(123, 36, 28, 0.14)',
        'spice-lg': '0 16px 36px -6px rgba(123, 36, 28, 0.20)',
        'cardamom-glow': '0 0 20px -3px rgba(25, 111, 61, 0.25)',
        'turmeric-glow': '0 0 20px -3px rgba(212, 172, 13, 0.30)',
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
