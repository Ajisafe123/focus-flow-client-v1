const API_BASE_URL = "https://focus-flow-server-v1.onrender.com";

class ApiService {
  getAuthHeaders() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
    }
    return await response.json();
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
    if (!token) throw new Error("No token returned from backend");

    localStorage.setItem("token", token);
    return data;
  }

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });
    return await this.handleResponse(response);
  }

  
}

const apiService = new ApiService();
export default apiService;
