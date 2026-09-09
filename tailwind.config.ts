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
        primary: {
          DEFAULT: "#D96B27", // Saffron orange
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#D96B27",
          600: "#C2571A",
          700: "#9A3E0F",
          800: "#7C2D12",
          900: "#431407",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#2D6A4F", // Cardamom green
          50: "#EDF7F1",
          100: "#D8EFE2",
          200: "#B7E1CC",
          300: "#8AC9AE",
          400: "#52B788",
          500: "#2D6A4F",
          600: "#1B4332",
          700: "#133124",
          800: "#0D2218",
          900: "#08150F",
          foreground: "#FFFFFF",
        },
        cinnamon: {
          DEFAULT: "#6F1D1B",
          50: "#F9F0EE",
          100: "#F0DDD8",
          200: "#DCB5AC",
          300: "#C38779",
          400: "#99582A",
          500: "#6F1D1B",
          600: "#581514",
          700: "#430E0D",
          800: "#320A09",
          900: "#220505",
        },
        turmeric: {
          DEFAULT: "#E9A820",
          50: "#FEF9E7",
          100: "#FDF0C3",
          200: "#FCE38C",
          300: "#FBD87F",
          400: "#F3C043",
          500: "#E9A820",
          600: "#C68710",
          700: "#9E6607",
        },
        cream: {
          50: "#FFFFFF",
          100: "#FDFBF7",
          200: "#F7F3E9",
          300: "#EFE8D8",
          400: "#E3D6C0",
          500: "#D4C5B9",
        },
        spice: {
          dark: "#1C110A",
          charcoal: "#2B1810",
          muted: "#756A63",
          sand: "#F4EFE6",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
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
        'spice-sm': '0 2px 8px -2px rgba(111, 29, 27, 0.08)',
        'spice-md': '0 8px 24px -4px rgba(111, 29, 27, 0.12)',
        'spice-lg': '0 16px 36px -6px rgba(111, 29, 27, 0.18)',
        'cardamom-glow': '0 0 20px -3px rgba(45, 106, 79, 0.25)',
        'saffron-glow': '0 0 20px -3px rgba(217, 107, 39, 0.28)',
      },
      backgroundImage: {
        'spice-gradient': 'linear-gradient(135deg, #FFF7ED 0%, #F7F3E9 50%, #EDF7F1 100%)',
        'spice-dark-gradient': 'linear-gradient(135deg, #1C110A 0%, #2B1810 50%, #133124 100%)',
        'saffron-banner': 'linear-gradient(120deg, #D96B27 0%, #E07A5F 50%, #C2571A 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
