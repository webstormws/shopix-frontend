# Shopix — Frontend (React + Vite + Tailwind)

Bu — Shopix onlayn market loyihasining frontend qismi. Django REST API bilan ishlaydi.

## O'rnatish

```bash
cd frontend
npm install
npm run dev
```

Sayt: **http://localhost:5173**

Backend (`../backend`) ishga tushirilgan bo'lishi kerak: `http://127.0.0.1:8000`
(agar backend manzili boshqacha bo'lsa, `src/api/axios.js` faylidagi `BASE_URL` ni o'zgartiring)

## Loyihaning tuzilishi

```
src/
  api/            — axios instance va barcha backend so'rovlari
  context/        — Auth (login/register) va Cart (savatcha) global state
  components/     — Navbar, ProductCard, CategoryCard, MarketCard, Loader, ProtectedRoute
  pages/
    Home.jsx           — bosh sahifa (banner, kategoriyalar, do'konlar)
    Login.jsx / Register.jsx
    ProductList.jsx     — qidiruv/filtr bilan mahsulotlar
    ProductDetail.jsx   — mahsulot + izohlar (comments)
    Markets.jsx / MarketDetail.jsx — do'konlar
    Cart.jsx / Checkout.jsx — savatcha va buyurtma rasmiylashtirish (karta/naqd, lokatsiya)
    Orders.jsx / OrderDetail.jsx — buyurtmalar tarixi va kuzatuv (tracking)
    Profile.jsx         — profil, rasm, manzil, lokatsiya
    AdminDashboard.jsx  — admin panel: statistika, grafik, tashriflar, buyurtma holati
  App.jsx         — barcha sahifalar marshruti (routing)
```

## Muhim izoh

- Admin panelga kirish uchun foydalanuvchida `is_staff=True` yoki `is_seller=True` bo'lishi kerak
  (Django admin panelda yoki `python manage.py createsuperuser` orqali beriladi).
- Dizayn Tailwind orqali to'q yashil-qora (Shopix) uslubida qilingan — ranglar `tailwind.config.js` da.
- Responsive: mobil, planshet va desktop uchun moslashtirilgan (grid va flex asosida).
