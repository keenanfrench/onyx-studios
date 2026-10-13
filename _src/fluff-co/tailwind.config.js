/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F26B5B',
        'primary-dark': '#D9503F',
        'primary-light': '#FBC3BA',
        accent: '#FFD27A',
        'accent-dark': '#F2B441',
        background: '#FFF7EE',
        surface: '#FFFFFF',
        ink: '#2E2233',
        muted: '#776A73',
        divider: '#EEDFD2',
        deep: '#2E2233',
        sky: '#BFE3E0',
      },
      fontFamily: {
        display: ['Fredoka', 'system-ui', 'sans-serif'],
        body: ['"Nunito Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      borderRadius: { '2.5xl': '1.25rem', '4xl': '2rem', '5xl': '2.5rem', '6xl': '3rem' },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        wag: 'wag 1.2s ease-in-out infinite',
        rise: 'rise 6s linear infinite',
        wheel: 'spin 0.6s linear infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        wag: { '0%,100%': { transform: 'rotate(-12deg)' }, '50%': { transform: 'rotate(14deg)' } },
        rise: {
          '0%': { transform: 'translateY(0) scale(.6)', opacity: '0' },
          '15%': { opacity: '.9' },
          '100%': { transform: 'translateY(-160px) scale(1.1)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
