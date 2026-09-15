import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Bitta mahsulotni karta shaklida ko'rsatadi (rasm, nomi, narxi, "savatga qo'shish" tugmasi)
export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    await addItem(product.id, 1);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-shopix-card border border-shopix-border rounded-xl p-3 flex flex-col hover:border-shopix-green transition"
    >
      <div className="aspect-square bg-shopix-bg rounded-lg mb-2 overflow-hidden flex items-center justify-center">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl">🛒</span>
        )}
      </div>
      <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
      <p className="text-xs text-shopix-muted mb-2">{product.market_name}</p>
      <div className="mt-auto flex items-center justify-between">
        <div>
          <p className="font-bold text-shopix-green text-sm">{Number(product.price).toLocaleString()} so'm</p>
          {product.old_price && (
            <p className="text-xs line-through text-shopix-muted">{Number(product.old_price).toLocaleString()}</p>
          )}
        </div>
        <button
          onClick={handleAdd}
          className="w-8 h-8 rounded-full bg-shopix-green text-shopix-bg flex items-center justify-center font-bold"
        >
          +
        </button>
      </div>
    </Link>
  );
}
