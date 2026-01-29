import { useState, useEffect } from "react";
import { categoryAPI } from "../api/nodeApi";
import CategoryList from "../components/CategoryList";
import toast from "react-hot-toast";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  PlusIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter states
  const [colorFilter, setColorFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []); // Fetch only once on mount

  // Filter categories on the frontend
  const filteredCategories = categories.filter((category) => {
    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      const matchesSearch = 
        category.name?.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Color filter
    if (colorFilter && category.color !== colorFilter) {
      return false;
    }

    return true;
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setColorFilter("");
    setSearch("");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (colorFilter) count++;
    if (search) count++;
    return count;
  };

  const colorOptions = [
    { value: "", label: "All Colors" },
    { value: "#EF4444", label: "Red" },
    { value: "#3B82F6", label: "Blue" },
    { value: "#10B981", label: "Green" },
    { value: "#F59E0B", label: "Yellow" },
    { value: "#F97316", label: "Orange" },
    { value: "#8B5CF6", label: "Purple" },
    { value: "#EC4899", label: "Pink" },
    { value: "#14B8A6", label: "Teal" },
    { value: "#6B7280", label: "Gray" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Categories
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {filteredCategories.length} of {categories.length} categories
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              <PlusIcon className="h-5 w-5" />
              New Category
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Bar */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories by name or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Color Filter */}
              <div className="relative">
                <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={colorFilter}
                  onChange={(e) => setColorFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
                >
                  {colorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {getActiveFilterCount() > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/30 cursor-pointer"
                >
                  <XMarkIcon className="h-5 w-5" />
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category List */}
        <CategoryList
          categories={filteredCategories}
          refreshCategories={fetchCategories}
          showCreateModal={showCreateModal}
          onCloseCreateModal={() => setShowCreateModal(false)}
          emptyStateProps={{
            title: filteredCategories.length === 0 && (search || colorFilter) 
              ? "No categories match your filters" 
              : "No categories found",
            description: filteredCategories.length === 0 && (search || colorFilter)
              ? "Try adjusting your filters or create a new category"
              : "Create your first category to organize tasks efficiently",
            icon: "🏷️",
          }}
        />
      </div>
    </div>
  );
};

export default Category;