// HadithManagements.js
import React, { useState, useCallback, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  XCircle,
  ArrowUpRight,
  Tag,
  ThumbsUp,
  Award,
  MoreVertical,
  Heart,
} from "lucide-react";
import LoadingSpinner from "../../Components/Common/LoadingSpinner";
import HadithModal from "./HadithModal";
import CreateCategoryModal from "../CreateCategoryModal";
import DeleteModal from "../DeleteModal";
import PageHeader from "../Components/PageHeader";
import ModalButton from "../Components/ModalButton";
import CategoryDropdownCustom from "../Components/CategoryDropdownCustom";
import StatCardGrid from "../Components/StatCardGrid";
import {
  fetchHadithCategories as apiFetchCategories,
  fetchHadithStats as apiFetchHadithStats,
  fetchPaginatedHadiths as apiFetchHadiths,
  toggleHadithFeaturedStatus as apiToggleFeaturedStatus,
  deleteHadith as apiDeleteHadith,
  API_BASE,
  DEFAULT_LIMIT,
} from "../apiService";
const statIconMap = {
  "Total Hadiths": BookOpen,
  "Views & Favorites": ThumbsUp,
  "Featured Hadiths": Award,
  "Total Categories": Tag,
};

const DropdownMenu = ({ children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = React.useRef(null);
  const menuRef = React.useRef(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        onClick={toggleOpen}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
        title="More actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 z-20 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="py-1" role="none">
            {React.Children.map(children, (child) =>
              React.cloneElement(child, {
                onClick: (e) => {
                  setIsOpen(false);
                  if (child.props.onClick) child.props.onClick(e);
                },
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const HadithManagements = () => {
  const [hadiths, setHadiths] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentHadithData, setCurrentHadithData] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchAllCategoriesAndStats = useCallback(async () => {
    try {
      const baseCategories = await apiFetchCategories();

      const filterCategories = [
        { id: "all", label: "All Categories" },
        ...baseCategories,
      ];
      setCategories(filterCategories);

      const dashboardStats = await apiFetchHadithStats(filterCategories);
      setStats(dashboardStats);
    } catch (err) {
      console.error("Data fetch error:", err.message);
    }
  }, []);

  const fetchHadiths = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { items, total_count, total_pages } = await apiFetchHadiths(
        currentPage,
        searchQuery,
        selectedCategory
      );

      setTotalItems(total_count);
      setTotalPages(total_pages);
      setHadiths(items);
    } catch (err) {
      console.error("Hadiths fetch error:", err.message);
      setError(err.message);
      setHadiths([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory]);

  const toggleFeatured = async (hadithId) => {
    setIsLoading(true);
    try {
      const updatedHadith = await apiToggleFeaturedStatus(hadithId);

      setHadiths((prevHadiths) =>
        prevHadiths.map((h) =>
          h.id === hadithId ? { ...h, featured: updatedHadith.featured } : h
        )
      );

      fetchAllCategoriesAndStats();
    } catch (err) {
      console.error("Toggle feature error:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const executeDeleteHadith = async () => {
    if (!deleteTargetId) return;

    const id = deleteTargetId;
    setShowDeleteConfirm(false);
    setIsLoading(true);

    try {
      await apiDeleteHadith(id);

      setDeleteTargetId(null);
      fetchHadiths();
      fetchAllCategoriesAndStats();
    } catch (err) {
      console.error("Error deleting Hadith:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCategoriesAndStats();
  }, [fetchAllCategoriesAndStats]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchHadiths();
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    fetchHadiths();
  }, [currentPage]);

  const handleOpenAddModal = () => {
    setIsEdit(false);
    setCurrentHadithData(null);
    setShowModal(true);
  };

  const handleOpenEditModal = useCallback((hadith) => {
    setIsEdit(true);
    setCurrentHadithData({
      ...hadith,
      category: String(hadith.category_id),
    });
    setShowModal(true);
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setCurrentHadithData(null);
  };

  const handleSaveModal = () => {
    fetchHadiths();
    fetchAllCategoriesAndStats();
    handleCloseModal();
  };

  const handleCategorySave = () => {
    fetchAllCategoriesAndStats();
  };

  const confirmDeleteHadith = (id) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const categoryOptions = categories.filter((c) => c.id !== "all");
  const selectedCategoryName =
    categories.find((c) => c.id === selectedCategory)?.label ||
    "All Categories";

  const totalCategories = categoryOptions.length;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <LoadingSpinner message="Loading hadiths..." />
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-12 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-600">{error}. Please check the API status.</p>
        </div>
      );
    }

    if (hadiths.length === 0) {
      return (
        <div className="p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hadiths found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-10xl mx-auto divide-y divide-gray-100 bg-white">
        {hadiths.map((hadith) => (
          <div key={hadith.id} className="transition-all duration-200 group">
            <div className="pt-4 pb-3 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="p-3">
                        <p className="text-lg sm:text-xl text-right font-arabic text-gray-900 leading-relaxed">
                          {hadith.arabic}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu className="flex-shrink-0 mt-[-8px]">
                      <button
                        onClick={() => toggleFeatured(hadith.id)}
                        className={`w-full text-left flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                          hadith.featured
                            ? "text-yellow-700 bg-yellow-50"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        role="menuitem"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            hadith.featured ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                        {hadith.featured ? "Unfeature" : "Feature"}
                      </button>
                      <button
                        onClick={() =>
                          console.log("View details for", hadith.id)
                        }
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        role="menuitem"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(hadith)}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        role="menuitem"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDeleteHadith(hadith.id)}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        role="menuitem"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </DropdownMenu>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm sm:text-base text-gray-900 font-medium my-3 leading-relaxed">
                      "{hadith.translation}"
                    </p>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                        {hadith.source || hadith.book} #
                        {hadith.reference || hadith.number}
                      </span>
                      <span className="flex items-center gap-1">
                        Narrated by: <strong>{hadith.narrator}</strong>
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                        {categories.find(
                          (c) => c.id === String(hadith.category_id)
                        )?.label || "Uncategorized"}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        {hadith.view_count?.toLocaleString() || 0}
                      </span>
                      <span className="flex items-center gap-1 text-red-600 font-semibold">
                        <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-red-400 text-red-400" />
                        {hadith.favorite_count?.toLocaleString() || 0}
                      </span>
                    </div>

                    <div className="mb-0 mt-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                          hadith.featured
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        <Award className="w-3 h-3" />
                        {hadith.featured ? "Featured" : "Standard"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block flex-shrink-0 w-28"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const currentHadithCountStart = (currentPage - 1) * DEFAULT_LIMIT + 1;
  const currentHadithCountEnd = Math.min(
    currentPage * DEFAULT_LIMIT,
    totalItems
  );

  return (
    <div className="space-y-6 max-w-10xl mx-auto">
      <PageHeader
        title="Hadith Management"
        subtitle="Manage and organize authentic Prophetic traditions"
      >
        <ModalButton
          onClick={handleOpenAddModal}
          label="Add Hadith"
          size="md"
        />
        <button
          onClick={() => setShowCategoryModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-semibold text-sm"
        >
          <Tag className="w-4 h-4" />
          Add Category
        </button>
      </PageHeader>

      <StatCardGrid
        stats={stats.map((stat) => ({
          ...stat,
          icon: statIconMap[stat.title] || BookOpen,
        }))}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Hadith List</h3>
        
        <div className="flex flex-col gap-3 mb-6">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search hadiths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <CategoryDropdownCustom
            categories={categoryOptions.filter((cat) => cat.id !== "all").map((cat) => ({
              id: cat.id,
              label: cat.label,
            }))}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            placeholder="Select Hadith Category"
          />
        </div>

        {hadiths.length > 0 ? (
          <div className="bg-transparent rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-gray-100 bg-white">
              <h3 className="text-lg font-bold text-gray-900">
                All Hadiths ({totalItems?.toLocaleString() || "..."})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Browse and manage your hadith collection
              </p>
            </div>

            {renderContent()}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              No hadiths found
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Try adjusting your filters or create a new hadith
            </p>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
            >
              Create Hadith
            </button>
          </div>
        )}
      </div>

      {totalPages > 1 && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing **{currentHadithCountStart}-{currentHadithCountEnd}** of
              **{totalItems.toLocaleString()}** hadiths
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                        pageNumber === currentPage
                          ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span key={pageNumber} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      <HadithModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        title={isEdit ? "Edit Hadith" : "Add New Hadith"}
        isEdit={isEdit}
        categories={categories}
        formData={currentHadithData}
        API_BASE={API_BASE}
        fetchCategories={fetchAllCategoriesAndStats}
      />
      <CreateCategoryModal
        show={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleCategorySave}
        categories={categoryOptions}
        fetchCategories={fetchAllCategoriesAndStats}
        categoryType="hadith"
      />
      <DeleteModal
        show={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteTargetId(null);
        }}
        onDelete={executeDeleteHadith}
        itemType={"Hadith"}
        itemTitle={
          hadiths.find((h) => h.id === deleteTargetId)?.reference ||
          "this Hadith"
        }
      />
    </div>
  );
};

export default HadithManagements;
