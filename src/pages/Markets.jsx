import React, { useEffect, useState } from "react";
import { getMarkets } from "../api/endpoints";
import MarketCard from "../components/MarketCard";
import Loader from "../components/Loader";

// Barcha do'konlar ro'yxati sahifasi
export default function Markets() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarkets().then((res) => setMarkets(res.data.results || res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4">Do'konlar</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {markets.map((m) => <MarketCard key={m.id} market={m} />)}
      </div>
    </div>
  );
}
