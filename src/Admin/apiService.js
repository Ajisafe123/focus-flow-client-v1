// apiService.js

export const API_BASE = "http://localhost:8000";
export const DEFAULT_LIMIT = 10;

const handleError = async (res, defaultMsg) => {
  let errorMsg = defaultMsg;
  try {
    const errorData = await res.json();
    if (errorData.message) errorMsg = errorData.message;
    else if (errorData.detail) {
      if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
        const e = errorData.detail[0];
        errorMsg = `Validation Error: ${e.loc.join(" → ")} - ${e.msg}`;
      } else errorMsg = errorData.detail;
    }
  } catch {
    errorMsg = `${defaultMsg}: Could not parse error details.`;
  }
  console.error(`API Error (${res.status}):`, errorMsg);
  throw new Error(errorMsg);
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token missing");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/* ======================== DUAS & ADHKAR ======================== */

export const fetchDuas = async () => {
  const res = await fetch(`${API_BASE}/api/duas`);
  if (!res.ok) await handleError(res, "Failed to fetch Duas.");
  return res.json();
};

export const fetchCategories = async () => {
  const res = await fetch(`${API_BASE}/api/dua-categories`);
  if (!res.ok) await handleError(res, "Failed to fetch Dua Categories.");
  const data = await res.json();
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

export const fetchStats = async () => {
  const res = await fetch(`${API_BASE}/api/duas/stats`);
  if (!res.ok) await handleError(res, "Failed to fetch Dua Stats.");
  return res.json();
};

export const createOrUpdateDua = async (
  duaData,
  isEdit = false,
  duaId = null
) => {
  const method = isEdit ? "PATCH" : "POST";
  const url = isEdit ? `${API_BASE}/api/duas/${duaId}` : `${API_BASE}/api/duas`;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(duaData),
  });
  if (!res.ok)
    await handleError(
      res,
      isEdit ? "Failed to update Dua." : "Failed to create Dua."
    );
  return res;
};

export const deleteDua = async (duaId) => {
  const res = await fetch(`${API_BASE}/api/duas/${duaId}`, {
    method: "DELETE",
  });
  if (!res.ok) await handleError(res, "Failed to delete Dua.");
  return res;
};

export const bulkDeleteDuas = async (idsArray) => {
  const res = await fetch(`${API_BASE}/api/duas/bulk`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(idsArray),
  });
  if (!res.ok) await handleError(res, "Failed to bulk delete Duas.");
  return res;
};

/* ======================== CATEGORY CRUD (DUA & HADITH) ======================== */

const getCategoryBase = (categoryType) =>
  categoryType === "hadith"
    ? `${API_BASE}/api/hadith-categories`
    : `${API_BASE}/api/dua-categories`;

export const createCategory = async (
  categoryType,
  formData,
  imageFile = null
) => {
  const url = getCategoryBase(categoryType);
  const payload = new FormData();
  payload.append("name", formData.name);
  payload.append("description", formData.description || "");
  payload.append("is_active", formData.is_active);

  if (imageFile) payload.append("image_file", imageFile);

  const res = await fetch(url, { method: "POST", body: payload });
  if (!res.ok) await handleError(res, "Failed to create category");
  return res.json();
};

export const updateCategory = async (categoryType, id, formData) => {
  const url = `${getCategoryBase(categoryType)}/${id}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!res.ok) await handleError(res, "Failed to update category");
  return res.json();
};

export const uploadCategoryImage = async (categoryType, id, imageFile) => {
  const url = `${getCategoryBase(categoryType)}/${id}/image-upload`;
  const payload = new FormData();
  payload.append("image_file", imageFile);

  const res = await fetch(url, { method: "POST", body: payload });
  if (!res.ok) await handleError(res, "Failed to upload category image");
  return res.json();
};

export const deleteCategory = async (categoryType, categoryId) => {
  const url = `${getCategoryBase(categoryType)}/${categoryId}`;
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok) await handleError(res, "Failed to delete category");
  return true;
};

/* ======================== END CATEGORY CRUD ======================== */

export const toggleFeaturedStatus = async (duaId, currentStatus) => {
  const res = await fetch(`${API_BASE}/api/duas/${duaId}/featured`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ featured: !currentStatus }),
  });
  if (!res.ok) await handleError(res, "Failed to toggle Dua featured status.");
  return res;
};

export const updateDuaViewCount = async (duaId) => {
  const res = await fetch(`${API_BASE}/api/duas/${duaId}/increment-view`, {
    method: "PATCH",
  });
  if (!res.ok) await handleError(res, "Failed to update Dua view count.");
  return res;
};

export const bulkUploadDuaData = async (file, categoryId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category_id", categoryId);
  const res = await fetch(`${API_BASE}/api/duas/bulk-data-upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) await handleError(res, "Bulk Dua data upload failed.");
  return res.json();
};

export const bulkUploadDuaAudio = async (audioFile, categoryId) => {
  const formData = new FormData();
  formData.append("audio_file", audioFile, audioFile.name);
  const res = await fetch(
    `${API_BASE}/api/categories/${categoryId}/audio-update`,
    {
      method: "POST",
      body: formData,
    }
  );
  if (!res.ok) await handleError(res, "Bulk Dua audio upload failed.");
  return res;
};

/* ======================== HADITH ======================== */

export const fetchHadithCategories = async () => {
  const res = await fetch(`${API_BASE}/api/hadith-categories`);
  if (!res.ok) await handleError(res, "Failed to fetch Hadith Categories.");
  const data = await res.json();
  return data.map((c) => ({
    id: String(c.id),
    label: c.name,
    description: c.description || "",
    is_active: c.is_active ?? true,
  }));
};

export const fetchHadithStats = async (categories = []) => {
  const res = await fetch(`${API_BASE}/api/hadiths/stats`);
  if (!res.ok) await handleError(res, "Failed to fetch Hadith statistics.");
  const data = await res.json();
  
  // Transform the API response into the expected array format
  const totalCategories = categories.filter(c => c.id !== "all").length;
  
  return [
    {
      title: "Total Hadiths",
      value: data.total_hadiths || 0,
    },
    {
      title: "Views & Favorites",
      value: `${(data.total_views || 0).toLocaleString()} / ${(data.total_favorites || 0).toLocaleString()}`,
    },
    {
      title: "Featured Hadiths",
      value: data.total_featured || 0,
    },
    {
      title: "Total Categories",
      value: totalCategories,
    },
  ];
};

export const fetchPaginatedHadiths = async (
  page = 1,
  query = "",
  categoryId = "all"
) => {
  const params = new URLSearchParams({ page, limit: DEFAULT_LIMIT, q: query });
  if (categoryId !== "all" && categoryId)
    params.append("category_id", categoryId);
  const res = await fetch(`${API_BASE}/api/hadiths/paginated?${params}`);
  if (!res.ok) await handleError(res, "Failed to fetch Hadiths.");
  return res.json();
};

export const createOrUpdateHadith = async (
  hadithData,
  isEdit = false,
  hadithId = null
) => {
  const method = isEdit ? "PATCH" : "POST";
  const url = isEdit
    ? `${API_BASE}/api/hadiths/${hadithId}`
    : `${API_BASE}/api/hadiths`;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hadithData),
  });
  if (!res.ok)
    await handleError(
      res,
      isEdit ? "Failed to update Hadith." : "Failed to create Hadith."
    );
  return res;
};

export const deleteHadith = async (hadithId) => {
  const res = await fetch(`${API_BASE}/api/hadiths/${hadithId}`, {
    method: "DELETE",
  });
  if (!res.ok) await handleError(res, "Failed to delete Hadith.");
  return res;
};

export const toggleHadithFeaturedStatus = async (hadithId) => {
  const res = await fetch(`${API_BASE}/api/hadiths/${hadithId}/featured`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok)
    await handleError(res, "Failed to toggle Hadith featured status.");
  return res.json();
};

export const bulkUploadHadith = async (file, categoryId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category_id", categoryId);
  const res = await fetch(`${API_BASE}/api/hadiths/bulk-data-upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) await handleError(res, "Bulk Hadith upload failed.");
  return res.json();
};

/* ======================== ADMIN USER MANAGEMENT ======================== */

export const fetchUsers = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.limit) query.append("limit", params.limit);
  if (params.offset) query.append("offset", params.offset);
  if (params.search) query.append("search", params.search);
  if (params.role) query.append("role", params.role);
  if (params.status) query.append("status", params.status);

  const url = `${API_BASE}/api/admin/users${
    query.toString() ? `?${query}` : ""
  }`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const fetchUserById = async (userId) => {
  const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

export const createUser = async (userData) => {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create user");
  }
  return res.json();
};

export const updateUser = async (userId, userData) => {
  const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update user");
  }
  return res.json();
};

export const deleteUser = async (userId) => {
  const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return true;
};

export const suspendUser = async (userId) => {
  const res = await fetch(`${API_BASE}/api/admin/users/${userId}/suspend`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to suspend user");
  return res.json();
};

export const activateUser = async (userId) => {
  const res = await fetch(`${API_BASE}/api/admin/users/${userId}/activate`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to activate user");
  return res.json();
};

export const changeUserRole = async (userId, role) => {
  const res = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error("Failed to change user role");
  return res.json();
};

export const fetchUserStats = async () => {
  const res = await fetch(`${API_BASE}/api/admin/users/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch user stats");
  return res.json();
};

/* ======================== ARTICLES ======================== */

export const fetchArticles = async (page = 1, limit = 10, query = "", categoryId = null, featured = null) => {
  const params = new URLSearchParams({ page, limit, q: query });
  if (categoryId) params.append("category_id", categoryId);
  if (featured !== null) params.append("featured", featured);
  
  const res = await fetch(`${API_BASE}/api/articles/paginated?${params}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) await handleError(res, "Failed to fetch articles");
  const data = await res.json();
  // API returns array directly, not wrapped in object
  return Array.isArray(data) ? data : [];
};

export const fetchArticleCategories = async () => {
  const res = await fetch(`${API_BASE}/api/article-categories`);
  if (!res.ok) await handleError(res, "Failed to fetch article categories");
  return res.json();
};

export const fetchArticleStats = async () => {
  const res = await fetch(`${API_BASE}/api/articles/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) await handleError(res, "Failed to fetch article stats");
  return res.json();
};

/* ======================== TEACHING (ADMIN) ======================== */
export const fetchLessonsAdmin = async (category, level) => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (level) params.append("level", level);
  const qs = params.toString();
  const res = await fetch(`${API_BASE}/api/lessons${qs ? `?${qs}` : ""}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) await handleError(res, "Failed to fetch lessons");
  return res.json();
};

export const createLesson = async (payload) => {
  const res = await fetch(`${API_BASE}/api/lessons`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) await handleError(res, "Failed to create lesson");
  return res.json();
};

export const updateLesson = async (lessonId, payload) => {
  const res = await fetch(`${API_BASE}/api/lessons/${lessonId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) await handleError(res, "Failed to update lesson");
  return res.json();
};

export const deleteLesson = async (lessonId) => {
  const res = await fetch(`${API_BASE}/api/lessons/${lessonId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) await handleError(res, "Failed to delete lesson");
  return res.json();
};

export const fetchStudyGuidesAdmin = async (category, difficulty) => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (difficulty) params.append("difficulty", difficulty);
  const qs = params.toString();
  const res = await fetch(
    `${API_BASE}/api/study-guides${qs ? `?${qs}` : ""}`,
    { headers: getAuthHeaders() }
  );
  if (!res.ok) await handleError(res, "Failed to fetch study guides");
  return res.json();
};

export const createStudyGuide = async (payload) => {
  const res = await fetch(`${API_BASE}/api/study-guides`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) await handleError(res, "Failed to create study guide");
  return res.json();
};

export const updateStudyGuide = async (id, payload) => {
  const res = await fetch(`${API_BASE}/api/study-guides/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) await handleError(res, "Failed to update study guide");
  return res.json();
};

export const deleteStudyGuide = async (id) => {
  const res = await fetch(`${API_BASE}/api/study-guides/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) await handleError(res, "Failed to delete study guide");
  return res.json();
};

export const fetchTeachingResourcesAdmin = async (category, type) => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (type) params.append("type", type);
  const qs = params.toString();
  const res = await fetch(
    `${API_BASE}/api/teaching-resources${qs ? `?${qs}` : ""}`,
    { headers: getAuthHeaders() }
  );
  if (!res.ok) await handleError(res, "Failed to fetch teaching resources");
  return res.json();
};

export const createTeachingResource = async (payload) => {
  const res = await fetch(`${API_BASE}/api/teaching-resources`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) await handleError(res, "Failed to create teaching resource");
  return res.json();
};

export const updateTeachingResource = async (id, payload) => {
  const res = await fetch(`${API_BASE}/api/teaching-resources/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) await handleError(res, "Failed to update teaching resource");
  return res.json();
};

export const deleteTeachingResource = async (id) => {
  const res = await fetch(`${API_BASE}/api/teaching-resources/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) await handleError(res, "Failed to delete teaching resource");
  return res.json();
};

export const createArticle = async (articleData) => {
  const res = await fetch(`${API_BASE}/api/articles`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(articleData),
  });
  if (!res.ok) await handleError(res, "Failed to create article");
  return res.json();
};

export const updateArticle = async (articleId, articleData) => {
  const res = await fetch(`${API_BASE}/api/articles/${articleId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(articleData),
  });
  if (!res.ok) await handleError(res, "Failed to update article");
  return res.json();
};

export const deleteArticle = async (articleId) => {
  const res = await fetch(`${API_BASE}/api/articles/${articleId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) await handleError(res, "Failed to delete article");
  return res.json();
};

export const toggleArticleFeatured = async (articleId) => {
  const res = await fetch(`${API_BASE}/api/articles/${articleId}/featured`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  if (!res.ok) await handleError(res, "Failed to toggle featured status");
  return res.json();
};

export const getArticle = async (articleId) => {
  const res = await fetch(`${API_BASE}/api/articles/${articleId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) await handleError(res, "Failed to fetch article");
  return res.json();
};

/* ======================== CONVERSATIONS / CHAT ======================== */
export const fetchConversations = async (limit = 50) => {
  const res = await fetch(`${API_BASE}/api/conversations?limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) await handleError(res, "Failed to fetch conversations");
  return res.json();
};

export const fetchConversationMessages = async (conversationId) => {
  const res = await fetch(
    `${API_BASE}/api/messages/${conversationId}/messages`,
    {
      headers: getAuthHeaders(),
    }
  );
  if (!res.ok) await handleError(res, "Failed to fetch messages");
  return res.json();
};

export const sendConversationMessage = async ({
  conversationId,
  text,
  senderId,
  senderType = "admin",
}) => {
  const res = await fetch(`${API_BASE}/api/messages`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      conversationId,
      text,
      senderId,
      senderType,
      messageType: "text",
    }),
  });
  if (!res.ok) await handleError(res, "Failed to send message");
  return res.json();
};

/* ======================== DASHBOARD & ANALYTICS ======================== */

export const fetchDashboardStats = async () => {
  try {
    const [userStats, duaStats, hadithStats, articleStats] = await Promise.all([
      fetchUserStats(),
      fetch(`${API_BASE}/api/duas/stats`).then((r) => r.json()),
      fetch(`${API_BASE}/api/hadiths/stats`).then((r) => r.json()),
      fetch(`${API_BASE}/api/articles/stats`).then((r) => r.json()),
    ]);

    return {
      users: userStats.total_users || 0,
      duas: duaStats.total_duas || 0,
      hadiths: hadithStats.total_hadiths || 0,
      articles: articleStats.total_articles || 0,
      totalViews: (duaStats.total_views || 0) + (hadithStats.total_views || 0) + (articleStats.total_views || 0),
      totalFavorites: (duaStats.total_favorites || 0) + (hadithStats.total_favorites || 0) + (articleStats.total_favorites || 0),
    };
  } catch (err) {
    console.error("Dashboard stats fetch error:", err);
    throw err;
  }
};

export const fetchAnalyticsData = async () => {
  try {
    const [userStats, duaStats, hadithStats, articleStats, videos, audio] = await Promise.all([
      fetchUserStats(),
      fetch(`${API_BASE}/api/duas/stats`).then((r) => r.json()),
      fetch(`${API_BASE}/api/hadiths/stats`).then((r) => r.json()),
      fetch(`${API_BASE}/api/articles/stats`).then((r) => r.json()),
      fetch(`${API_BASE}/api/videos`).then((r) => r.json()),
      fetch(`${API_BASE}/api/audio`).then((r) => r.json()),
    ]);

    return {
      stats: {
        users: userStats.total_users || 0,
        articles: articleStats.total_articles || 0,
        duas: duaStats.total_duas || 0,
        engagementRate: calculateEngagementRate(duaStats, hadithStats, articleStats),
      },
      topContent: [
        ...(articleStats.top_viewed || []).slice(0, 5).map((a) => ({
          title: a.title,
          views: articleStats.total_views || 0,
          engagement: Math.round(Math.random() * 10 + 85), // Placeholder
        })),
      ],
      videos: videos.length || 0,
      audio: audio.length || 0,
    };
  } catch (err) {
    console.error("Analytics data fetch error:", err);
    throw err;
  }
};

const calculateEngagementRate = (duaStats, hadithStats, articleStats) => {
  const totalViews = (duaStats.total_views || 0) + (hadithStats.total_views || 0) + (articleStats.total_views || 0);
  const totalFavorites = (duaStats.total_favorites || 0) + (hadithStats.total_favorites || 0) + (articleStats.total_favorites || 0);
  if (totalViews === 0) return 0;
  return Math.round((totalFavorites / totalViews) * 100);
};

export const exportAnalyticsData = async (format = "json") => {
  try {
    const data = await fetchAnalyticsData();
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `analytics-export-${timestamp}.${format}`;

    if (format === "csv") {
      // Convert to CSV format
      const csvRows = [];
      csvRows.push("Metric,Value");
      csvRows.push(`Total Users,${data.stats.users}`);
      csvRows.push(`Total Articles,${data.stats.articles}`);
      csvRows.push(`Total Duas,${data.stats.duas}`);
      csvRows.push(`Engagement Rate,${data.stats.engagementRate}%`);
      
      // Add top content if available
      if (data.topContent && data.topContent.length > 0) {
        csvRows.push("");
        csvRows.push("Top Content,Views,Engagement %");
        data.topContent.forEach((item) => {
          csvRows.push(`"${item.title}",${item.views},${item.engagement}`);
        });
      }
      
      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // JSON format
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (err) {
    console.error("Export error:", err);
    throw err;
  }
};
