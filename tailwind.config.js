/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "on-background": "var(--on-background)",
        surface: "var(--surface)",
        "on-surface": "var(--on-surface)",
        primary: "var(--primary)",
        "on-primary": "var(--on-primary)",
        secondary: "var(--secondary)",
        "on-secondary": "var(--on-secondary)",
        glass: "var(--glass)",
        "glass-border": "var(--glass-border)",
        "glass-hover": "var(--glass-hover)",
        "liquid-blue": "#0f172a", // Very dark blue
        "liquid-purple": "#4c1d95", // Deep purple
      },
      backgroundImage: {
        'liquid-gradient': 'linear-gradient(135deg, #0f172a 0%, #4c1d95 100%)',
        'liquid-light': 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'text-3d-purple': '2px 2px 0px #4c1d95, 4px 4px 0px rgba(76, 29, 149, 0.5)',
        'text-3d-blue': '2px 2px 0px #1d4ed8, 4px 4px 0px rgba(29, 78, 216, 0.5)',
      },
      fontFamily: {
        "headline-lg": ["Montserrat", "sans-serif"],
        "body-md": ["Montserrat", "sans-serif"],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
