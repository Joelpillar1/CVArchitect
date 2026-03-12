/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#333C4D',      // Text / Deep elements
                    green: '#70E098',     // Buttons / Accents
                    greenHover: '#5CD685',
                    blue: '#0870b8',
                    blueHover: '#065a94',
                    bg: '#F8F8F8',        // Main background
                    surface: '#FFFFFF',   // Cards / Paper
                    secondary: '#F3F3F3', // Secondary backgrounds
                    border: '#EAEAEA',
                }
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
                serif: ['Merriweather', 'Georgia', 'serif'],
                mono: ['Fira Code', 'monospace'],
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(51, 60, 77, 0.05)',
                'sharp': '0 1px 2px 0 rgba(51, 60, 77, 0.05)',
                'float': '0 10px 40px -10px rgba(51, 60, 77, 0.15)',
            },
            animation: {
                fadeIn: 'fadeIn 0.5s ease-in-out forwards',
                'marquee': 'marquee 40s linear infinite',
                'marquee-reverse': 'marquee-reverse 40s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                'marquee-reverse': {
                    '0%': { transform: 'translateX(-50%)' },
                    '100%': { transform: 'translateX(0%)' },
                },
            }
        },
    },
    plugins: [],
}
