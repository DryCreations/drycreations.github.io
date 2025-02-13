export default {
  darkMode: "class",
  content: [
    "./src/**/*.{html,js,svelte,ts,md,svx}"
  ],
  theme: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
