import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkout, getCards, addCard } from "../api/endpoints";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// Buyurtma rasmiylashtirish (checkout) sahifasi — manzil, lokatsiya, karta orqali to'lov
export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || "");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cards, setCards] = useState([]);
  const [cardId, setCardId] = useState(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({ card_holder: "", card_number_masked: "", expiry: "" });
  const [coords, setCoords] = useState({ lat: user?.location_lat || null, lng: user?.location_lng || null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCards().then((res) => {
      setCards(res.data.results || res.data);
      const def = (res.data.results || res.data).find((c) => c.is_default);
      if (def) setCardId(def.id);
    });
  }, []);

  // Brauzer geolokatsiyasidan foydalanuvchi joylashuvini olish (profildagi lokatsiya kabi)
  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    const { data } = await addCard(newCard);
    setCards([...cards, data]);
    setCardId(data.id);
    setShowAddCard(false);
  };

  const handleCheckout = async () => {
    setError("");
    if (!address) {
      setError("Manzilni kiriting");
      return;
    }
    setLoading(true);
    try {
      const { data } = await checkout({
        address,
        location_lat: coords.lat,
        location_lng: coords.lng,
        payment_method: paymentMethod,
        card_id: paymentMethod === "card" ? cardId : null,
      });
      await refreshCart();
      navigate(`/orders/${data.id}`);
    } catch (err) {
      setError(err?.response?.data?.detail || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold">Buyurtma rasmiylashtirish</h1>

      {/* Manzil */}
      <div className="bg-shopix-card border border-shopix-border rounded-xl p-4">
        <h2 className="font-semibold mb-2">Yetkazib berish manzili</h2>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ko'cha, uy raqami..."
          className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2 outline-none focus:border-shopix-green"
        />
        <button onClick={useMyLocation} className="text-sm text-shopix-green mt-2">📍 Joriy lokatsiyamni ishlatish</button>
        {coords.lat && <p className="text-xs text-shopix-muted mt-1">Lokatsiya: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</p>}
      </div>

      {/* To'lov usuli */}
      <div className="bg-shopix-card border border-shopix-border rounded-xl p-4">
        <h2 className="font-semibold mb-2">To'lov usuli</h2>
        <div className="flex gap-3 mb-3">
          <button onClick={() => setPaymentMethod("card")} className={`flex-1 py-2 rounded-lg border ${paymentMethod === "card" ? "border-shopix-green text-shopix-green" : "border-shopix-border"}`}>💳 Karta</button>
          <button onClick={() => setPaymentMethod("cash")} className={`flex-1 py-2 rounded-lg border ${paymentMethod === "cash" ? "border-shopix-green text-shopix-green" : "border-shopix-border"}`}>💵 Naqd</button>
        </div>

        {paymentMethod === "card" && (
          <div className="space-y-2">
            {cards.map((c) => (
              <label key={c.id} className="flex items-center gap-2 bg-shopix-bg rounded-lg p-2 cursor-pointer">
                <input type="radio" checked={cardId === c.id} onChange={() => setCardId(c.id)} />
                <span className="text-sm">{c.card_holder} — {c.card_number_masked}</span>
              </label>
            ))}
            {!showAddCard ? (
              <button onClick={() => setShowAddCard(true)} className="text-sm text-shopix-green">+ Yangi karta qo'shish</button>
            ) : (
              <form onSubmit={handleAddCard} className="space-y-2 pt-2">
                <input required placeholder="Karta egasi" value={newCard.card_holder}
                  onChange={(e) => setNewCard({ ...newCard, card_holder: e.target.value })}
                  className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2 text-sm" />
                <input required placeholder="8600 **** **** 1234" value={newCard.card_number_masked}
                  onChange={(e) => setNewCard({ ...newCard, card_number_masked: e.target.value })}
                  className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2 text-sm" />
                <input required placeholder="MM/YY" value={newCard.expiry}
                  onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                  className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2 text-sm" />
                <button className="px-3 py-2 rounded-lg bg-shopix-green text-shopix-bg text-sm font-semibold">Saqlash</button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Xulosa */}
      <div className="bg-shopix-card border border-shopix-border rounded-xl p-4 flex items-center justify-between">
        <span className="text-shopix-muted">Jami to'lov:</span>
        <span className="text-xl font-bold text-shopix-green">{Number(cart?.total || 0).toLocaleString()} so'm</span>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-shopix-green text-shopix-bg font-semibold disabled:opacity-60"
      >
        {loading ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash"}
      </button>
    </div>
  );
}
