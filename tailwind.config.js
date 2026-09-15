/** Tailwind konfiguratsiyasi — Shopix dizayniga mos ranglar (to'q yashil/qora fon) */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        shopix: {
          bg: "#0e1512",        // asosiy fon (to'q qora-yashil)
          card: "#141d19",      // karta foni
          border: "#22302a",
          green: "#22c55e",     // asosiy yashil (accent)
          greenDark: "#16a34a",
          text: "#e5e7eb",
          muted: "#8b9a92",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
