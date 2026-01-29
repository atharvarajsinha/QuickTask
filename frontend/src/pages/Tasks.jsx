import { useState, useEffect } from "react";
import { taskAPI, categoryAPI } from "../api/nodeApi";
import { useAuth } from "../context/AuthContext";
import TaskList from "../components/TaskList";
import toast from "react-hot-toast";
import {
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  ChevronDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ListBulletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();

  // Advanced filter state
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    categories: "",
    dueDateFilter: "",
    dueFrom: "",
    dueTo: "",
    dueBefore: "",
    dueAfter: "",
    overdue: false,
    sortBy: "createdAt",
    order: "desc",
    search: "",
    uncategorized: false,
  });

  useEffect(() => {
    fetchCategories();
    fetchTasks();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      // BASIC FILTERS
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.search) params.append("search", filters.search);

      // CATEGORY FILTERS
      if (filters.uncategorized) {
        params.append("uncategorized", "true");
      } else if (filters.category) {
        if (filters.category === "null") {
          params.append("category", "null");
        } else {
          params.append("category", filters.category);
        }
      }

      // MULTIPLE CATEGORIES
      if (filters.categories && !filters.uncategorized) {
        params.append("categories", filters.categories);
      }

      // DATE FILTERS
      if (filters.dueDateFilter === "dueFromTo") {
        if (filters.dueFrom) params.append("dueFrom", filters.dueFrom);
        if (filters.dueTo) params.append("dueTo", filters.dueTo);
      }

      if (filters.dueDateFilter === "dueBefore" && filters.dueBefore) {
        params.append("dueBefore", filters.dueBefore);
      }

      if (filters.dueDateFilter === "dueAfter" && filters.dueAfter) {
        params.append("dueAfter", filters.dueAfter);
      }

      // OVERDUE
      if (filters.overdue) {
        params.append("overdue", "true");
      }

      // SORTING
      if (filters.sortBy) {
        params.append("sortBy", filters.sortBy);
        params.append("order", filters.order || "desc");
      }

      const queryString = params.toString();
      const response = await taskAPI.getAllTasks(queryString);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await taskAPI.exportTasksCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tasks.csv");
      document.body.appendChild(link);
      link.click();
      toast.success("Tasks exported successfully");
    } catch (error) {
      toast.error("Failed to export tasks");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Clear related date fields when changing date filter type
    if (key === "dueDateFilter") {
      setFilters((prev) => ({
        ...prev,
        dueFrom: "",
        dueTo: "",
        dueBefore: "",
        dueAfter: "",
      }));
    }

    // Handle category filter conflicts
    if (key === "category" && value) {
      setFilters((prev) => ({
        ...prev,
        categories: "",
        uncategorized: false,
      }));
    }

    if (key === "categories" && value) {
      setFilters((prev) => ({
        ...prev,
        category: "",
        uncategorized: false,
      }));
    }

    if (key === "uncategorized") {
      setFilters((prev) => ({
        ...prev,
        category: "",
        categories: "",
      }));
    }

    if (key === "overdue" && value) {
      setFilters((prev) => ({
        ...prev,
        dueDateFilter: "",
        dueFrom: "",
        dueTo: "",
        dueBefore: "",
        dueAfter: "",
      }));
    }
  };

  const handleSearchChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      priority: "",
      category: "",
      categories: "",
      dueDateFilter: "",
      dueFrom: "",
      dueTo: "",
      dueBefore: "",
      dueAfter: "",
      overdue: false,
      sortBy: "createdAt",
      order: "desc",
      search: "",
      uncategorized: false,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status) count++;
    if (filters.priority) count++;
    if (filters.category || filters.categories || filters.uncategorized) count++;
    if (filters.search) count++;
    if (filters.dueDateFilter) count++;
    if (filters.overdue) count++;
    return count;
  };

  const getDateFilterLabel = () => {
    switch (filters.dueDateFilter) {
      case "dueFromTo":
        return "Date Range";
      case "dueBefore":
        return "Before Date";
      case "dueAfter":
        return "After Date";
      default:
        return "Select Date Filter";
    }
  };

  // Get selected category names for display
  const getSelectedCategoryNames = () => {
    if (filters.uncategorized) return ["Uncategorized"];
    if (filters.category === "null") return ["Uncategorized"];
    if (filters.category && filters.category !== "null") {
      const category = categories.find(c => c._id === filters.category);
      return category ? [category.name] : [];
    }
    if (filters.categories) {
      const categoryIds = filters.categories.split(",");
      return categories
        .filter(c => categoryIds.includes(c._id))
        .map(c => c.name);
    }
    return [];
  };

  // Get category color by ID
  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    return category ? category.color : "#6b7280";
  };

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
              My Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage all your tasks in one place
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              <PlusIcon className="h-5 w-5" />
              New Task
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Status Filters */}
              {["", "Todo", "In Progress", "Completed"].map((status) => (
                <button
                  key={status || "all"}
                  onClick={() => handleFilterChange("status", status)}
                  className={`px-4 py-2 rounded-lg capitalize flex items-center gap-2 ${
                    filters.status === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                  }`}
                >
                  {status === "Todo" && <ClockIcon className="h-4 w-4" />}
                  {status === "In Progress" && (
                    <ArrowPathIcon className="h-4 w-4" />
                  )}
                  {status === "Completed" && (
                    <CheckCircleIcon className="h-4 w-4" />
                  )}
                  {status === "" && <ListBulletIcon className="h-4 w-4" />}
                  {status || "All"}
                </button>
              ))}

              {/* Category Quick Filters */}
              <div className="relative group">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                >
                  <TagIcon className="h-5 w-5" />
                  {getSelectedCategoryNames().length > 0
                    ? `${getSelectedCategoryNames().length} Category${getSelectedCategoryNames().length > 1 ? 's' : ''}`
                    : "Categories"}
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                
                {/* Category Dropdown */}
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 hidden group-hover:block">
                  <div className="p-3">
                    <div className="space-y-2">
                      <button
                        onClick={() => handleFilterChange("uncategorized", !filters.uncategorized)}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                          filters.uncategorized
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="w-3 h-3 rounded-full border border-gray-400 dark:border-gray-600"></div>
                        Uncategorized Tasks
                      </button>
                      
                      {categories.map((category) => (
                        <button
                          key={category._id}
                          onClick={() => handleFilterChange("category", category._id)}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                            filters.category === category._id
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
              >
                <FunnelIcon className="h-5 w-5" />
                Advanced Filters
                {getActiveFilterCount() > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${showAdvancedFilters ? "rotate-180" : ""}`}
                />
              </button>

              {getActiveFilterCount() > 0 && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/30 cursor-pointer"
                >
                  <XMarkIcon className="h-5 w-5" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Selected Category Badges */}
            {getSelectedCategoryNames().length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {getSelectedCategoryNames().map((name, index) => {
                  const isUncategorized = name === "Uncategorized";
                  const category = categories.find(c => c.name === name);
                  const categoryColor = isUncategorized ? "#6b7280" : (category?.color || "#6b7280");
                  
                  return (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: `${categoryColor}20`,
                        color: categoryColor,
                        border: `1px solid ${categoryColor}40`,
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: categoryColor }}
                      />
                      {name}
                      <button
                        onClick={() => {
                          if (isUncategorized) {
                            handleFilterChange("uncategorized", false);
                          } else if (filters.category) {
                            handleFilterChange("category", "");
                          } else if (filters.categories) {
                            const categoryId = category?._id;
                            if (categoryId) {
                              const newCategories = filters.categories
                                .split(",")
                                .filter(id => id !== categoryId)
                                .join(",");
                              handleFilterChange("categories", newCategories || "");
                            }
                          }
                        }}
                        className="ml-1 hover:opacity-70 cursor-pointer"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Priority Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={filters.priority}
                      onChange={(e) =>
                        handleFilterChange("priority", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Priorities</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  {/* Single Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        handleFilterChange("category", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Categories</option>
                      <option value="null">Uncategorized</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Multiple Categories Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Multiple Categories (comma-separated IDs)
                    </label>
                    <input
                      type="text"
                      value={filters.categories}
                      onChange={(e) =>
                        handleFilterChange("categories", e.target.value)
                      }
                      placeholder="e.g., id1,id2,id3"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {/* Date Filter Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Filter Type
                    </label>
                    <select
                      value={filters.dueDateFilter}
                      onChange={(e) =>
                        handleFilterChange("dueDateFilter", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">No Date Filter</option>
                      <option value="dueFromTo">Due From/To</option>
                      <option value="dueBefore">Before Date</option>
                      <option value="dueAfter">After Date</option>
                    </select>
                  </div>

                  {/* Overdue Filter */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="overdue"
                      checked={filters.overdue}
                      onChange={(e) =>
                        handleFilterChange("overdue", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="overdue"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Show Overdue Only
                    </label>
                  </div>

                  {/* Uncategorized Filter */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="uncategorized"
                      checked={filters.uncategorized}
                      onChange={(e) =>
                        handleFilterChange("uncategorized", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="uncategorized"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Uncategorized Only
                    </label>
                  </div>
                </div>

                {/* Conditional Date Filters */}
                {filters.dueDateFilter === "dueFromTo" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          Due From
                        </div>
                      </label>
                      <input
                        type="date"
                        value={filters.dueFrom}
                        onChange={(e) =>
                          handleFilterChange("dueFrom", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          Due To
                        </div>
                      </label>
                      <input
                        type="date"
                        value={filters.dueTo}
                        onChange={(e) =>
                          handleFilterChange("dueTo", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {filters.dueDateFilter === "dueBefore" && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Due Before
                      </label>
                      <input
                        type="date"
                        value={filters.dueBefore}
                        onChange={(e) =>
                          handleFilterChange("dueBefore", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {filters.dueDateFilter === "dueAfter" && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Due After
                      </label>
                      <input
                        type="date"
                        value={filters.dueAfter}
                        onChange={(e) =>
                          handleFilterChange("dueAfter", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Sorting Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange("sortBy", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="createdAt">Created Date</option>
                      <option value="dueDate">Due Date</option>
                      <option value="title">Title</option>
                      <option value="priority">Priority</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Order
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFilterChange("order", "asc")}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${
                          filters.order === "asc"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        <ArrowUpIcon className="h-4 w-4" />
                        Ascending
                      </button>
                      <button
                        onClick={() => handleFilterChange("order", "desc")}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${
                          filters.order === "desc"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        <ArrowDownIcon className="h-4 w-4" />
                        Descending
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Tasks
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {tasks.length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Todo</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
              {tasks.filter((t) => t.status === "Todo").length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              In Progress
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
              {tasks.filter((t) => t.status === "In Progress").length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Completed
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-500">
              {tasks.filter((t) => t.status === "Completed").length}
            </div>
          </div>
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          refreshTasks={fetchTasks}
          showCreateModal={showCreateModal}
          onCloseCreateModal={() => setShowCreateModal(false)}
          emptyStateProps={{
            title: "No tasks found",
            description:
              "Try adjusting your filters or create a new task to get started",
            icon: "📝",
          }}
        />
      </div>
    </div>
  );
};

export default Tasks;