import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, addReview } from "../api/endpoints";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

// Mahsulot tafsiloti + izohlar (comments) bo'limi
export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [qty, setQty] = useState(1);

  const load = () => getProduct(id).then((res) => setProduct(res.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, [id]);

  const handleAdd = async () => {
    if (!user) return navigate("/login");
    await addItem(product.id, qty);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    await addReview({ product: product.id, rating, comment });
    setComment("");
    load();
  };

  if (loading) return <Loader />;
  if (!product) return <p className="text-center py-16 text-shopix-muted">Mahsulot topilmadi</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-8">
      <div className="aspect-square bg-shopix-card border border-shopix-border rounded-2xl flex items-center justify-center overflow-hidden">
        {product.image ? <img src={product.image} className="w-full h-full object-cover" /> : <span className="text-6xl">🛒</span>}
      </div>

      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-shopix-muted mt-1">{product.market?.name} · {product.category?.name}</p>

        <div className="flex items-center gap-3 mt-4">
          <span className="text-2xl font-bold text-shopix-green">{Number(product.price).toLocaleString()} so'm</span>
          {product.old_price && <span className="line-through text-shopix-muted">{Number(product.old_price).toLocaleString()}</span>}
        </div>

        {product.average_rating && (
          <p className="text-sm mt-2">⭐ {product.average_rating} ({product.reviews.length} sharh)</p>
        )}

        <p className="text-shopix-muted mt-4 leading-relaxed">{product.description || "Tavsif kiritilmagan."}</p>

        <div className="flex items-center gap-3 mt-6">
          <div className="flex items-center border border-shopix-border rounded-lg">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2">-</button>
            <span className="px-3">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="px-3 py-2">+</button>
          </div>
          <button onClick={handleAdd} className="flex-1 py-3 rounded-lg bg-shopix-green text-shopix-bg font-semibold">
            Savatga qo'shish
          </button>
        </div>

        {/* Izohlar (comments) bo'limi */}
        <div className="mt-10">
          <h2 className="font-bold mb-3">Sharhlar</h2>
          <form onSubmit={submitReview} className="mb-5 space-y-2">
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}
              className="bg-shopix-card border border-shopix-border rounded-lg px-3 py-2 text-sm">
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ⭐</option>)}
            </select>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Fikringizni yozing..."
              className="w-full bg-shopix-card border border-shopix-border rounded-lg px-3 py-2 text-sm outline-none focus:border-shopix-green"
              rows={2}
            />
            <button className="px-4 py-2 rounded-lg bg-shopix-green text-shopix-bg text-sm font-semibold">Yuborish</button>
          </form>

          <div className="space-y-3">
            {product.reviews?.map((r) => (
              <div key={r.id} className="bg-shopix-card border border-shopix-border rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{r.username}</span>
                  <span>{"⭐".repeat(r.rating)}</span>
                </div>
                <p className="text-sm text-shopix-muted mt-1">{r.comment}</p>
              </div>
            ))}
            {product.reviews?.length === 0 && <p className="text-shopix-muted text-sm">Hozircha sharhlar yo'q.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
