// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#3B82F6', // blue-500
            dark: '#2563EB',    // blue-600
            light: '#60A5FA',   // blue-400
          },
          secondary: {
            DEFAULT: '#6B7280', // gray-500
            dark: '#4B5563',    // gray-600
            light: '#9CA3AF',   // gray-400
          },
          success: '#10B981',   // emerald-500
          warning: '#F59E0B',   // amber-500
          danger: '#EF4444',    // red-500
        },
        boxShadow: {
          card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  }