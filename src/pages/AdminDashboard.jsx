import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getDashboardStats, updateOrderStatus, getCategories, getMarkets, createProduct } from "../api/endpoints";
import Loader from "../components/Loader";

// Admin panel — rasmdagi "Admin panel" statistika/dashboard bo'limiga mos
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    old_price: "",
    category: "",
    market: "",
    image: null,
  });

  const load = () => {
    Promise.all([getDashboardStats(), getCategories(), getMarkets()])
      .then(([dashboardRes, categoriesRes, marketsRes]) => {
        setStats(dashboardRes.data);
        setOrders(dashboardRes.data.recent_orders || []);
        setCategories(categoriesRes.data.results || categoriesRes.data);
        setMarkets(marketsRes.data.results || marketsRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const changeStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    load();
  };

  const handleProductChange = (e) => {
    const { name, value, files } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.category || !productForm.market) {
      alert("Nomi, narxi, kategoriya va do'konni to'ldiring.");
      return;
    }

    setSubmitting(true);
    try {
      await createProduct({
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        old_price: productForm.old_price ? Number(productForm.old_price) : undefined,
        category: Number(productForm.category),
        market: Number(productForm.market),
        image: productForm.image,
      });
      setProductForm({
        name: "",
        description: "",
        price: "",
        old_price: "",
        category: "",
        market: "",
        image: null,
      });
      alert("Mahsulot muvaffaqiyatli qo'shildi.");
      load();
    } catch (error) {
      alert(error?.response?.data?.detail || "Mahsulot qo'shishda xatolik yuz berdi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!stats) return null;

  const cards = [
    { label: "Foydalanuvchilar", value: stats.total_users },
    { label: "Buyurtmalar", value: stats.total_orders },
    { label: "Bugungi tashriflar", value: stats.visits_today },
    { label: "Umumiy tushum", value: `${Number(stats.total_revenue).toLocaleString()} so'm` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold">Admin panel</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-shopix-card border border-shopix-border rounded-xl p-4">
            <p className="text-shopix-muted text-sm">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-shopix-card border border-shopix-border rounded-xl p-4">
        <h2 className="font-semibold mb-4">Mahsulot qo'shish</h2>
        <form onSubmit={handleCreateProduct} className="grid md:grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="text-sm text-shopix-muted">Mahsulot nomi</span>
            <input name="name" value={productForm.name} onChange={handleProductChange} className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2" placeholder="Masalan: Olma" required />
          </label>

          <label className="space-y-1">
            <span className="text-sm text-shopix-muted">Narx</span>
            <input name="price" type="number" value={productForm.price} onChange={handleProductChange} className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2" placeholder="12000" required />
          </label>

          <label className="space-y-1">
            <span className="text-sm text-shopix-muted">Eski narx (ixtiyoriy)</span>
            <input name="old_price" type="number" value={productForm.old_price} onChange={handleProductChange} className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2" placeholder="15000" />
          </label>

          <label className="space-y-1">
            <span className="text-sm text-shopix-muted">Kategoriya</span>
            <select name="category" value={productForm.category} onChange={handleProductChange} className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2" required>
              <option value="">Tanlang</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm text-shopix-muted">Do'kon</span>
            <select name="market" value={productForm.market} onChange={handleProductChange} className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2" required>
              <option value="">Tanlang</option>
              {markets.map((market) => (
                <option key={market.id} value={market.id}>{market.name}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="text-sm text-shopix-muted">Rasm</span>
            <input name="image" type="file" accept="image/*" onChange={handleProductChange} className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2" />
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="text-sm text-shopix-muted">Tavsif</span>
            <textarea name="description" value={productForm.description} onChange={handleProductChange} rows={4} className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2" placeholder="Mahsulot haqida qisqacha ma'lumot..." />
          </label>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={submitting} className="px-5 py-2 rounded-lg bg-shopix-green text-shopix-bg font-semibold disabled:opacity-60">
              {submitting ? "Saqlanmoqda..." : "Mahsulotni qo'shish"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-shopix-card border border-shopix-border rounded-xl p-4">
        <h2 className="font-semibold mb-3">Buyurtmalar statistikasi (14 kun)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={stats.daily_stats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#22302a" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8b9a92" }} tickFormatter={(d) => d.slice(5)} />
            <YAxis tick={{ fontSize: 11, fill: "#8b9a92" }} />
            <Tooltip contentStyle={{ background: "#141d19", border: "1px solid #22302a" }} />
            <Line type="monotone" dataKey="orders" stroke="#22c55e" strokeWidth={2} name="Buyurtmalar" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-shopix-card border border-shopix-border rounded-xl p-4">
        <h2 className="font-semibold mb-3">So'nggi buyurtmalar</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-shopix-muted text-left">
              <tr>
                <th className="py-2">#</th>
                <th>Mijoz</th>
                <th>Summa</th>
                <th>Holat</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-shopix-border">
                  <td className="py-2">{o.id}</td>
                  <td>{o.user__username}</td>
                  <td>{Number(o.total).toLocaleString()} so'm</td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => changeStatus(o.id, e.target.value)}
                      className="bg-shopix-bg border border-shopix-border rounded px-2 py-1 text-xs"
                    >
                      <option value="new">Qabul qilindi</option>
                      <option value="preparing">Tayyorlanmoqda</option>
                      <option value="on_the_way">Yo'lda</option>
                      <option value="delivered">Yetkazib berildi</option>
                      <option value="cancelled">Bekor qilindi</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
