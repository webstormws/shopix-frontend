import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../api/endpoints";
import Loader from "../components/Loader";

const statusColor = {
  new: "bg-blue-500/20 text-blue-400",
  preparing: "bg-yellow-500/20 text-yellow-400",
  on_the_way: "bg-purple-500/20 text-purple-400",
  delivered: "bg-shopix-green/20 text-shopix-green",
  cancelled: "bg-red-500/20 text-red-400",
};

// Foydalanuvchining barcha buyurtmalari ro'yxati
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then((res) => setOrders(res.data.results || res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4">Buyurtmalarim</h1>
      {orders.length === 0 && <p className="text-shopix-muted">Hozircha buyurtmalar yo'q.</p>}
      <div className="space-y-3">
        {orders.map((o) => (
          <Link key={o.id} to={`/orders/${o.id}`} className="flex items-center justify-between bg-shopix-card border border-shopix-border rounded-xl p-4 hover:border-shopix-green">
            <div>
              <p className="font-semibold">Buyurtma #{o.id}</p>
              <p className="text-sm text-shopix-muted">{o.market_name} · {new Date(o.created_at).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-shopix-green">{Number(o.total).toLocaleString()} so'm</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[o.status]}`}>{o.status_display}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>  
  );
}
