import api from "./axios";

/* ---------- Accounts (ro'yxatdan o'tish, login, profil) ---------- */
export const registerUser = (payload) => api.post("/accounts/register/", payload);
export const loginUser = (payload) => api.post("/accounts/login/", payload);
export const getProfile = () => api.get("/accounts/profile/");
export const updateProfile = (payload) => {
  // rasm bo'lishi mumkin bo'lgani uchun FormData ishlatamiz
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  return api.patch("/accounts/profile/", formData, { headers: { "Content-Type": "multipart/form-data" } });
};
export const getCards = () => api.get("/accounts/cards/");
export const addCard = (payload) => api.post("/accounts/cards/", payload);
export const deleteCard = (id) => api.delete(`/accounts/cards/${id}/`);

/* ---------- Catalog (kategoriya, do'kon, mahsulot, izoh) ---------- */
export const getCategories = () => api.get("/catalog/categories/");
export const getMarkets = () => api.get("/catalog/markets/");
export const getMarket = (id) => api.get(`/catalog/markets/${id}/`);
export const getProducts = (params) => api.get("/catalog/products/", { params });
export const getProduct = (id) => api.get(`/catalog/products/${id}/`);
export const createProduct = (payload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
      return;
    }
    formData.append(key, value);
  });
  return api.post("/catalog/products/", formData, { headers: { "Content-Type": "multipart/form-data" } });
};
export const addReview = (payload) => api.post("/catalog/reviews/", payload);

/* ---------- Orders (savatcha, checkout, buyurtmalar) ---------- */
export const getCart = () => api.get("/orders/cart/");
export const addToCart = (product, quantity = 1) => api.post("/orders/cart/add/", { product, quantity });
export const updateCartItem = (id, quantity) => api.patch(`/orders/cart/items/${id}/`, { quantity });
export const removeCartItem = (id) => api.delete(`/orders/cart/items/${id}/`);
export const checkout = (payload) => api.post("/orders/checkout/", payload);
export const getOrders = () => api.get("/orders/orders/");
export const getOrder = (id) => api.get(`/orders/orders/${id}/`);
export const updateOrderStatus = (id, status) => api.patch(`/orders/orders/${id}/status/`, { status });

/* ---------- Analytics (admin dashboard) ---------- */
export const getDashboardStats = () => api.get("/analytics/dashboard/");
