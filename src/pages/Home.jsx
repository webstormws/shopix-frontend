import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, getMarkets, getProducts } from "../api/endpoints";
import CategoryCard from "../components/CategoryCard";
import MarketCard from "../components/MarketCard";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCategories(), getMarkets(), getProducts()])
      .then(([c, m, p]) => {
        setCategories(c.data.results || c.data);
        setMarkets(m.data.results || m.data);
        setProducts((p.data.results || p.data).slice(0, 8));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      
      <section className="rounded-2xl bg-gradient-to-r from-shopix-card to-shopix-bg border border-shopix-border p-8 md:p-12 relative overflow-hidden">
        <span className="inline-block bg-shopix-green/20 text-shopix-green text-xs px-3 py-1 rounded-full mb-4">
          30 daqiqada yetkazib berish
        </span>
        <h1 className="text-3xl md:text-4xl font-bold max-w-xl leading-tight">
          Sizga kerakli barcha oziq-ovqat <span className="text-shopix-green">bir joyda!</span>
        </h1>
        <p className="text-shopix-muted mt-3 max-w-lg">
          Shopix — oziq-ovqat mahsulotlarini onlayn xarid qiling va tez yetkazib berish xizmatidan foydalaning.
        </p>
        <Link to="/products" className="inline-block mt-6 px-6 py-3 rounded-lg bg-shopix-green text-shopix-bg font-semibold">
          Xarid qilishni boshlash
        </Link>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Kategoriyalar</h2>
          <Link to="/products" className="text-sm text-shopix-green">Barchasi</Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

   
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Do'konlar</h2>
          <Link to="/markets" className="text-sm text-shopix-green">Barchasi</Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {markets.map((m) => (
            <MarketCard key={m.id} market={m} />
          ))}
        </div>
      </section>

  
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Ommabop mahsulotlar</h2>
          <Link to="/products" className="text-sm text-shopix-green">Barchasi</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
