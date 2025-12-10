import apiService, { API_BASE_URL } from "../../Components/Service/apiService";

const API_BASE = `${API_BASE_URL}/api`;

export { API_BASE_URL };
export const logout = () => apiService.logout();
export default apiService;

const withAuth = (token) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

const handleJson = async (res) => {
  if (res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("json")) {
      return res.json();
    }
    return null;
  }

  let message = `HTTP ${res.status}`;
  try {
    const data = await res.json();
    message = data.detail || data.message || message;
  } catch {
    // ignore parse errors
  }
  const error = new Error(message);
  error.status = res.status;
  throw error;
};

/* ======================== ARTICLES ======================== */
export const fetchArticleCategories = async () =>
  handleJson(await fetch(`${API_BASE}/article-categories`));

export const fetchArticlesPaginated = async (
  page = 1,
  limit = 10,
  query = "",
  categoryId = null,
  featured = null,
  token
) => {
  const params = new URLSearchParams({ page, limit, q: query });
  if (categoryId) params.append("category_id", categoryId);
  if (featured !== null && featured !== undefined)
    params.append("featured", featured);

  return handleJson(
    await fetch(`${API_BASE}/articles/paginated?${params.toString()}`, {
      headers: {
        ...withAuth(token),
      },
    })
  );
};

export const fetchArticle = async (articleId, token) =>
  handleJson(
    await fetch(`${API_BASE}/articles/${articleId}`, {
      headers: {
        ...withAuth(token),
      },
    })
  );

export const toggleArticleFavorite = async (articleId, token) =>
  handleJson(
    await fetch(`${API_BASE}/articles/${articleId}/toggle-favorite`, {
      method: "PATCH",
      headers: {
        ...withAuth(token),
      },
    })
  );

/* ======================== CHAT ======================== */
const isUuid = (value) =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim()
  );

export const createConversation = async ({ userId, userEmail, userName }) => {
  const payload = { userEmail, userName };
  if (isUuid(userId)) {
    payload.userId = userId;
  }
  return handleJson(
    await fetch(`${API_BASE}/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
};

export const fetchConversationMessages = async (conversationId) =>
  handleJson(
    await fetch(`${API_BASE}/messages/${conversationId}/messages`)
  );

export const sendChatMessage = async ({
  conversationId,
  text,
  senderId,
  senderType = "user",
  messageType = "text",
  fileUrl = null,
}) =>
  handleJson(
    await fetch(`${API_BASE}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        text,
        senderId,
        senderType,
        messageType,
        fileUrl,
      }),
    })
  );

/* ======================== NOTIFICATIONS ======================== */
export const fetchNotifications = async (token, limit = 50) =>
  handleJson(
    await fetch(`${API_BASE}/notifications?limit=${limit}`, {
      headers: {
        ...withAuth(token),
      },
    })
  );

export const markAllNotificationsRead = async (token) =>
  handleJson(
    await fetch(`${API_BASE}/notifications/mark-read-all`, {
      method: "POST",
      headers: {
        ...withAuth(token),
      },
    })
  );

export const markNotificationRead = async (notificationId, token) =>
  handleJson(
    await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
      method: "POST",
      headers: {
        ...withAuth(token),
      },
    })
  );

/* ======================== MEDIA ======================== */
export const fetchAudio = async (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
  return handleJson(await fetch(`${API_BASE}/audio${qs.size ? `?${qs}` : ""}`));
};

export const fetchVideos = async (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
  return handleJson(await fetch(`${API_BASE}/videos${qs.size ? `?${qs}` : ""}`));
};

/* ======================== DUAS ======================== */
export const fetchDuaCategories = async () =>
  handleJson(await fetch(`${API_BASE}/dua-categories`));

export const fetchDuasPaginated = async (query = "", token, limit = 1000) => {
  const url = `${API_BASE}/duas/paginated?q=${encodeURIComponent(
    query
  )}&limit=${limit}`;
  return handleJson(
    await fetch(url, {
      headers: {
        ...withAuth(token),
      },
    })
  );
};

export const shareDua = async (duaId, token) =>
  handleJson(
    await fetch(`${API_BASE}/duas/${duaId}/share-link`, {
      method: "POST",
      headers: {
        ...withAuth(token),
      },
    })
  );

export const toggleDuaFavorite = async (duaId, token) =>
  handleJson(
    await fetch(`${API_BASE}/duas/${duaId}/toggle-favorite`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...withAuth(token),
      },
    })
  );

/* ======================== HADITHS ======================== */
export const fetchHadithCategories = async () =>
  handleJson(await fetch(`${API_BASE}/hadith-categories`));

export const fetchHadithsPaginated = async (
  query = "",
  token,
  limit = 1000
) => {
  const url = `${API_BASE}/hadiths/paginated?q=${encodeURIComponent(
    query
  )}&limit=${limit}`;
  return handleJson(
    await fetch(url, {
      headers: {
        ...withAuth(token),
      },
    })
  );
};

export const shareHadith = async (hadithId, token) =>
  handleJson(
    await fetch(`${API_BASE}/hadiths/${hadithId}/share-link`, {
      method: "POST",
      headers: {
        ...withAuth(token),
      },
    })
  );

export const toggleHadithFavorite = async (hadithId, token) =>
  handleJson(
    await fetch(`${API_BASE}/hadiths/${hadithId}/toggle-favorite`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...withAuth(token),
      },
    })
  );

/* ======================== QURAN ======================== */
export const fetchSurahs = async () =>
  handleJson(await fetch(`${API_BASE_URL}/quran/surahs`));

export const fetchQuranPage = async (page, token, params) => {
  const urlParams = new URLSearchParams(params || {}).toString();
  return handleJson(
    await fetch(`${API_BASE_URL}/quran/page/${page}?${urlParams}`, {
      headers: {
        "Content-Type": "application/json",
        ...withAuth(token),
      },
    })
  );
};

export const toggleQuranBookmark = async (ayahKey, token) =>
  handleJson(
    await fetch(`${API_BASE_URL}/quran/bookmark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...withAuth(token),
      },
      body: JSON.stringify({ ayah_key: ayahKey }),
    })
  );

/* ======================== PROFILE ======================== */
export const fetchProfileMe = async (token) =>
  handleJson(
    await fetch(`${API_BASE_URL}/prayers/users/me`, {
      headers: {
        ...withAuth(token),
      },
    })
  );

export const updateProfile = async (formData, token) =>
  handleJson(
    await fetch(`${API_BASE_URL}/auth/profile/update`, {
      method: "PUT",
      headers: {
        ...withAuth(token),
      },
      body: formData,
    })
  );

// Convenience: update only location (lat/lon and reverse fields if provided)
export const updateProfileLocation = async ({ latitude, longitude, city, state, country }, token) =>
  handleJson(
    await fetch(`${API_BASE_URL}/auth/profile/update`, {
      method: "PUT",
      headers: {
        ...withAuth(token),
      },
      body: (() => {
        const fd = new FormData();
        if (latitude !== undefined) fd.append("latitude", latitude);
        if (longitude !== undefined) fd.append("longitude", longitude);
        if (city !== undefined) fd.append("city", city);
        if (state !== undefined) fd.append("region", state);
        if (country !== undefined) fd.append("country", country);
        return fd;
      })(),
    })
  );

/* ======================== ACCOUNT ======================== */
export const updateAccount = async (payload, token) =>
  handleJson(
    await fetch(`${API_BASE_URL}/auth/account/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...withAuth(token),
      },
      body: JSON.stringify(payload),
    })
  );

export const logoutUser = async (token) =>
  handleJson(
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        ...withAuth(token),
      },
    })
  );

/* ======================== PRAYERS ======================== */
export const fetchPrayerTimes = async (lat, lon, token) =>
  handleJson(
    await fetch(`${API_BASE_URL}/prayers/times?lat=${lat}&lon=${lon}`, {
      headers: { ...withAuth(token) },
    })
  );

export const fetchReverseGeocode = async (lat, lon) =>
  handleJson(
    await fetch(`${API_BASE_URL}/prayers/reverse-geocode?lat=${lat}&lon=${lon}`)
  );

export const updateMuteStatus = async (muted, token) =>
  handleJson(
    await fetch(`${API_BASE_URL}/prayers/users/me/${muted ? "mute" : "unmute"}`, {
      method: "POST",
      headers: { ...withAuth(token) },
    })
  );

export const fetchAzanAudio = async () => {
  const res = await fetch(`${API_BASE_URL}/static/audio/azan1.mp3`);
  if (!res.ok) throw new Error("Failed to load Azan audio");
  return res.arrayBuffer();
};

/* ======================== QIBLA ======================== */
export const fetchQiblaDirection = async (latitude, longitude) =>
  handleJson(
    await fetch(`${API_BASE_URL}/qibla/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latitude, longitude }),
    })
  );

/* ======================== CALENDAR ======================== */
export const fetchTodayCalendar = async () =>
  handleJson(await fetch(`${API_BASE_URL}/calendar/today`));

export const fetchMonthCalendar = async (month, year) =>
  handleJson(
    await fetch(
      `${API_BASE_URL}/calendar/month?month=${month}&year=${year}`
    )
  );

/* ======================== ALLAH NAMES ======================== */
export const fetchAllahNames = async () =>
  handleJson(await fetch(`${API_BASE_URL}/names/`));

export const searchAllahNames = async (query) =>
  handleJson(
    await fetch(
      `${API_BASE_URL}/names/search/?q=${encodeURIComponent(query)}`
    )
  );

/* ======================== TEACHING ======================== */
export const fetchTeachingCategories = async () =>
  handleJson(await fetch(`${API_BASE}/teaching-categories`));

export const fetchLessons = async (category, level) => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (level) params.append("level", level);
  const qs = params.toString();
  return handleJson(
    await fetch(`${API_BASE}/lessons${qs ? `?${qs}` : ""}`)
  );
};

export const fetchStudyGuides = async (category, difficulty) => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (difficulty) params.append("difficulty", difficulty);
  const qs = params.toString();
  return handleJson(
    await fetch(`${API_BASE}/study-guides${qs ? `?${qs}` : ""}`)
  );
};

export const fetchTeachingResources = async (category, type) => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (type) params.append("type", type);
  const qs = params.toString();
  return handleJson(
    await fetch(`${API_BASE}/teaching-resources${qs ? `?${qs}` : ""}`)
  );
};
