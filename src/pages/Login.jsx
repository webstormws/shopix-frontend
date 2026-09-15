import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Login sahifasi
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      setError("Login yoki parol xato. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-shopix-card border border-shopix-border rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-1">Xush kelibsiz 👋</h1>
        <p className="text-shopix-muted text-sm mb-6">Hisobingizga kiring</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-shopix-muted">Login</label>
            <input
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full mt-1 bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2 outline-none focus:border-shopix-green"
            />
          </div>
          <div>
            <label className="text-sm text-shopix-muted">Parol</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-1 bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2 outline-none focus:border-shopix-green"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-shopix-green text-shopix-bg font-semibold disabled:opacity-60"
          >
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </form>

        <p className="text-sm text-shopix-muted mt-5 text-center">
          Hisobingiz yo'qmi?{" "}
          <Link to="/register" className="text-shopix-green font-medium">Ro'yxatdan o'tish</Link> 
        </p>
      </div>
    </div>
  );
}
