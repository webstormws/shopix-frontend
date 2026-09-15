import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMarket, getProducts } from "../api/endpoints";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

// Bitta do'konning barcha mahsulotlari — rasmdagi "Makro (Chilonzor)" bo'limiga mos
export default function MarketDetail() {
  const { id } = useParams();
  const [market, setMarket] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMarket(id), getProducts({ market: id })])
      .then(([m, p]) => {
        setMarket(m.data);
        setProducts(p.data.results || p.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!market) return <p className="text-center py-16 text-shopix-muted">Do'kon topilmadi</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-shopix-card border border-shopix-border rounded-2xl p-5 flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-shopix-bg flex items-center justify-center overflow-hidden">
          {market.logo ? <img src={market.logo} className="w-full h-full object-cover" /> : <span className="text-2xl">🏬</span>}
        </div>
        <div>
          <h1 className="text-xl font-bold">{market.name}</h1>
          <p className="text-shopix-muted text-sm">
            ⭐ {market.rating} ({market.reviews_count} sharh) · {market.address}
          </p>
          <p className="text-xs text-shopix-muted mt-1">
            🕐 {market.open_time?.slice(0, 5)} - {market.close_time?.slice(0, 5)} · {market.is_open ? "Hozir ochiq" : "Yopiq"}
          </p>
        </div>
      </div>

      <h2 className="font-bold mb-3">Barcha mahsulotlar</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
