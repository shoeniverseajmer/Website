/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: '#111111',
          50: '#f5f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#57534e',
          600: '#44403c',
          700: '#292524',
          800: '#1c1917',
          900: '#111111'
        },
        bone: {
          DEFAULT: '#f8f5ef',
          50: '#fffdf9',
          100: '#f8f5ef',
          200: '#efe9dc',
          300: '#dfd4bf'
        },
        porcelain: {
          DEFAULT: '#fcfbf8',
          100: '#fcfbf8',
          200: '#f6f3ec'
        },
        mist: {
          DEFAULT: '#ece8df',
          100: '#f2eee7',
          200: '#ece8df',
          300: '#d8d1c3'
        },
        clay: {
          DEFAULT: '#b96f4b',
          50: '#fbf3ef',
          100: '#eed7cc',
          500: '#b96f4b',
          600: '#965438',
          700: '#733e2a'
        },
        moss: {
          DEFAULT: '#5d7560',
          50: '#eef3ef',
          100: '#d8e2d9',
          500: '#5d7560',
          600: '#465b49',
          700: '#334236'
        },
        gold: {
          DEFAULT: '#c7a553',
          50: '#fbf7eb',
          100: '#f0e2bc',
          500: '#c7a553',
          600: '#a6843c',
          700: '#7e6129'
        },
        graphite: {
          DEFAULT: '#202020',
          700: '#2a2a2a',
          800: '#202020',
          900: '#151515'
        },
        danger: {
          DEFAULT: '#dc2626',
          50: '#fef2f2',
          500: '#dc2626',
          600: '#b91c1c'
        }
      },
      boxShadow: {
        xs: '0 1px 2px rgba(17,17,17,0.05)',
        soft: '0 18px 60px rgba(17,17,17,0.10)',
        luxe: '0 30px 100px rgba(17,17,17,0.16)',
        float: '0 20px 55px rgba(17,17,17,0.14)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.65)'
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'Satoshi', 'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Geist', 'Satoshi', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'display-2xl': ['clamp(4.5rem, 10vw, 8.5rem)', { lineHeight: '0.92', letterSpacing: '0' }],
        'display-xl': ['clamp(3.5rem, 7vw, 6rem)', { lineHeight: '0.95', letterSpacing: '0' }],
        display: ['clamp(2.75rem, 5vw, 4.5rem)', { lineHeight: '1', letterSpacing: '0' }],
        headline: ['clamp(2rem, 3vw, 3rem)', { lineHeight: '1.08', letterSpacing: '0' }],
        title: ['1.5rem', { lineHeight: '1.2', letterSpacing: '0' }],
        body: ['1rem', { lineHeight: '1.7', letterSpacing: '0' }],
        caption: ['0.75rem', { lineHeight: '1.35', letterSpacing: '0.08em' }]
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        section: 'clamp(3rem, 8vw, 7.5rem)',
        shell: 'min(1240px, calc(100% - 32px))'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem'
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        shimmer: 'shimmer 1.8s linear infinite',
        'fade-up': 'fade-up 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scale-in 260ms cubic-bezier(0.22, 1, 0.36, 1) both'
      }
    }
  },
  plugins: []
};
