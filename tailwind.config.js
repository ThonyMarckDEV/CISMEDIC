module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Definir animaciones personalizadas
      animation: {
        'fade-in': 'fadeIn 1.5s ease-out',
        'slide-down': 'slideDown 1.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'slide-up': 'slideUp 1.5s ease-out',
        'fade-in-down': 'fade-in-down 1s ease-out forwards',
        'blink': 'blink 1.5s infinite', // Animación de parpadeo
        'slide-right-back': 'slideRightAndBack 5s ease-in-out infinite', // Animación con dos movimientos y pausa
         // New bounce animation
         'bounce-custom': 'bounceCustom 2s infinite'
      },
      // Definir keyframes para las animaciones
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' }, // Siempre visible
          '10%': { opacity: '0.5' }, // Titileo sutil
        },
        // Nueva animación: Dos movimientos a la derecha y regreso, seguidos de una pausa
        slideRightAndBack: {
          '0%, 10%': { transform: 'translateX(0)' }, // Pausa inicial (0% a 10%)
          '15%': { transform: 'translateX(10px)' }, // Primer movimiento a la derecha (15%)
          '20%': { transform: 'translateX(0)' }, // Primer regreso (20%)
          '25%': { transform: 'translateX(10px)' }, // Segundo movimiento a la derecha (25%)
          '30%': { transform: 'translateX(0)' }, // Segundo regreso (30%)
          '35%, 100%': { transform: 'translateX(0)' }, // Pausa final (35% a 100%)
        },
         // Add new bounce keyframes
         bounceCustom: {
          '0%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-15px)' },
          '60%': { transform: 'translateY(10px)' },
          '80%': { transform: 'translateY(-5px)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
};