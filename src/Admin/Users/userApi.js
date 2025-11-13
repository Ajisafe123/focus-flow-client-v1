const API_BASE = "https://focus-flow-server-v1.onrender.com";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const fetchUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append("limit", params.limit);
    if (params.offset) queryParams.append("offset", params.offset);
    if (params.search) queryParams.append("search", params.search);
    if (params.role) queryParams.append("role", params.role);
    if (params.status) queryParams.append("status", params.status);

    const url = `${API_BASE}/api/admin/users${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserById = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/users`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to create user");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to update user");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    return true;
  } catch (error) {
    throw error;
  }
};

export const suspendUser = async (userId) => {
  try {
    const response = await fetch(
      `${API_BASE}/api/admin/users/${userId}/suspend`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to suspend user");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const activateUser = async (userId) => {
  try {
    const response = await fetch(
      `${API_BASE}/api/admin/users/${userId}/activate`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to activate user");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const changeUserRole = async (userId, role) => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      throw new Error("Failed to change user role");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchUserStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/users/stats`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user statistics");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
