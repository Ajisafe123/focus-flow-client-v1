import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Search,
  Star,
  Eye,
  Tag,
  BookOpen,
  MessageSquare,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import DuaModal from "./DuaModal";
import DeleteModal from "../DeleteModal";
import CreateCategoryModal from "../CreateCategoryModal";
import DuasList from "./DuasList";
import PageHeader from "../Components/PageHeader";
import ModalButton from "../Components/ModalButton";
import StatCardGrid from "../Components/StatCardGrid";
import CategoryDropdownCustom from "../Components/CategoryDropdownCustom";

import {
  fetchDuas,
  fetchCategories,
  fetchStats,
  bulkDeleteDuas,
  deleteDua,
  deleteCategory,
  toggleFeaturedStatus,
  updateDuaViewCount,
} from "../apiService";

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return String(num);
};

const DuasManagements = () => {
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

  // --- API Fetching Functions (now simplified to call service) ---

  const refreshDuas = useCallback(async (isMountedRef) => {
    try {
      const data = await fetchDuas();
      if (isMountedRef.current) setDuas(data || []);
    } catch (error) {
      console.error("Error fetching duas in component:", error);
    }
  }, []);

  const refreshCategories = useCallback(async (isMountedRef) => {
    try {
      const newCategories = await fetchCategories();
      if (isMountedRef.current) setCategories(newCategories);
    } catch (error) {
      console.error("Error fetching categories in component:", error);
    }
  }, []);

  const refreshStats = useCallback(async (isMountedRef) => {
    try {
      const data = await fetchStats();
      if (isMountedRef.current) setStatsData(data || {});
    } catch (error) {
      console.error("Error fetching stats in component:", error);
    }
  }, []);

  // --- useEffect for initial data load ---
  useEffect(() => {
    const isMounted = { current: true };
    refreshDuas(isMounted);
    refreshCategories(isMounted);
    refreshStats(isMounted);
    return () => {
      isMounted.current = false;
    };
  }, [refreshDuas, refreshCategories, refreshStats]);

  // --- Logic for closing dropdown on outside click ---
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
      await bulkDeleteDuas(idsArray);
      setDuas((prevDuas) => prevDuas.filter((d) => !selectedDuas.has(d.id)));
      setSelectedDuas(new Set());
      setShowDeleteModal(false);
      setIsBulkDelete(false);
      setDeleteTarget(null);
      setSelectMode(false);
      refreshStats({ current: true });
    } catch (error) {
      console.error("Error performing bulk delete in component:", error);
    }
  };

  const handleDeleteDua = async (duaId) => {
    if (!duaId) return;
    try {
      await deleteDua(duaId);
      setDuas((prevDuas) => prevDuas.filter((d) => d.id !== duaId));
      setShowDeleteModal(false);
      setDeleteTarget(null);
      refreshStats({ current: true });
    } catch (error) {
      console.error("Error deleting dua in component:", error);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteTarget || deleteTargetType !== "Category") return;
    const categoryId = deleteTarget.id;
    if (!categoryId) return;
    try {
      await deleteCategory(categoryId);

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

      refreshStats({ current: true });
    } catch (error) {
      console.error("Error deleting category in component:", error);
    }
  };

  const toggleFeatured = async (duaId, currentStatus) => {
    try {
      await toggleFeaturedStatus(duaId, currentStatus);
      setDuas((prevDuas) =>
        prevDuas.map((d) =>
          d.id === duaId ? { ...d, featured: !currentStatus } : d
        )
      );
      refreshStats({ current: true });
      setOpenDropdownId(null);
    } catch (error) {
      console.error("Error toggling featured status in component:", error);
    }
  };

  const updateDuaView = async (duaId) => {
    try {
      await updateDuaViewCount(duaId);
      setDuas((prevDuas) =>
        prevDuas.map((d) =>
          d.id === duaId ? { ...d, view_count: (d.view_count || 0) + 1 } : d
        )
      );
      refreshStats({ current: true });
    } catch (error) {
      console.error("Error updating view count in component:", error);
    }
  };

  const handleSaveOrUpdate = () => {
    setShowAddEditModal(false);
    refreshDuas({ current: true });
    refreshCategories({ current: true });
    refreshStats({ current: true });
  };

  const handleCategorySave = () => {
    setShowCreateCategoryModal(false);
    refreshCategories({ current: true });
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
    <div className="space-y-6 max-w-10xl mx-auto">
      <PageHeader
        title="Duas & Adhkar Management"
        subtitle="Manage Islamic supplications and remembrances with ease"
      >
        <ModalButton
          onClick={openAddModal}
          label="Add Dua"
          size="md"
        />
        <button
          onClick={() => setShowCreateCategoryModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-semibold text-sm"
        >
          <Tag className="w-4 h-4" />
          Add Category
        </button>
      </PageHeader>

      <StatCardGrid stats={stats} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Duas List</h3>
        
        <div className="flex flex-col gap-3 mb-6">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search duas..."
              className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <CategoryDropdownCustom
            categories={categories.filter((cat) => cat.id !== "all").map((cat) => ({
              id: cat.id,
              label: cat.label,
            }))}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            placeholder="Select Dua Category"
          />
        </div>

        {currentDuaList.length > 0 ? (
          <DuasList
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
        ) : (
          <div className="text-center py-12 px-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              No duas found
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Try adjusting your filters or create a new dua
            </p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
            >
              Create Dua
            </button>
          </div>
        )}
      </div>

      <DuaModal
        show={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        isEdit={isEdit}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveOrUpdate}
        categories={categories.filter((c) => c.id !== "all")}
      />
      <DeleteModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
          setIsBulkDelete(false);
        }}
        onDelete={
          deleteTargetType === "Category"
            ? handleDeleteCategory
            : isBulkDelete
              ? deleteSelectedDuas
              : () => handleDeleteDua(deleteTarget?.id)
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
        fetchCategories={() => refreshCategories({ current: true })}
        categoryType="dua"
      />
    </div>
  );
};

export default DuasManagements;
