/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    screens: {
      "2xs": "300px",
      xs: "350px",
      sm: "400px",
      md: "450px",
      lg: "500px",
    },
    extend: {
      fontSize: { "2xs": "11px" },
      animation: { "inverse-bounce": "hiThere 0.5s infinite" },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      transitionProperty: {
        height: "height",
        "max-height": "max-height",
      },
      colors: {
        mirage: {
          50: "#f4f5f9",
          99: "#eaedf5",
          100: "#e5e9f3",
          199: "#dde1ee",
          200: "#dadeed",
          300: "#c1c8e0",
          400: "#898fa7",
          500: "#6a708d",
          600: "#555974",
          700: "#464a5e",
          800: "#3d4051",
          900: "#333648",
          901: "#2d3143",
          950: "#222639",
        },
        stat: {
          red: {
            DEFAULT: "hsl(0, 100%, 50%)",
            dark: "hsl(0, 100%, 55%)",
            highlight: {
              DEFAULT: "hsl(0, 70%, 45%)",
              dark: "hsl(0, 70%, 40%)",
            },
          },
          blue: {
            DEFAULT: "hsl(200, 79%, 66%)",
            dark: "hsl(200, 79%, 66%)",
            highlight: {
              DEFAULT: "hsl(200, 79%, 66%)",
              dark: "hsl(200, 55%, 55%)",
            },
          },
          green: {
            DEFAULT: "hsl(80, 60%, 35%)",
            dark: "hsl(80, 60%, 45%)",
            highlight: {
              DEFAULT: "hsla(80, 60%, 35%)",
              dark: "hsla(80, 60%, 31%)",
            },
          },
        },
        default: {
          DEFAULT: "#dde1ee",
          dark: "#1c212e",
        },
        paper: {
          DEFAULT: "#f1f3f9",
          dark: "#3d4051",
        },
        text: {
          primary: {
            DEFAULT: "rgba(0, 0, 0, 0.87)",
            dark: "rgb(255, 255, 255)",
          },
          secondary: {
            DEFAULT: "rgba(0, 0, 0, 0.6)",
            dark: "rgb(255, 255, 255, 0.7)",
          },
          disabled: {
            DEFAULT: "rgba(0, 0, 0, 0.38)",
            dark: "rgb(255, 255, 255, 0.5)",
          },
        },
        primary: {
          DEFAULT: "#9966ff",
          50: "#f5f2ff",
          100: "#ede8ff",
          200: "#dcd4ff",
          300: "#c4b1ff",
          400: "#a785ff",
          500: "#9966ff",
          600: "#7f30f7",
          700: "#711ee3",
          800: "#5e18bf",
          900: "#4e169c",
          950: "#300b6a",
          dark: {
            DEFAULT: "#bb99ff",
            50: "#f6f2ff",
            100: "#eee8ff",
            200: "#dfd4ff",
            300: "#c8b2ff",
            400: "#bb99ff",
            500: "#9655fd",
            600: "#8a32f5",
            700: "#7b20e1",
            800: "#671abd",
            900: "#56189a",
            950: "#350c69",
          },
        },
      },

    },
  },
  plugins: [require("tailwindcss-animate")],
  darkMode: "class",
};
