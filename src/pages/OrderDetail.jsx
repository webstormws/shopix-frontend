import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrder } from "../api/endpoints";
import Loader from "../components/Loader";

const STEPS = [
  { key: "new", label: "Qabul qilindi" },
  { key: "preparing", label: "Tayyorlanmoqda" },
  { key: "on_the_way", label: "Yo'lda" },
  { key: "delivered", label: "Yetkazib berildi" },
];

// Buyurtma tafsiloti — rasmdagi "Buyurtma #4587" kuzatuv (tracking) bo'limiga mos
export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id).then((res) => setOrder(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <p className="text-center py-16 text-shopix-muted">Buyurtma topilmadi</p>;

  const currentStepIndex = order.status === "cancelled" ? -1 : STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Buyurtma #{order.id}</h1>
        <span className="text-sm text-shopix-muted">{new Date(order.created_at).toLocaleString()}</span>
      </div>

      {order.status === "cancelled" ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">Buyurtma bekor qilingan</div>
      ) : (
        <div className="bg-shopix-card border border-shopix-border rounded-xl p-5">
          {STEPS.map((step, i) => (
            <div key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${i <= currentStepIndex ? "bg-shopix-green" : "bg-shopix-border"}`} />
                {i < STEPS.length - 1 && <div className={`w-0.5 flex-1 ${i < currentStepIndex ? "bg-shopix-green" : "bg-shopix-border"}`} style={{ minHeight: 28 }} />}
              </div>
              <p className={`pb-6 text-sm ${i <= currentStepIndex ? "text-shopix-text" : "text-shopix-muted"}`}>{step.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-shopix-card border border-shopix-border rounded-xl p-4">
        <h2 className="font-semibold mb-2">Yetkazib berish manzili</h2>
        <p className="text-sm text-shopix-muted">{order.address}</p>
        {order.location_lat && (
          <p className="text-xs text-shopix-muted mt-1">📍 {order.location_lat.toFixed(4)}, {order.location_lng.toFixed(4)}</p>
        )}
      </div>

      <div className="bg-shopix-card border border-shopix-border rounded-xl p-4">
        <h2 className="font-semibold mb-3">Mahsulotlar</h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.product_name} x{item.quantity}</span>
              <span className="text-shopix-muted">{Number(item.subtotal).toLocaleString()} so'm</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold mt-3 pt-3 border-t border-shopix-border">
          <span>Jami</span>
          <span className="text-shopix-green">{Number(order.total).toLocaleString()} so'm</span>
        </div>
      </div>
    </div>
  );
}
