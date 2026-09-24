/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                ink: '#182230',
                muted: '#64748b',
                line: '#e2e8f0',
                brand: {
                    DEFAULT: '#0f766e',
                    dark: '#0b5d57',
                },
            },
        },
    },
    plugins: [],
};
