/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Scandinavian Palette
                primary: {
                    DEFAULT: '#2C3E50',
                    50: '#EBF0F5',
                    100: '#D6E1EB',
                    200: '#AEC3D7',
                    300: '#85A5C3',
                    400: '#5D87AF',
                    500: '#2C3E50',
                    600: '#263848',
                    700: '#1F2E3D',
                    800: '#192532',
                    900: '#131C27',
                },
                background: {
                    DEFAULT: '#F0F4F8',
                    paper: '#FFFFFF',
                    subtle: '#E8EEF4',
                },
                accent: {
                    DEFAULT: '#E07A5F',
                    light: '#E89B85',
                    dark: '#C85A3F',
                },
                gray: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'soft': '12px',
                'card': '16px',
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(44, 62, 80, 0.07), 0 10px 20px -2px rgba(44, 62, 80, 0.04)',
                'card': '0 4px 25px -5px rgba(44, 62, 80, 0.1)',
                'button': '0 4px 14px 0 rgba(44, 62, 80, 0.2)',
            },
        },
    },
    plugins: [],
}
