import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Savatcha sahifasi — miqdorni o'zgartirish, o'chirish, buyurtma rasmiylashtirishga o'tish
export default function Cart() {
  const { cart, changeQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="text-xl font-bold mb-2">Savatchangiz bo'sh</h1>
        <p className="text-shopix-muted mb-6">Xarid qilishni boshlash uchun mahsulotlarni tanlang.</p>
        <Link to="/products" className="px-6 py-3 rounded-lg bg-shopix-green text-shopix-bg font-semibold">
          Mahsulotlarga o'tish
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4">Savatcha</h1>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-shopix-card border border-shopix-border rounded-xl p-3">
            <div className="w-16 h-16 bg-shopix-bg rounded-lg overflow-hidden flex items-center justify-center shrink-0">
              {item.product_image ? <img src={item.product_image} className="w-full h-full object-cover" /> : <span>🛒</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.product_name}</p>
              <p className="text-shopix-green text-sm">{Number(item.price).toLocaleString()} so'm</p>
            </div>
            <div className="flex items-center border border-shopix-border rounded-lg">
              <button onClick={() => changeQuantity(item.id, item.quantity - 1)} className="px-3 py-1.5">-</button>
              <span className="px-3">{item.quantity}</span>
              <button onClick={() => changeQuantity(item.id, item.quantity + 1)} className="px-3 py-1.5">+</button>
            </div>
            <button onClick={() => removeItem(item.id)} className="text-red-400 text-sm">O'chirish</button>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-shopix-card border border-shopix-border rounded-xl p-4 flex items-center justify-between">
        <span className="text-shopix-muted">Jami:</span>
        <span className="text-xl font-bold text-shopix-green">{Number(cart.total).toLocaleString()} so'm</span>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="w-full mt-4 py-3 rounded-lg bg-shopix-green text-shopix-bg font-semibold"
      >
        Buyurtma rasmiylashtirish
      </button>
    </div>
  );
}
