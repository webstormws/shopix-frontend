import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Faqat login qilgan (yoki admin) foydalanuvchilar kira oladigan sahifalar uchun himoya
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center py-20 text-shopix-muted">Yuklanmoqda...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !(user.is_staff || user.is_seller)) return <Navigate to="/" replace />;

  return children;
}
