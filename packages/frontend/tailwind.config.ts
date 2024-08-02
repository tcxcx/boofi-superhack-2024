import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");
const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette");
const svgToDataUri = require("mini-svg-data-uri");

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        clash: ["Clash Display", "sans-serif"],
        violet: ["Violet Sans", "sans-serif"],
        basement: ["Basement Grotesque", "sans-serif"],
        belgro: ["Belgro", "sans-serif"],
        aeonik: ["Aeonik", "sans-serif"],
      },
      textShadow: {
        sm: "rgba(255, 255, 255, 0.35) 1px 1px 12px",
      },
      colors: {
        "purple-deep": "#7c4dff",
        "purple-deep-accent": "#b388ff",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      opacity: {
        2.5: "0.025",
        15: "0.15",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      zIndex: {
        "100": "100",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        ripple: {
          "0%, 100%": {
            transform: "translate(-50%, -50%) scale(1)",
          },
          "50%": {
            transform: "translate(-50%, -50%) scale(0.9)",
          },
        },
        grid: {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        shimmer: {
          "0%, 90%, 100%": {
            "background-position": "calc(-100% - var(--shimmer-width)) 0",
          },
          "30%, 60%": {
            "background-position": "calc(100% + var(--shimmer-width)) 0",
          },
        },
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        ripple: "ripple 3400ms ease infinite",
        meteor: "meteor 5s linear infinite",
        grid: "grid 15s linear infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "accordion-up": "accordion-up 0.2s ease-out",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        shimmer: "shimmer 8s infinite",
        marquee: "marquee 30s linear infinite",
        aurora: "aurora 60s linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    addVariablesForColors,
    plugin(function ({
      matchUtilities,
      theme,
    }: {
      matchUtilities: any;
      theme: any;
    }) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" stroke="${value}" fill="none"><path d="M64 0H0V64"/></svg>`
            )}")`,
          }),
          "text-shadow": (value: any) => ({
            textShadow: value,
          }),
        },
        {
          values: {
            ...flattenColorPalette(theme("backgroundColor")),
            ...theme("textShadow"),
          },
          type: ["color"],
        }
      );

      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundSize: value,
          }),
        },
        {
          values: theme("spacing"),
          type: ["number", "length", "any"],
        }
      );
    }),
  ],
};

export default config;
