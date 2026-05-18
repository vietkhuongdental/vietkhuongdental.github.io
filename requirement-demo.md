1. Tailwind config:

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
        cinzel: ["Cinzel", "serif"],
        times: ["Times New Roman", "Times", "serif"],
        script: ["Allura", "cursive"],
        vibes: ["Great Vibes", "cursive"],
         amiri: ["Amiri", "cursive"],

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



2. Color config:
/* eslint-disable @typescript-eslint/naming-convention */
export const baseColors = {
  base: {
    white: '#ffffff',
    black: '#030712'
  },
  neutral: {
    50: '#f8f8f7',
    75: '#f2f2f2',
    100: '#e8e6e6',
    200: '#d7d5d4',
    300: '#c4c2bf',
    400: '#b4b0ad',
    500: '#95908c',
    600: '#726b66',
    700: '#4f4740',
    800: '#433a33',
    900: '#2c221a',
    950: '#140900'
  },
  primary: {
    50: '#ffede0',
    100: '#ffdfc7',
    200: '#ffbf8f',
    300: '#ff9f57',
    400: '#ff7f1f',
    500: '#e56200',
    600: '#b84f00',
    700: '#8a3b00',
    800: '#5c2700',
    900: '#2e1400',
    950: '#140900'
  },
  secondary: {
    50: '#e2e0f5',
    100: '#c1beeA',
    200: '#837cd4',
    300: '#483fc0',
    400: '#302a7f',
    500: '#17143d',
    600: '#131032',
    700: '#0e0d26',
    800: '#090817',
    900: '#04040c',
    950: '#030308'
  },
  positive: {
    50: '#e6faee',
    100: '#d0f5e1',
    200: '#a2ecc2',
    300: '#73e2a4',
    400: '#45d985',
    500: '#27be69',
    600: '#1f9854',
    700: '#17723f',
    800: '#104c2a',
    900: '#082615',
    950: '#031109'
  },
  negative: {
    50: '#feecee',
    100: '#fcd9de',
    200: '#fab3bd',
    300: '#f78c9c',
    400: '#f5667a',
    500: '#f2415a',
    600: '#e5102e',
    700: '#ac0c22',
    800: '#730817',
    900: '#39040b',
    950: '#1d0206'
  },
  warning: {
    50: '#fff1e5',
    100: '#ffe6d1',
    200: '#ffcb9e',
    300: '#ffb370',
    400: '#ff8b3d',
    500: '#cc7930',
    600: '#bd5800',
    700: '#ac5305',
    800: '#6b3200',
    900: '#381a00',
    950: '#1a0c00'
  },
  info: {
    50: '#ebefff',
    100: '#d6e0ff',
    200: '#a8bdff',
    300: '#809dff',
    400: '#527aff',
    500: '#295bff',
    600: '#0037eb',
    700: '#002ab3',
    800: '#001b75',
    900: '#000e3d',
    950: '#00071f'
  },
  overlay: {
    light: {
      8: '#ffffff14',
      16: '#ffffff29',
      40: '#ffffff66',
      64: '#ffffffa3',
      80: '#ffffffcc',
      96: '#fffffff5'
    },
    dark: {
      8: '#03030814',
      16: '#03030829',
      32: '#03030852',
      64: '#030308a3',
      80: '#030308cc',
      96: '#030308f5'
    }
  }
};

export const semanticColors = {
  text: {
    default: baseColors.neutral[900],
    inverse: baseColors.base.white,
    subtle: baseColors.neutral[600],
    description: baseColors.neutral[800],
    disable: baseColors.neutral[500],
    placeholder: baseColors.neutral[500],
    error: baseColors.negative[700],
    inactive: baseColors.neutral[600],
    success: baseColors.positive[700],
    warning: baseColors.warning[700],
    info: baseColors.info[700],
    'brand-primary': baseColors.primary[500],
    'wedding-primary': '#3D2C2C',
    'wedding-red': '#6B2D3E',
    'wedding-pink': '#F5E1DA'
  },
  background: {
    default: baseColors.base.white,
    'default-hover': baseColors.neutral[75],
    alt: baseColors.neutral[100],
    disabled: baseColors.neutral[100],
    canvas: baseColors.neutral[75],
    brand: {
      primary: baseColors.primary[500],
      'primary-hover': baseColors.primary[400],
      'primary-subtle': baseColors.primary[50],
      secondary: baseColors.secondary[500],
      'secondary-hover': baseColors.secondary[50]
    },
    primary: baseColors.primary[500],
    'primary-hover': baseColors.primary[600],
    secondary: baseColors.secondary[500],
    'secondary-hover': baseColors.secondary[500],
    error: baseColors.negative[700],
    'error-subtle': baseColors.negative[50],
    inactive: baseColors.neutral[50],
    success: baseColors.positive[700],
    'success-subtle': baseColors.positive[50],
    warning: baseColors.warning[700],
    'warning-subtle': baseColors.warning[50],
    info: baseColors.info[700],
    'info-subtle': baseColors.info[50],
    solid: baseColors.base.black,
    subtle: baseColors.neutral[50],
    overlay: {
      brand: '#e5620014',
      dark: baseColors.overlay.dark[32],
      light: baseColors.overlay.light[40],
      scrim: baseColors.overlay.dark[64]
    },
    wedding: {
      primary: '#F5E1DA',
      secondary: '#6B2D3E'
    }
  },
  border: {
    default: baseColors.neutral[200],
    brand: {
      primary: baseColors.primary[500],
      'primary-hover': baseColors.primary[400],
      secondary: baseColors.secondary[500]
    },
    disabled: baseColors.neutral[500],
    error: baseColors.negative[700],
    errorHover: baseColors.negative[500],
    inactive: baseColors.neutral[200],
    success: baseColors.positive[700],
    'success-hover': baseColors.positive[500],
    warning: baseColors.warning[700],
    info: baseColors.info[700],
    inverse: baseColors.base.white,
    solid: baseColors.neutral[950],
    subtle: baseColors.neutral[100]
  },
  link: {
    default: baseColors.info[500],
    hover: baseColors.info[500],
    pressed: baseColors.info[800],
    visited: baseColors.secondary[300]
  },
  icon: {
    default: baseColors.neutral[950],
    disabled: baseColors.neutral[500],
    success: baseColors.positive[700],
    warning: baseColors.warning[700],
    error: baseColors.negative[700],
    inactive: baseColors.neutral[600],
    info: baseColors.info[700],
    inverse: baseColors.base.white,
    subtle: baseColors.neutral[600],
    brand: {
      primary: baseColors.primary[500],
      secondary: baseColors.secondary[600],
      'secondary-hover': baseColors.secondary[300]
    }
  },
  button: {
    primary: {
      bg: {
        default: baseColors.primary[500],
        hover: baseColors.primary[300]
      },
      fg: {
        default: baseColors.base.white,
        hover: baseColors.base.white
      }
    },
    secondary: {
      bg: {
        default: baseColors.secondary[500],
        hover: baseColors.secondary[300]
      },
      fg: {
        default: baseColors.base.white,
        hover: baseColors.base.white
      }
    },
    danger: {
      bd: {
        default: baseColors.negative[700],
        hover: baseColors.negative[500]
      },
      bg: {
        default: baseColors.negative[700],
        hover: baseColors.negative[500]
      },
      fg: {
        default: baseColors.base.white,
        hover: baseColors.base.white
      }
    },
    outline: {
      bd: {
        default: baseColors.neutral[950],
        hover: baseColors.neutral[800]
      },
      fg: {
        default: baseColors.neutral[950],
        hover: baseColors.neutral[950]
      }
    },
    outlineInverse: {
      bd: {
        default: baseColors.neutral[50]
      },
      fg: {
        default: baseColors.neutral[50]
      }
    },
    risk: {
      bg: {
        high: baseColors.primary[200],
        low: baseColors.primary[50],
        medium: baseColors.primary[100]
      }
    },
    ghost: {
      fg: {
        default: baseColors.secondary[500],
        hover: baseColors.secondary[300]
      }
    }
  }
};
