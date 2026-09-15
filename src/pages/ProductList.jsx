import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories } from "../api/endpoints";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

// Mahsulotlar ro'yxati — qidiruv va kategoriya bo'yicha filtrlash bilan
export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.results || res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ search, category: category || undefined, ordering: searchParams.get("ordering") || undefined })
      .then((res) => setProducts(res.data.results || res.data))
      .finally(() => setLoading(false));
  }, [search, category, searchParams]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    setSearchParams(p);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4">Mahsulotlar {search && `— "${search}"`}</h1>

      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setParam("category", "")}
          className={`px-3 py-1.5 rounded-full text-sm border ${!category ? "bg-shopix-green text-shopix-bg border-shopix-green" : "border-shopix-border text-shopix-muted"}`}
        >
          Barchasi
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setParam("category", c.id)}
            className={`px-3 py-1.5 rounded-full text-sm border ${Number(category) === c.id ? "bg-shopix-green text-shopix-bg border-shopix-green" : "border-shopix-border text-shopix-muted"}`}
          >
            {c.name}
          </button>
        ))}

        <select
          onChange={(e) => setParam("ordering", e.target.value)}
          className="ml-auto bg-shopix-card border border-shopix-border rounded-full px-3 py-1.5 text-sm"
        >
          <option value="">Saralash</option>
          <option value="price">Arzon narx</option>
          <option value="-price">Qimmat narx</option>
          <option value="-created_at">Yangi</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <p className="text-shopix-muted text-center py-10">Hech narsa topilmadi.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
