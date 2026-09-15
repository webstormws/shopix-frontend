import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Ro'yxatdan o'tish sahifasi
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "", email: "", phone: "", password: "", password2: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.password2) {
      setError("Parollar mos emas");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      const data = err?.response?.data;
      setError(data ? Object.values(data).flat().join(" ") : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-shopix-card border border-shopix-border rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-1">Ro'yxatdan o'tish</h1>
        <p className="text-shopix-muted text-sm mb-6">Bir necha soniyada hisob yarating</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input required placeholder="Login" value={form.username} onChange={update("username")}
            className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2 outline-none focus:border-shopix-green" />
          <input required type="email" placeholder="Email" value={form.email} onChange={update("email")}
            className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2 outline-none focus:border-shopix-green" />
          <input placeholder="Telefon raqami (+998 ...)" value={form.phone} onChange={update("phone")}
            className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2 outline-none focus:border-shopix-green" />
          <input required type="password" placeholder="Parol" value={form.password} onChange={update("password")}
            className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2 outline-none focus:border-shopix-green" />
          <input required type="password" placeholder="Parolni takrorlang" value={form.password2} onChange={update("password2")}
            className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2 outline-none focus:border-shopix-green" />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button disabled={loading} className="w-full py-3 rounded-lg bg-shopix-green text-shopix-bg font-semibold disabled:opacity-60">
            {loading ? "Yaratilmoqda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <p className="text-sm text-shopix-muted mt-5 text-center">
          Hisobingiz bormi?{" "}
          <Link to="/login" className="text-shopix-green font-medium">Kirish</Link>
        </p>
      </div>
    </div>
  );
}
