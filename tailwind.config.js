module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        'profile': '100px',
      }
    },
    textColor: {
      'teal': '#12c5c3',
      'darkgray':'#757575',
      'white':"#ffffff"
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
