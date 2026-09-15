import React, { createContext, useContext, useEffect, useState } from "react";
import { getProfile, loginUser, registerUser } from "../api/endpoints";

// Foydalanuvchi holatini (login qilinganmi, profil ma'lumotlari) butun ilova bo'ylab ulashish uchun context
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sahifa yangilanganda tokendan foydalanuvchini qayta yuklab olish
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      getProfile()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const { data } = await loginUser({ username, password });
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    await registerUser(payload);
    return login(payload.username, payload.password);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await getProfile();
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
