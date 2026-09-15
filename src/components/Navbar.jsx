import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";


export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  const itemsCount = cart?.items?.length || 0;

  return (
    <header className="sticky top-0 z-30 bg-shopix-card/95 backdrop-blur border-b border-shopix-border">
      <div className="max-w-7xl mx-auto flex items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center shrink-0">
          <img src="/logo.png" alt="Shopix logo" className="h-[50px] md:h-[58px] w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm text-shopix-muted">
          <Link to="/products" className="hover:text-shopix-green">Kategoriyalar</Link>
          <Link to="/markets" className="hover:text-shopix-green">Do'konlar</Link>
          <Link to="/orders" className="hover:text-shopix-green">Buyurtmalarim</Link>
        </nav>

        <form onSubmit={onSearch} className="flex-1 max-w-md mx-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mahsulot, do'kon izlash..."
            className="w-full bg-shopix-bg border border-shopix-border rounded-full px-4 py-2 text-sm outline-none focus:border-shopix-green"
          />
        </form>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/cart" className="relative px-3 py-1.5 rounded-lg hover:bg-shopix-bg">
            🛒
            {itemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-shopix-green text-shopix-bg text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {itemsCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="w-8 h-8 rounded-full bg-shopix-green/20 flex items-center justify-center text-sm">
                {user.username?.[0]?.toUpperCase()}
              </Link>
              {(user.is_staff || user.is_seller) && (
                <Link to="/admin" className="text-xs px-2 py-1 rounded bg-shopix-green text-shopix-bg font-semibold">
                  Admin panel
                </Link>
              )}
              <button onClick={logout} className="text-xs text-shopix-muted hover:text-red-400">Chiqish</button>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 rounded-lg bg-shopix-green text-shopix-bg text-sm font-semibold">
              Kirish
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
