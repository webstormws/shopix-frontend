import React from "react";
import { Link } from "react-router-dom";

// Kategoriya kartasi (bosh sahifadagi "Kategoriyalar" bo'limi uchun)
export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/products?category=${category.id}`}
      className="bg-shopix-card border border-shopix-border rounded-xl p-3 flex flex-col items-center gap-2 hover:border-shopix-green transition"
    >
      <div className="w-14 h-14 rounded-full bg-shopix-bg flex items-center justify-center overflow-hidden">
        {category.icon ? (
          <img src={category.icon} alt={category.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">🥦</span>
        )}
      </div>
      <span className="text-xs text-center">{category.name}</span>
    </Link>
  );
}
