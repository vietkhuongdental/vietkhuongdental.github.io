import { baseColors, semanticColors } from './src/shared/theme/colors'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ...baseColors,
        ...semanticColors,
        accent: semanticColors.background.default,
        popover: semanticColors.background.default,
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 2px)",
        "2xl": "calc(var(--radius) + 4px)",
      },
      fontFamily: {
        bricolage: ["var(--font-bricolage)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '20px' }],
        sm: ['14px', { lineHeight: '20px' }], // *
        md: ['16px', { lineHeight: '24px' }], // *
        lg: ['18px', { lineHeight: '24px' }], // *
        xl: ['20px', { lineHeight: '28px' }], // h7*
        '2xl': ['24px', { lineHeight: '32px' }], //  h6*
        '3xl': ['28px', { lineHeight: '32px' }], //  h5*
        '4xl': ['36px', { lineHeight: '44px' }], //  h4*
        '5xl': ['44px', { lineHeight: '52px' }], // h3*
        '6xl': ['56px', { lineHeight: '64px' }], // h2*
        '8xl': ['80px', { lineHeight: '88px' }], // h1*
      },
    },
  },
  safelist: [
    {
      pattern: /col-span-(\d+)/,
      variants: ['lg'],
    },
    // Height
    {
      pattern: /h-(0|2|3|4|6|8|12|16|24|32)/,
      variants: ['lg'],
    },
    // Text sizes for all screen sizes
    {
      pattern: /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/,
      variants: ['lg'],
    },
    // Font weights
    {
      pattern:
        /font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)/,
    },
    // Alignments
    {
      pattern: /text-(left|center|right)/,
    },
  ],
  plugins: [require("tailwindcss-animate")],
};
