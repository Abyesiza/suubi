import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-poppins)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        ring: 'hsl(var(--ring))',
        'hero-warm': 'linear-gradient(135deg, #0F2E47 0%, #1F4F61 45%, #3C8C7F 100%)',
        'section-sunrise': 'linear-gradient(135deg, rgba(249,194,123,0.15) 0%, rgba(127,200,169,0.18) 40%, rgba(15,46,71,0.22) 100%)',
        'card-amber': 'linear-gradient(135deg, rgba(255,179,71,0.25) 0%, rgba(255,140,66,0.18) 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2.5xl': '1.5rem',
        '3xl': '1.875rem',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        brand: {
          navy: 'hsl(var(--brand-navy))',
          'navy-light': 'hsl(var(--brand-navy-light))',
          'navy-dark': 'hsl(var(--brand-navy-dark))',
          teal: 'hsl(var(--brand-teal))',
          'teal-light': 'hsl(var(--brand-teal-light))',
          'teal-dark': 'hsl(var(--brand-teal-dark))',
          eucalyptus: 'hsl(var(--brand-eucalyptus))',
          'eucalyptus-light': 'hsl(var(--brand-eucalyptus-light))',
          'eucalyptus-dark': 'hsl(var(--brand-eucalyptus-dark))',
          amber: 'hsl(var(--brand-amber))',
          'amber-light': 'hsl(var(--brand-amber-light))',
          'amber-dark': 'hsl(var(--brand-amber-dark))',
          orange: 'hsl(var(--brand-orange))',
          'orange-light': 'hsl(var(--brand-orange-light))',
          'orange-dark': 'hsl(var(--brand-orange-dark))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-out-bottom': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(100%)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-subtle': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.5s ease-out forwards',
        'fade-in-left': 'fade-in-left 0.5s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'slide-in-bottom': 'slide-in-bottom 0.4s ease-out',
        'slide-out-bottom': 'slide-out-bottom 0.4s ease-in',
        'spin-slow': 'spin-slow 3s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      boxShadow: {
        'brand-xl': '0 35px 65px -25px rgba(15, 46, 71, 0.55)',
        'brand-lg': '0 24px 45px -20px rgba(31, 79, 97, 0.35)',
        'brand-soft': '0 12px 30px rgba(60, 140, 127, 0.25)',
        'inner-glow': 'inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
      },
      dropShadow: {
        'brand-md': '0 12px 25px rgba(255, 179, 71, 0.35)',
        'brand-soft': '0 6px 18px rgba(31, 79, 97, 0.25)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
