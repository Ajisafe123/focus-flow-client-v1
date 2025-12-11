import { useRef } from "react";

// Central API Configuration
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? "http://localhost:8000" : "https://focus-flow-server-v1.onrender.com")).replace(/\/+$/, "");

export const API_BASE = `${API_BASE_URL}/api`;
export const DEFAULT_LIMIT = 10;

// Helper to get headers
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
};

// Generic Error Handler
const handleError = async (res, defaultMsg = "An error occurred") => {
    let errorMsg = defaultMsg;
    try {
        const data = await res.json();
        if (data.detail) errorMsg = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
        else if (data.message) errorMsg = data.message;
    } catch { }

    const error = new Error(errorMsg);
    error.status = res.status;
    throw error;
};

// Generic Fetch Wrapper
const request = async (endpoint, options = {}) => {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;
    const headers = { ...getAuthHeaders(), ...(options.headers || {}) };

    // Handle FormData (don't set Content-Type)
    if (options.body instanceof FormData) {
        delete headers["Content-Type"];
    }

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) await handleError(res);

    // Return null for 204 No Content
    if (res.status === 204) return null;

    // Return JSON if content-type is json
    const cType = res.headers.get("content-type");
    if (cType && cType.includes("application/json")) return res.json();

    return res;
};

/* ======================== AUTH & USER ======================== */

export const login = async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    if (!res.ok) await handleError(res, "Login failed");
    const data = await res.json();
    if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", (data.role || "user").toLowerCase());
    }
    return data;
};

export const register = async (data) => request(`${API_BASE_URL}/auth/register`, { method: "POST", body: JSON.stringify(data) });
export const verifyEmail = async (data) => {
    const res = await request(`${API_BASE_URL}/auth/verify-email`, { method: "POST", body: JSON.stringify(data) });
    if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", (res.user?.role || "user").toLowerCase());
    }
    return res;
};
export const resendVerificationCode = (email) => request(`${API_BASE_URL}/auth/resend-verification`, { method: "POST", body: JSON.stringify({ email }) });
export const forgotPassword = (email) => request(`${API_BASE_URL}/auth/forgot-password`, { method: "POST", body: JSON.stringify({ email }) });
export const verifyCode = (data) => request(`${API_BASE_URL}/auth/verify-code`, { method: "POST", body: JSON.stringify(data) });
export const resetPassword = (data) => request(`${API_BASE_URL}/auth/reset-password`, { method: "POST", body: JSON.stringify(data) });
export const fetchProfileMe = () => request(`${API_BASE_URL}/auth/me`);
export const updateProfile = (data) => request(`${API_BASE_URL}/auth/profile/update`, { method: "PUT", body: data instanceof FormData ? data : JSON.stringify(data) }); // Handle both
export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return request(`${API_BASE_URL}/auth/logout`, { method: "POST" }).catch(() => { });
};
export const logout = logoutUser; // Alias

/* ======================== ADMIN MANAGEMENT ======================== */

export const fetchUsers = (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/users?${qs}`);
};
export const createUser = (data) => request(`/admin/users`, { method: "POST", body: JSON.stringify(data) });
export const updateUser = (id, data) => request(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteUser = (id) => request(`/admin/users/${id}`, { method: "DELETE" });
export const suspendUser = (id) => request(`/admin/users/${id}/suspend`, { method: "PATCH" });
export const activateUser = (id) => request(`/admin/users/${id}/activate`, { method: "PATCH" });
export const changeUserRole = (id, role) => request(`/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) });
export const fetchUserStats = () => request(`/admin/users/stats`);

/* ======================== DUAS ======================== */

export const fetchDuas = () => request(`/duas`);
export const fetchDuaCategories = async () => {
    const data = await request(`/dua-categories`);
    // Normalize logic from Admin/apiService
    return [
        { id: "all", label: "All Categories", description: "" },
        ...(data || []).map((c) => ({
            id: String(c.id),
            label: c.name,
            description: c.description || "",
            is_active: c.is_active ?? true,
            duas: c.duas || [],
            image_url: c.image_url || null,
        })),
    ];
};
export const createOrUpdateDua = (data, isEdit, id) => {
    const url = isEdit ? `/duas/${id}` : `/duas`;
    return request(url, { method: isEdit ? "PATCH" : "POST", body: JSON.stringify(data) });
};
export const deleteDua = (id) => request(`/duas/${id}`, { method: "DELETE" });
export const toggleFeaturedStatus = (id, currentStatus) => request(`/duas/${id}/featured`, { method: "PATCH", body: JSON.stringify({ featured: !currentStatus }) });

/* ======================== ARTICLES ======================== */
export const fetchArticleCategories = () => request(`/article-categories`);
export const fetchArticles = async (page = 1, limit = 10, query = "", categoryId = null, featured = null) => {
    const params = new URLSearchParams({ page, limit, q: query });
    if (categoryId) params.append("category_id", categoryId);
    if (featured !== null) params.append("featured", featured);
    return request(`/articles/paginated?${params}`);
};
export const createArticle = (data) => request(`/articles`, { method: "POST", body: JSON.stringify(data) });
export const updateArticle = (id, data) => request(`/articles/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteArticle = (id) => request(`/articles/${id}`, { method: "DELETE" });
export const getArticle = (id) => request(`/articles/${id}`);
export const toggleArticleFeatured = (id) => request(`/articles/${id}/featured`, { method: "PATCH" });

/* ======================== CHAT ======================== */

export const fetchConversations = (limit = 50) => request(`/conversations?limit=${limit}`);
export const fetchConversationMessages = (id) => request(`/messages/${id}/messages`);
export const sendChatMessage = (data) => request(`/messages`, { method: "POST", body: JSON.stringify(data) });
// Alias for admin usage
export const sendConversationMessage = sendChatMessage;
export const markMessagesRead = (id) => request(`/messages/${id}/read`, { method: "POST" });
export const updateMessage = (id, text) => {
    const fd = new FormData();
    fd.append("text", text);
    return request(`/messages/${id}`, { method: "PUT", body: fd });
};
export const deleteMessage = (id) => request(`/messages/${id}`, { method: "DELETE" });
export const createConversation = (data) => request(`/conversations`, { method: "POST", body: JSON.stringify(data) });

/* ======================== CATEGORIES (GENERIC) ======================== */

const getCategoryEndpoint = (type) => {
    switch (type) {
        case "hadith": return "/hadith-categories";
        case "article": return "/article-categories";
        default: return "/dua-categories";
    }
};

export const createCategory = (type, formData, imageFile) => {
    const url = getCategoryEndpoint(type);
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("description", formData.description || "");
    fd.append("is_active", formData.is_active);
    if (imageFile) fd.append("image_file", imageFile);
    return request(url, { method: "POST", body: fd });
};

export const updateCategory = (type, id, formData) => request(`${getCategoryEndpoint(type)}/${id}`, { method: "PATCH", body: JSON.stringify(formData) });
export const deleteCategory = (type, id) => request(`${getCategoryEndpoint(type)}/${id}`, { method: "DELETE" });

/* ======================== HADITHS ======================== */
export const fetchHadithCategories = () => request(`/hadith-categories`);
export const fetchHadithsPaginated = (query, token, limit = 1000) => request(`/hadiths/paginated?q=${encodeURIComponent(query)}&limit=${limit}`);
export const createOrUpdateHadith = (data, isEdit, id) => request(isEdit ? `/hadiths/${id}` : `/hadiths`, { method: isEdit ? "PATCH" : "POST", body: JSON.stringify(data) });
export const deleteHadith = (id) => request(`/hadiths/${id}`, { method: "DELETE" });

/* ======================== WEBSOCKET HELPER ======================== */
export const getWebSocketUrl = (path) => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = API_BASE_URL.replace(/^https?:\/\//, ""); // Remove protocol from base url
    return `${protocol}//${host}${path.startsWith("/") ? "" : "/"}${path}`;
};
