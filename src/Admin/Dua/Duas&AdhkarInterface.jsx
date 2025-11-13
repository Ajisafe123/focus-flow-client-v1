import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Search,
  Star,
  Heart,
  Eye,
  Tag,
  BookOpen,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
import DuaAdhkarModal from "./DuaAdhkarModal";
import DeleteConfirmModal from "../DeleteConfirmModal";
import CreateCategoryModal from "../CreateCategoryModal";
import DuasList from "./DuasList";

const API_BASE = "https://focus-flow-server-v1.onrender.com";

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return String(num);
};

const DuasAdhkarInterface = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({});
  const [duas, setDuas] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [categories, setCategories] = useState([]);
  const [statsData, setStatsData] = useState({});
  const [selectedDuas, setSelectedDuas] = useState(new Set());
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [deleteTargetType, setDeleteTargetType] = useState("Dua");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [currentDuaIndex, setCurrentDuaIndex] = useState(0);

  const handleError = async (res, defaultMsg) => {
    let errorMsg = defaultMsg;
    try {
      const errorData = await res.json();
      if (errorData.message) {
        errorMsg = errorData.message;
      } else if (errorData.detail) {
        errorMsg = errorData.detail;
      }
    } catch (e) {
      errorMsg = `${defaultMsg}: Could not parse error details.`;
    }
    console.error(`API Error (${res.status}):`, errorMsg);
  };

  const fetchDuas = useCallback(async (isMountedRef) => {
    try {
      const res = await fetch(`${API_BASE}/api/duas`);
      if (!res.ok) {
        await handleError(res, "Failed to fetch Duas.");
        return;
      }
      const data = await res.json();
      if (isMountedRef.current) setDuas(data || []);
    } catch (error) {
      console.error("Network Error fetching duas:", error);
    }
  }, []);

  const fetchCategories = useCallback(async (isMountedRef) => {
    try {
      const res = await fetch(`${API_BASE}/api/dua-categories`);
      if (!res.ok) {
        await handleError(res, "Failed to fetch Dua Categories.");
        return;
      }
      const data = await res.json();
      const newCategories = [
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
      if (isMountedRef.current) setCategories(newCategories);
    } catch (error) {
      console.error("Network Error fetching categories:", error);
    }
  }, []);

  const fetchStats = useCallback(async (isMountedRef) => {
    try {
      const res = await fetch(`${API_BASE}/api/duas/stats`);
      if (!res.ok) {
        await handleError(res, "Failed to fetch Stats.");
        return;
      }
      const data = await res.json();
      if (isMountedRef.current) setStatsData(data || {});
    } catch (error) {
      console.error("Network Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    const isMounted = { current: true };
    fetchDuas(isMounted);
    fetchCategories(isMounted);
    fetchStats(isMounted);
    return () => {
      isMounted.current = false;
    };
  }, [fetchDuas, fetchCategories, fetchStats]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".dropdown-menu") &&
        !e.target.closest(".dropdown-trigger")
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleSelectDua = (duaId) => {
    setSelectedDuas((prevSelected) => {
      const newSet = new Set(prevSelected);
      if (newSet.has(duaId)) newSet.delete(duaId);
      else newSet.add(duaId);
      return newSet;
    });
  };

  const deleteSelectedDuas = async () => {
    const idsArray = Array.from(selectedDuas);
    if (idsArray.length === 0) {
      setShowDeleteModal(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/duas/bulk`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(idsArray),
      });
      if (!res.ok) {
        await handleError(res, "Failed to bulk delete Duas.");
        return;
      }
      setDuas((prevDuas) => prevDuas.filter((d) => !selectedDuas.has(d.id)));
      setSelectedDuas(new Set());
      setShowDeleteModal(false);
      setIsBulkDelete(false);
      setDeleteTarget(null);
      setSelectMode(false);
      fetchStats({ current: true });
    } catch (error) {
      console.error("Network Error performing bulk delete:", error);
    }
  };

  const deleteDua = async (duaId) => {
    if (!duaId) return;
    try {
      const res = await fetch(`${API_BASE}/api/duas/${duaId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        await handleError(res, "Failed to delete Dua.");
        return;
      }
      setDuas((prevDuas) => prevDuas.filter((d) => d.id !== duaId));
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchStats({ current: true });
    } catch (error) {
      console.error("Network Error deleting dua:", error);
    }
  };

  const deleteCategory = async () => {
    if (!deleteTarget || deleteTargetType !== "Category") return;
    const categoryId = deleteTarget.id;
    if (!categoryId) return;
    try {
      const res = await fetch(`${API_BASE}/api/dua-categories/${categoryId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        await handleError(res, "Failed to delete category.");
        return;
      }

      setCategories((prev) =>
        prev.filter((c) => String(c.id) !== String(categoryId))
      );
      setDuas((prevDuas) =>
        prevDuas.filter((dua) => String(dua.category_id) !== String(categoryId))
      );
      if (selectedCategory === String(categoryId)) setSelectedCategory("all");

      setShowDeleteModal(false);
      setDeleteTarget(null);
      setDeleteTargetType("Dua");

      fetchStats({ current: true });
    } catch (error) {
      console.error("Network Error deleting category:", error);
    }
  };

  const toggleFeatured = async (duaId, currentStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/duas/${duaId}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentStatus }),
      });
      if (!res.ok) {
        await handleError(res, "Failed to toggle featured status.");
        return;
      }
      setDuas((prevDuas) =>
        prevDuas.map((d) =>
          d.id === duaId ? { ...d, featured: !currentStatus } : d
        )
      );
      fetchStats({ current: true });
      setOpenDropdownId(null);
    } catch (error) {
      console.error("Network Error toggling featured status:", error);
    }
  };

  const updateDuaView = async (duaId) => {
    try {
      const res = await fetch(`${API_BASE}/api/duas/${duaId}/increment-view`, {
        method: "PATCH",
      });
      if (!res.ok) {
        await handleError(res, "Failed to update view count.");
        return;
      }
      setDuas((prevDuas) =>
        prevDuas.map((d) =>
          d.id === duaId ? { ...d, view_count: (d.view_count || 0) + 1 } : d
        )
      );
      fetchStats({ current: true });
    } catch (error) {
      console.error("Network Error updating view count:", error);
    }
  };

  const handleSaveOrUpdate = () => {
    setShowAddEditModal(false);
    fetchDuas({ current: true });
    fetchCategories({ current: true });
    fetchStats({ current: true });
  };

  const handleCategorySave = () => {
    setShowCreateCategoryModal(false);
    fetchCategories({ current: true });
  };

  const openAddModal = () => {
    setIsEdit(false);
    setFormData(() => {
      const defaultCategory = categories.find((c) => c.id !== "all")?.id || "";
      return {
        title: "",
        arabic: "",
        translitration: "",
        translation: "",
        notes: "",
        benefits: "",
        source: "",
        category: defaultCategory,
        featured: false,
      };
    });
    setShowAddEditModal(true);
  };

  const openEditModal = (dua) => {
    setIsEdit(true);
    setFormData({
      ...dua,
      category: String(
        dua.category_id ||
          dua.category ||
          categories.find((c) => c.id !== "all")?.id ||
          ""
      ),
      translitration: dua.translitration || "",
    });
    setShowAddEditModal(true);
    setOpenDropdownId(null);
  };

  const confirmDelete = (target, type = "Dua") => {
    if (type === "Dua" && target) {
      setDeleteTarget(target);
      setIsBulkDelete(false);
      setDeleteTargetType("Dua");
      setShowDeleteModal(true);
    } else if (type === "Category") {
      const categoryDuas = duas.filter(
        (d) => String(d.category_id) === String(target.id)
      );
      setDeleteTarget({
        id: target.id,
        title: target.label,
        duaCount: categoryDuas.length,
      });
      setIsBulkDelete(false);
      setDeleteTargetType("Category");
      setShowDeleteModal(true);
    } else if (selectedDuas.size > 0 && type === "BulkDua") {
      setIsBulkDelete(true);
      setDeleteTarget({ title: `${selectedDuas.size} selected Duas` });
      setDeleteTargetType("Dua");
      setShowDeleteModal(true);
    }
    setOpenDropdownId(null);
  };

  const getCategoryName = (categoryId) =>
    categories.find((cat) => String(cat.id) === String(categoryId))?.label ||
    "Uncategorized";

  const currentDuaList = useMemo(() => {
    return duas.filter((dua) => {
      const duaCategoryId = String(dua.category_id || dua.category || "");
      const matchesCategory =
        selectedCategory === "all" || duaCategoryId === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        (dua.title &&
          dua.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (dua.translation &&
          dua.translation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (dua.arabic && dua.arabic.includes(searchQuery)) ||
        (dua.transliteration &&
          dua.transliteration
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [duas, selectedCategory, searchQuery]);

  const currentDua = currentDuaList[currentDuaIndex];

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentDuaIndex(0);
  };

  const goToNextDua = () => {
    setCurrentDuaIndex((prevIndex) => (prevIndex + 1) % currentDuaList.length);
  };

  const goToPrevDua = () => {
    setCurrentDuaIndex(
      (prevIndex) =>
        (prevIndex - 1 + currentDuaList.length) % currentDuaList.length
    );
  };

  useEffect(() => {
    if (currentDuaList.length > 0 && currentDuaIndex >= currentDuaList.length) {
      setCurrentDuaIndex(0);
    } else if (currentDuaList.length === 0) {
      setCurrentDuaIndex(0);
    }
  }, [currentDuaList, currentDuaIndex]);

  const selectAllDuas = () => {
    if (selectedDuas.size === currentDuaList.length) {
      setSelectedDuas(new Set());
    } else {
      setSelectedDuas(new Set(currentDuaList.map((d) => d.id)));
    }
  };

  const totalCategories = categories.length > 0 ? categories.length - 1 : 0;

  const combinedViewsAndLikes =
    (statsData.total_views || 0) + (statsData.total_favorites || 0);
  const totalViewsDisplay = formatNumber(combinedViewsAndLikes);

  const stats = [
    {
      icon: BookOpen,
      title: "Total Duas",
      value: (statsData.total_duas || duas.length).toLocaleString(),
      color: "emerald",
    },
    {
      icon: Star,
      title: "Featured",
      value: (
        statsData.top_featured?.length || duas.filter((d) => d.featured).length
      ).toLocaleString(),
      color: "emerald",
    },
    {
      icon: Eye,
      title: "Total Views & Likes",
      value: totalViewsDisplay,
      color: "emerald",
    },
    {
      icon: Tag,
      title: "Categories",
      value: totalCategories.toLocaleString(),
      color: "emerald",
    },
  ];

  return (
    <div className="min-h-screen space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <BookOpen className="w-7 h-7 sm:w-9 sm:h-9" />
              Duas & Adhkar Management
            </h1>
            <p className="text-emerald-50 text-sm sm:text-base md:text-lg">
              Manage Islamic supplications and remembrances with ease
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
            Add New Dua
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm p-4 sm:p-5 hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              <h3 className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">
                {stat.title}
              </h3>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Dua List and Filters
            </h3>

            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative flex-1 min-w-[150px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search duas..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white flex-shrink-0"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label} (
                    {cat.id === "all"
                      ? duas.length
                      : duas.filter(
                          (d) => String(d.category_id) === String(cat.id)
                        ).length}
                    )
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowCreateCategoryModal(true)}
                className="px-3 py-2 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-all font-medium text-sm flex items-center justify-center gap-1 flex-shrink-0"
              >
                <Tag className="w-4 h-4" />
                Add Category
              </button>
            </div>

            {(currentDuaList.length > 0 || selectedDuas.size > 0) && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 mt-4">
                <button
                  onClick={() => {
                    setSelectMode(!selectMode);
                    if (selectMode) setSelectedDuas(new Set());
                  }}
                  className={`px-3 py-2 rounded-lg transition-all font-medium text-sm flex items-center justify-center gap-1 ${
                    selectMode
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {selectMode ? "Cancel Select" : "Toggle Select Mode"}
                </button>

                {selectMode && (
                  <button
                    onClick={selectAllDuas}
                    className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-medium text-sm"
                  >
                    {selectedDuas.size === currentDuaList.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                )}

                {selectedDuas.size > 0 && (
                  <button
                    onClick={() => confirmDelete(null, "BulkDua")}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium text-sm flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Delete ({selectedDuas.size})
                  </button>
                )}
              </div>
            )}
          </div>

          <DuasList
            API_BASE={API_BASE}
            currentDua={currentDua}
            currentDuaListLength={currentDuaList.length}
            currentDuaIndex={currentDuaIndex}
            goToNextDua={goToNextDua}
            goToPrevDua={goToPrevDua}
            selectedCategoryName={getCategoryName(selectedCategory)}
            selectMode={selectMode}
            selectedDuas={selectedDuas}
            toggleSelectDua={toggleSelectDua}
            openEditModal={openEditModal}
            toggleFeatured={toggleFeatured}
            confirmDelete={confirmDelete}
            getCategoryName={getCategoryName}
            openDropdownId={openDropdownId}
            setOpenDropdownId={setOpenDropdownId}
            updateDuaView={updateDuaView}
          />
        </div>

        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-5">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={openAddModal}
              className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-md transition-all duration-200 group"
            >
              <div className="p-1.5 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">Add New Dua</span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => setSelectedCategory("all")}
              className="w-full flex items-center gap-3 p-3.5 border-2 border-emerald-100 bg-emerald-50 text-emerald-700 rounded-lg hover:border-emerald-200 hover:bg-emerald-100 transition-all duration-200 group"
            >
              <div className="p-1.5 bg-emerald-100 rounded-md group-hover:bg-emerald-200 transition-colors">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">
                View All Duas ({duas.length})
              </span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => setShowCreateCategoryModal(true)}
              className="w-full flex items-center gap-3 p-3.5 border-2 border-emerald-100 bg-emerald-50 text-emerald-700 rounded-lg hover:border-emerald-200 hover:bg-emerald-100 transition-all duration-200 group"
            >
              <div className="p-1.5 bg-emerald-100 rounded-md group-hover:bg-emerald-200 transition-colors">
                <Tag className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">
                Create New Category ({totalCategories})
              </span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>

      <DuaAdhkarModal
        show={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveOrUpdate}
        categories={categories.filter((c) => c.id !== "all")}
      />
      <DeleteConfirmModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
          setIsBulkDelete(false);
        }}
        onDelete={
          deleteTargetType === "Category"
            ? deleteCategory
            : isBulkDelete
            ? deleteSelectedDuas
            : () => deleteDua(deleteTarget?.id)
        }
        itemTitle={deleteTarget?.title || ""}
        itemType={deleteTargetType}
        warningText={
          deleteTargetType === "Category" && deleteTarget?.duaCount > 0
            ? `This will also delete ${deleteTarget.duaCount} duas in this category.`
            : null
        }
      />
      <CreateCategoryModal
        show={showCreateCategoryModal}
        onClose={() => setShowCreateCategoryModal(false)}
        onSave={handleCategorySave}
        categories={categories.filter((c) => c.id !== "all")}
        fetchCategories={() => fetchCategories({ current: true })}
        categoryType="dua"
      />
    </div>
  );
};

export default DuasAdhkarInterface;