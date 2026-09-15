import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/endpoints";

// Profil sahifasi — rasm, manzil, lokatsiya (rasmdagi profil bo'limi kabi)
export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [saved, setSaved] = useState(false);
  const [coords, setCoords] = useState({ lat: user?.location_lat, lng: user?.location_lng });

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile({
      ...form,
      avatar: avatarFile,
      location_lat: coords.lat,
      location_lng: coords.lng,
    });
    await refreshUser();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const useMyLocation = () => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4">Profil</h1>

      <div className="bg-shopix-card border border-shopix-border rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-shopix-green/20 flex items-center justify-center text-xl font-bold overflow-hidden">
            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.username[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{user.username}</p>
            <p className="text-sm text-shopix-muted">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="text-sm text-shopix-muted">Rasm</label>
            <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])}
              className="w-full text-sm mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Ism" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Familiya" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <input placeholder="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Manzil" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2 text-sm" />

          <div className="flex items-center justify-between bg-shopix-bg border border-shopix-border rounded-lg px-3 py-2 text-sm">
            <span className="text-shopix-muted">
              {coords.lat ? `📍 ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Lokatsiya kiritilmagan"}
            </span>
            <button type="button" onClick={useMyLocation} className="text-shopix-green">Aniqlash</button>
          </div>

          <button className="w-full py-3 rounded-lg bg-shopix-green text-shopix-bg font-semibold">
            {saved ? "Saqlandi ✓" : "Saqlash"}
          </button>
        </form>
      </div>
    </div>
  );
}
