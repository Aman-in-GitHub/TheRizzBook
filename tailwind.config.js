/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    animation: {
      'background-gradient':
        'background-gradient var(--background-gradient-speed, 15s) cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite'
    },
    keyframes: {
      'background-gradient': {
        '0%, 100%': {
          transform: 'translate(0, 0)',
          animationDelay: 'var(--background-gradient-delay, 0s)'
        },
        '20%': {
          transform:
            'translate(calc(100% * var(--tx-1, 1)), calc(100% * var(--ty-1, 1)))'
        },
        '40%': {
          transform:
            'translate(calc(100% * var(--tx-2, -1)), calc(100% * var(--ty-2, 1)))'
        },
        '60%': {
          transform:
            'translate(calc(100% * var(--tx-3, 1)), calc(100% * var(--ty-3, -1)))'
        },
        '80%': {
          transform:
            'translate(calc(100% * var(--tx-4, -1)), calc(100% * var(--ty-4, -1)))'
        }
      }
    },
    extend: {
      colors: {
        primary: 'var(--primary)',
        overlay: 'var(--overlay)',
        background: 'var(--background)',
        bw: 'var(--bw)',
        blank: 'var(--blank)',
        text: 'var(--text)',
        mutedText: 'var(--muted-text)',
        border: 'var(--border)',
        ring: 'var(--ring)',
        ringOffset: 'var(--ring-offset)',
        secondaryBlack: '#212121'
      },
      borderRadius: {
        base: '2px',
        xl: '1rem',
        full: '9999px'
      },
      boxShadow: {
        shadow: 'var(--shadow)'
      },
      translate: {
        boxShadowX: 'var(--box-shadow-x)',
        boxShadowY: 'var(--box-shadow-y)',
        reverseBoxShadowX: 'calc(var(--box-shadow-x) * -1)',
        reverseBoxShadowY: 'calc(var(--box-shadow-y) * -1)'
      },
      fontWeight: {
        base: '400',
        bold: '800'
      },
      fontFamily: {
        body: ['IBMPlexSans', 'sans-serif'],
        heading: ['Bebas Neue', 'sans-serif']
      }
    }
  },
  plugins: [require('tailwindcss-animate'), require('tailwindcss-motion')]
};
