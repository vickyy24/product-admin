/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                ink: '#182230',
                muted: '#64748b',
                line: '#e2e8f0',
                brand: '#4f46e5',
            },
        },
    },
    plugins: [],
};
