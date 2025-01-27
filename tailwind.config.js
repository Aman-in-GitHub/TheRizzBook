/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
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
