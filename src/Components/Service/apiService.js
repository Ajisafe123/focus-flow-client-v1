// src/services/api.js
export const API_BASE_URL = "http://localhost:8000";

class ApiService {
  getToken() {
    return localStorage.getItem("token");
  }
  getRole() {
    const stored = localStorage.getItem("role") || "user";
    return stored.trim().toLowerCase();
  }

  async getAuthHeaders() {
    const token = this.getToken();
    if (!token) throw new Error("No token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async handleResponse(res) {
    if (!res.ok) {
      let msg = "Error";
      try {
        const d = await res.json();
        msg = d.detail || d.message || msg;
      } catch {}
      throw new Error(msg);
    }
    return res.headers.get("content-type")?.includes("json")
      ? await res.json()
      : null;
  }

  async register(data) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await this.handleResponse(res);
    return json;
  }

  async login(data) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await this.handleResponse(res);
    if (json.token) {
      localStorage.setItem("token", json.token);
      const normalizedRole = (json.role || "user").toLowerCase().trim();
      localStorage.setItem("role", normalizedRole);
    }
    return json;
  }

  async verifyEmail(data) {
    const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await this.handleResponse(res);
    if (json.token) {
      localStorage.setItem("token", json.token);
      const normalizedRole = (json.user?.role || "user").toLowerCase().trim();
      localStorage.setItem("role", normalizedRole);
    }
    return json;
  }

  async forgotPassword(email) {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return this.handleResponse(res);
  }

  async verifyCode(data) {
    const res = await fetch(`${API_BASE_URL}/auth/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async resetPassword(data) {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async updateProfile(data) {
    const res = await fetch(`${API_BASE_URL}/auth/profile/update`, {
      method: "POST",
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async me() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse(res);
  }

  /* ======================== Landing & Shared ======================== */
  async getTeachingCategories() {
    const res = await fetch(`${API_BASE_URL}/api/teaching-categories`);
    return this.handleResponse(res);
  }

  async getDuaCategories() {
    const res = await fetch(`${API_BASE_URL}/api/dua-categories`);
    return this.handleResponse(res);
  }

  async getDuas(token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE_URL}/api/duas`, { headers });
    return this.handleResponse(res);
  }

  async getCategorySegments(categoryId) {
    const res = await fetch(
      `${API_BASE_URL}/api/categories/${categoryId}/full-segments`
    );
    return this.handleResponse(res);
  }

  async toggleDuaFavorite(duaId, token) {
    const res = await fetch(`${API_BASE_URL}/api/duas/${duaId}/toggle-favorite`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return this.handleResponse(res);
  }

  async getDailyHadith() {
    const res = await fetch(`${API_BASE_URL}/api/day`);
    return this.handleResponse(res);
  }

  async sendContactMessage(formData) {
    const res = await fetch(`${API_BASE_URL}/contact/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    return this.handleResponse(res);
  }

  async logout() {
    const token = this.getToken();
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      // ignore network errors; still clear client state
    } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    }
  }
}

const apiService = new ApiService();
export default apiService;
export const logout = () => apiService.logout();
