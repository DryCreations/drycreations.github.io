/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts,md,svx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none', // Remove default max-width
            p: {
              maxWidth: '100%', // Ensure paragraphs don't overflow
            },
            pre: {
              maxWidth: '100vw', // Ensure code blocks don't overflow
              overflow: 'auto',
            }
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
