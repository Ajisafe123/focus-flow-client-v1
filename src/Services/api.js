const API_BASE_URL = "http://127.0.0.1:8000";

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

  // --- Auth ---
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

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/users/me`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return await this.handleResponse(response);
  }

  // --- User Location ---
  async getUserLocation() {
    const headers = this.getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/auth/users/me/location`, {
      method: "GET",
      headers,
    });
    return await this.handleResponse(res);
  }

  async updateUserLocation({ city, region, country }) {
    const headers = this.getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/auth/users/me/location`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ city, region, country }),
    });
    return await this.handleResponse(res);
  }

  // --- Prayer Times ---
  async getPrayerTimes(lat, lon, method = "ISNA", includeSun = false) {
    const url = new URL(`${API_BASE_URL}/prayer/location`);
    url.searchParams.append("lat", lat);
    url.searchParams.append("lon", lon);
    url.searchParams.append("method", method);
    url.searchParams.append("include_sun_notifications", includeSun);

    const response = await fetch(url.toString(), {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || "Failed to fetch prayer times");
    }
    return await response.json();
  }
}

const apiService = new ApiService();
export default apiService;
