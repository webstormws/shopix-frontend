import React from "react";
import { Link } from "react-router-dom";

// Do'kon (market) kartasi — "Do'konlar" bo'limi uchun
export default function MarketCard({ market }) {
  return (
    <Link
      to={`/markets/${market.id}`}
      className="flex items-center gap-3 bg-shopix-card border border-shopix-border rounded-xl p-3 hover:border-shopix-green transition"
    >
      <div className="w-11 h-11 rounded-lg bg-shopix-bg flex items-center justify-center overflow-hidden shrink-0">
        {market.logo ? <img src={market.logo} className="w-full h-full object-cover" /> : <span>🏬</span>}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{market.name}</p>
        <p className="text-xs text-shopix-muted">⭐ {market.rating} · {market.is_open ? "Ochiq" : "Yopiq"}</p>
      </div>
    </Link>
  );
}
