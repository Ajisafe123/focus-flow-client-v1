const API_BASE_URL = "https://focus-flow-server-v1.onrender.com";

class ApiService {
  getToken() {
    return localStorage.getItem("token");
  }

  getRole() {
    return localStorage.getItem("role") || "user";
  }

  async getAuthHeaders() {
    const token = this.getToken();
    if (!token) throw new Error("Not authenticated");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async handleResponse(response) {
    if (!response.ok) {
      let errorMsg = `HTTP error! status: ${response.status}`;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json().catch(() => ({}));
        errorMsg = errorData.detail || errorData.message || errorMsg;
      }
      throw new Error(errorMsg);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return null;
  }

  async register({ username, email, password }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    return await this.handleResponse(response);
  }

  async login({ identifier, password }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await this.handleResponse(response);
    const token = data.token || data.access_token || data.accessToken;
    const role = data.role || "user";

    if (!token) throw new Error("No token returned from backend");

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    return data;
  }

  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: await this.getAuthHeaders(),
      });
      await this.handleResponse(response);
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  async fetchWithAuth(url, options = {}) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: { ...headers, ...(options.headers || {}) },
    });
    return this.handleResponse(response);
  }

  isAdmin() {
    return this.getRole() === "admin";
  }
}

const apiService = new ApiService();
export default apiService;
