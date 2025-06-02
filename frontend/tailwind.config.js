/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
        secondary: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          blue: '#3B82F6',
        },
        secondary: {
          lightBlue: '#60A5FA',
        },
        accent: {
          pink: '#EC4899',
        },
        neutral: {
          white: '#FFFFFF',
          lightGray: '#F9FAFB', // Used for page background
          mediumGray: '#E5E7EB', // Used for borders, dividers
          darkGray: '#1F2937', // Used for primary text
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // For basic form styling reset
  ],
}
