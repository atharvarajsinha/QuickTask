import { useState, useEffect } from "react";
import { categoryAPI } from "../api/nodeApi";
import toast from "react-hot-toast";
import {
  PencilIcon,
  TrashIcon,
  TagIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ChartBarIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

// NewCategoryForm component
const NewCategoryForm = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#6B7280",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorOptions = [
    { value: "#EF4444", label: "Red", bgColor: "bg-red-500" },
    { value: "#3B82F6", label: "Blue", bgColor: "bg-blue-500" },
    { value: "#10B981", label: "Green", bgColor: "bg-green-500" },
    { value: "#F59E0B", label: "Yellow", bgColor: "bg-yellow-500" },
    { value: "#F97316", label: "Orange", bgColor: "bg-orange-500" },
    { value: "#8B5CF6", label: "Purple", bgColor: "bg-purple-500" },
    { value: "#EC4899", label: "Pink", bgColor: "bg-pink-500" },
    { value: "#14B8A6", label: "Teal", bgColor: "bg-teal-500" },
    { value: "#6B7280", label: "Gray", bgColor: "bg-gray-500" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await categoryAPI.createCategory(formData);
      toast.success("Category created successfully!");
      onCreated();
      onClose();
      setFormData({
        name: "",
        description: "",
        color: "#6B7280",
      });
    } catch (error) {
      toast.error("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-linear-to-b from-emerald-500 to-green-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create New Category
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <TagIcon className="w-4 h-4" />
            Category Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
            placeholder="Enter category name"
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <InformationCircleIcon className="w-4 h-4" />
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 resize-none min-h-25"
            rows="3"
            placeholder="Add description (optional)"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: formData.color }} />
            Color
          </label>
          <div className="grid grid-cols-4 md:grid-cols-9 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData({ ...formData, color: color.value })}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                  formData.color === color.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                title={color.label}
              >
                <div
                  className={`w-8 h-8 rounded-full ${color.bgColor} border-2 ${
                    formData.color === color.value ? "border-white shadow-lg" : "border-transparent"
                  }`}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">{color.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl border border-gray-300 dark:border-gray-600 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-linear-to-r from-emerald-600 to-green-600 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none cursor-pointer"
          >
            {isSubmitting ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

const CategoryItem = ({ category, refreshCategories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...category });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  const colorOptions = [
    { value: "#EF4444", label: "Red", bgColor: "bg-red-500" },
    { value: "#3B82F6", label: "Blue", bgColor: "bg-blue-500" },
    { value: "#10B981", label: "Green", bgColor: "bg-green-500" },
    { value: "#F59E0B", label: "Yellow", bgColor: "bg-yellow-500" },
    { value: "#F97316", label: "Orange", bgColor: "bg-orange-500" },
    { value: "#8B5CF6", label: "Purple", bgColor: "bg-purple-500" },
    { value: "#EC4899", label: "Pink", bgColor: "bg-pink-500" },
    { value: "#14B8A6", label: "Teal", bgColor: "bg-teal-500" },
    { value: "#6B7280", label: "Gray", bgColor: "bg-gray-500" },
  ];

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await categoryAPI.updateCategory(category._id, editData);
      toast.success("Category updated successfully");
      setIsEditing(false);
      refreshCategories();
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this category? Tasks assigned to this category will be unassigned.")) return;

    setIsDeleting(true);
    try {
      await categoryAPI.deleteCategory(category._id);
      toast.success("Category deleted");
      refreshCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setIsDeleting(false);
      setShowMoreActions(false);
    }
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isEditing) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6 mb-4 transition-all duration-200">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-6 bg-linear-to-b from-blue-500 to-purple-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Category
          </h3>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <TagIcon className="w-4 h-4" />
              Category Name
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
              placeholder="Enter category name"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <InformationCircleIcon className="w-4 h-4" />
              Description
            </label>
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 resize-none min-h-25"
              rows="3"
              placeholder="Add description (optional)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: editData.color }} />
              Color
            </label>
            <div className="grid grid-cols-4 md:grid-cols-9 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setEditData({ ...editData, color: color.value })}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                    editData.color === color.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  title={color.label}
                >
                  <div
                    className={`w-8 h-8 rounded-full ${color.bgColor} border-2 ${
                      editData.color === color.value ? "border-white shadow-lg" : "border-transparent"
                    }`}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{color.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl border border-gray-300 dark:border-gray-600 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-xl border bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md dark:shadow-black/30 transition-all duration-300 mb-5 hover:shadow-xl hover:-translate-y-0.5 border-gray-300/60 dark:border-gray-700/60`}
    >
      <div className="p-6">
        {/* Category Header - Simplified */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <h3 
                className="text-xl font-bold text-gray-900 dark:text-white"
                style={{ color: category.color }}
              >
                {category.name}
              </h3>
            </div>

            {category.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-sm">
                {category.description}
              </p>
            )}
          </div>

          <div className="relative ml-3">
            <button
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 hover:scale-110 cursor-pointer"
              aria-label="More actions"
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>

            {showMoreActions && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMoreActions(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 z-20 py-2 overflow-visible">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMoreActions(false);
                    }}
                    className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 flex items-center gap-3 transition-all duration-200 cursor-pointer"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>Edit Category</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>{isDeleting ? "Deleting..." : "Delete Category"}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Category Metadata */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100/50 dark:border-gray-700/50">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <CalendarIcon className="w-4 h-4" />
            <span>Created: {formatDateForDisplay(category.createdAt)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <ArrowPathIcon className="w-4 h-4" />
            <span>Updated: {formatDateForDisplay(category.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryList = ({
  categories,
  refreshCategories,
  emptyStateProps = {},
  showCreateModal: externalShowCreateModal,
  onCloseCreateModal,
  onOpenCreateModal,
}) => {
  const [internalShowCreateModal, setInternalShowCreateModal] = useState(false);

  const showCreateModal =
    externalShowCreateModal !== undefined
      ? externalShowCreateModal
      : internalShowCreateModal;
  const setShowCreateModal = onCloseCreateModal || setInternalShowCreateModal;

  const handleOpenCreateModal = () => {
    if (onOpenCreateModal) {
      onOpenCreateModal();
    } else {
      setInternalShowCreateModal(true);
    }
  };

  const handleCloseCreateModal = () => {
    if (onCloseCreateModal) {
      onCloseCreateModal();
    } else {
      setInternalShowCreateModal(false);
    }
  };

  // Handler after category creation
  const handleCategoryCreated = () => {
    refreshCategories();
    handleCloseCreateModal();
  };

  const {
    title = "No categories found",
    description = "Create your first category to get started",
    icon = "🏷️",
  } = emptyStateProps;

  if (categories.length === 0) {
    return (
      <>
        <div className="text-center py-20 px-4 bg-linear-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-900/50 dark:to-gray-800/30 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-8">
            <span className="text-4xl">{icon}</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-10 text-lg">
            {description}
          </p>
        </div>

        {/* Create Category Modal */}
        {showCreateModal && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={handleCloseCreateModal}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200/50 dark:border-gray-700/50">
                <NewCategoryForm
                  onClose={handleCloseCreateModal}
                  onCreated={handleCategoryCreated}
                />
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {categories.map((category) => (
          <CategoryItem key={category._id} category={category} refreshCategories={refreshCategories} />
        ))}
      </div>

      {/* Create Category Modal - also show when there are categories */}
      {showCreateModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={handleCloseCreateModal}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200/50 dark:border-gray-700/50">
              <NewCategoryForm
                onClose={handleCloseCreateModal}
                onCreated={handleCategoryCreated}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CategoryList;