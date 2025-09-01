/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // JupitLunar brand colors
        primary: {
          50: '#F8F6FC',
          100: '#EAE6F8',
          200: '#D4C7F0',
          300: '#B8A3E5',
          400: '#9B7FD9',
          500: '#6D5DD3',
          600: '#5A4BC7',
          700: '#4A3DB8',
          800: '#3D32A0',
          900: '#2F2782',
        },
        // Content hub colors
        feeding: {
          50: '#F0FDF4',
          500: '#22C55E',
          600: '#16A34A',
        },
        sleep: {
          50: '#EFF6FF',
          500: '#3B82F6',
          600: '#2563EB',
        },
        momHealth: {
          50: '#FDF2F8',
          500: '#EC4899',
          600: '#DB2777',
        },
        development: {
          50: '#F5F3FF',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        safety: {
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
        },
        recipes: {
          50: '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
