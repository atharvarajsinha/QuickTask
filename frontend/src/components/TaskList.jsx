import { useState, useEffect } from "react";
import { taskAPI } from "../api/nodeApi";
import toast from "react-hot-toast";
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  PlayIcon,
  ClockIcon,
  CalendarIcon,
  TagIcon,
  StarIcon,
  FlagIcon,
  EllipsisVerticalIcon,
  ArrowPathIcon,
  ListBulletIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// NewTaskForm component
const NewTaskForm = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Todo",
    priority: "Medium",
    dueDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await taskAPI.createTask(formData);
      toast.success("Task created successfully!");
      onCreated();
      onClose();
      setFormData({
        title: "",
        description: "",
        status: "Todo",
        priority: "Medium",
        dueDate: "",
      });
    } catch (error) {
      toast.error("Failed to create task");
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
            Create New Task
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
            <PencilIcon className="w-4 h-4" />
            Task Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
            placeholder="Enter task title"
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <ListBulletIcon className="w-4 h-4" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FlagIcon className="w-4 h-4" />
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 appearance-none"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
            />
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
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

const TaskItem = ({ task, refreshTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...task });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Format date for form input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
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

  useEffect(() => {
    // Format dueDate for form when editing
    if (task.dueDate) {
      setEditData((prev) => ({
        ...prev,
        dueDate: formatDateForInput(task.dueDate),
      }));
    }
  }, [task.dueDate]);

  // Function to get next status in cycle
  const getNextStatus = (currentStatus) => {
    const statusCycle = ["Todo", "In Progress", "Completed"];
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    return statusCycle[nextIndex];
  };

  const handleStatusClick = async () => {
    const nextStatus = getNextStatus(task.status);
    setIsUpdatingStatus(true);

    try {
      await taskAPI.updateTaskStatus(task._id, nextStatus);
      toast.success(`Task marked as ${nextStatus}`);
      refreshTasks();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.updateTask(task._id, editData);
      toast.success("Task updated successfully");
      setIsEditing(false);
      refreshTasks();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setIsDeleting(true);
    try {
      await taskAPI.deleteTask(task._id);
      toast.success("Task deleted");
      refreshTasks();
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
      setShowMoreActions(false);
    }
  };

  const getPriorityConfig = (priority) => {
    const config = {
      High: {
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-200 dark:border-red-800",
        icon: <FlagIcon className="w-4 h-4" />,
        label: "High Priority",
      },
      Medium: {
        color: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-yellow-200 dark:border-yellow-800",
        icon: <StarIcon className="w-4 h-4" />,
        label: "Medium Priority",
      },
      Low: {
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border-green-200 dark:border-green-800",
        icon: <TagIcon className="w-4 h-4" />,
        label: "Low Priority",
      },
    };
    return config[priority] || config.Low;
  };

  const getStatusConfig = (status) => {
    const config = {
      Completed: {
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        border: "border-emerald-200 dark:border-emerald-800",
        icon: <CheckIcon className="w-4 h-4" />,
        label: "Completed",
        actionColor:
          "from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
      },
      "In Progress": {
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-800",
        icon: <ArrowPathIcon className="w-4 h-4" />,
        label: "In Progress",
        actionColor:
          "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      },
      Todo: {
        color: "text-gray-600 dark:text-gray-400",
        bg: "bg-gray-50 dark:bg-gray-800/50",
        border: "border-gray-200 dark:border-gray-700",
        icon: <ListBulletIcon className="w-4 h-4" />,
        label: "To Do",
        actionColor:
          "from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
      },
    };

    const hasDueDate = Boolean(task.dueDate);
    const isOverdue =
      hasDueDate &&
      task.status !== "Completed" &&
      new Date(task.dueDate) < new Date();

    if (isOverdue && status === "Todo") {
      return {
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-200 dark:border-red-800",
        icon: <ClockIcon className="w-4 h-4" />,
        label: "Overdue",
        actionColor:
          "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
      };
    }

    return config[status] || config.Todo;
  };

  const hasDueDate = Boolean(task.dueDate);
  const shouldShowOverdue =
    hasDueDate &&
    task.status !== "Completed" &&
    new Date(task.dueDate) < new Date();

  const statusConfig = getStatusConfig(task.status);

  if (isEditing) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6 mb-4 transition-all duration-200">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-6 bg-linear-to-b from-blue-500 to-purple-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Task
          </h3>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <PencilIcon className="w-4 h-4" />
              Task Title
            </label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
              placeholder="Enter task title"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ListBulletIcon className="w-4 h-4" />
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
              <ArrowPathIcon className="w-4 h-4" />
              Status
            </label>

            <select
              value={editData.status}
              onChange={(e) =>
                setEditData({ ...editData, status: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl
                        dark:bg-gray-700/50 dark:text-white
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        outline-none transition-all duration-200
                        hover:border-gray-400 dark:hover:border-gray-500 appearance-none"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FlagIcon className="w-4 h-4" />
                Priority
              </label>
              <select
                value={editData.priority}
                onChange={(e) =>
                  setEditData({ ...editData, priority: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 appearance-none"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Due Date
              </label>
              <input
                type="date"
                value={editData.dueDate}
                onChange={(e) =>
                  setEditData({ ...editData, dueDate: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
              />
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
      className={`relative rounded-xl border
      bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
      shadow-md dark:shadow-black/30
      transition-all duration-300 mb-5
      hover:shadow-xl hover:-translate-y-0.5
      ${
        task.status === "Completed"
          ? "border-emerald-300/60 dark:border-emerald-700/60"
          : shouldShowOverdue
            ? "border-red-300/60 dark:border-red-700/60"
            : "border-gray-300/60 dark:border-gray-700/60"
      }`}
    >
      <div className="p-6">
        {/* Task Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <button
                onClick={handleStatusClick}
                disabled={isUpdatingStatus}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                  ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}
                  transition-all duration-200
                  hover:shadow-sm hover:scale-[1.02] transform
                  active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-wait disabled:hover:scale-100
                  ${isUpdatingStatus ? "cursor-wait" : "cursor-pointer"}
                `}
                title={`Click to change status (${task.status} → ${getNextStatus(task.status)})`}
              >
                {isUpdatingStatus ? (
                  <ArrowPathIcon className="w-3 h-3 animate-spin" />
                ) : (
                  statusConfig.icon
                )}
                {isUpdatingStatus ? "Updating..." : statusConfig.label}
              </button>

              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getPriorityConfig(task.priority).bg} ${getPriorityConfig(task.priority).color} ${getPriorityConfig(task.priority).border} transition-all duration-200 cursor-pointer`}
              >
                {getPriorityConfig(task.priority).icon}
                {getPriorityConfig(task.priority).label}
              </div>
            </div>

            <h3
              className={`text-xl font-bold mb-3 ${task.status === "Completed" ? "line-through text-gray-500 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-sm">
                {task.description}
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
                    <span>Edit Task</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>{isDeleting ? "Deleting..." : "Delete Task"}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Task Metadata */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100/50 dark:border-gray-700/50">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <CalendarIcon className="w-4 h-4" />
            <span>Created: {formatDateForDisplay(task.createdAt)}</span>
          </div>

          {task.dueDate && (
            <div
              className={`flex items-center gap-1.5 text-sm ${
                shouldShowOverdue
                  ? "text-red-600 dark:text-red-400 font-medium"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <ClockIcon className="w-4 h-4" />
              <span>
                Due: {formatDateForDisplay(task.dueDate)}
                {shouldShowOverdue && " (Overdue)"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TaskList = ({
  tasks,
  refreshTasks,
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

  // Handler after task creation
  const handleTaskCreated = () => {
    refreshTasks();
    handleCloseCreateModal();
  };

  const {
    title = "No tasks found",
    description = "Create your first task to get started",
    icon = "📝",
  } = emptyStateProps;

  if (tasks.length === 0) {
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

        {/* Create Task Modal */}
        {showCreateModal && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={handleCloseCreateModal}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200/50 dark:border-gray-700/50">
                <NewTaskForm
                  onClose={handleCloseCreateModal}
                  onCreated={handleTaskCreated}
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
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} refreshTasks={refreshTasks} />
        ))}
      </div>

      {/* Create Task Modal - also show when there are tasks */}
      {showCreateModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={handleCloseCreateModal}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200/50 dark:border-gray-700/50">
              <NewTaskForm
                onClose={handleCloseCreateModal}
                onCreated={handleTaskCreated}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TaskList;