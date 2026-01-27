import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { taskAPI } from "../api/nodeApi";
import { analyticsAPI } from "../api/analyticsApi";
import toast from "react-hot-toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import TaskList from "../components/TaskList";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
);

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [productivity, setProductivity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Date filter states
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());

  // Productivity days dropdown
  const [productivityDays, setProductivityDays] = useState(7);
  const daysOptions = [3, 7, 14, 30, 90];

  const isDarkMode = user?.darkMode || false;

  useEffect(() => {
    fetchDashboardData();
  }, [startDate, endDate, productivityDays]);

  const fetchDashboardData = async () => {
    try {
      // Format dates for API
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      const [tasksRes, statsRes, productivityRes] = await Promise.all([
        taskAPI.getAllTasks(),
        analyticsAPI.getUserStats(formattedStartDate, formattedEndDate),
        analyticsAPI.getProductivityAnalytics(productivityDays),
      ]);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
      setProductivity(productivityRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeReset = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    setStartDate(thirtyDaysAgo);
    setEndDate(new Date());
  };

  const handleLastNDays = (days) => {
    const date = new Date();
    setEndDate(date);

    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start);
  };

  // Get chart colors based on user's dark mode preference
  const getChartColors = (isDark = false) => {
    if (isDark) {
      return {
        todo: "rgba(251, 191, 36, 0.7)",
        inProgress: "rgba(59, 130, 246, 0.7)",
        completed: "rgba(34, 197, 94, 0.7)",
        low: "rgba(34, 197, 94, 0.7)",
        medium: "rgba(251, 191, 36, 0.7)",
        high: "rgba(239, 68, 68, 0.7)",
        line: "rgb(96, 165, 250)",
        lineBg: "rgba(96, 165, 250, 0.1)",
        grid: "rgba(75, 85, 99, 0.3)",
        text: "rgb(156, 163, 175)",
        background: "rgb(17, 24, 39)",
        buttonHover: "rgba(55, 65, 81, 0.8)",
        primaryHover: "rgba(37, 99, 235, 0.9)",
        redHover: "rgba(220, 38, 38, 0.9)",
      };
    }

    return {
      todo: "rgba(255, 206, 86, 0.7)",
      inProgress: "rgba(54, 162, 235, 0.7)",
      completed: "rgba(75, 192, 192, 0.7)",
      low: "rgba(75, 192, 192, 0.7)",
      medium: "rgba(255, 206, 86, 0.7)",
      high: "rgba(255, 99, 132, 0.7)",
      line: "rgb(59, 130, 246)",
      lineBg: "rgba(59, 130, 246, 0.1)",
      grid: "rgba(209, 213, 219, 0.5)",
      text: "rgb(107, 114, 128)",
      background: "rgb(249, 250, 251)",
      buttonHover: "rgba(243, 244, 246, 0.8)",
      primaryHover: "rgba(37, 99, 235, 0.9)",
      redHover: "rgba(220, 38, 38, 0.9)",
    };
  };

  // Format task status data for chart
  const getTaskStatusData = () => {
    const colors = getChartColors(isDarkMode);

    if (!stats || !stats.task_status_distribution) {
      return {
        labels: ["Todo", "In Progress", "Completed"],
        datasets: [
          {
            label: "Tasks",
            data: [0, 0, 0],
            backgroundColor: [colors.todo, colors.inProgress, colors.completed],
            borderColor: isDarkMode
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(255, 255, 255, 0.8)",
            borderWidth: 1,
          },
        ],
      };
    }

    const { task_status_distribution } = stats;
    return {
      labels: Object.keys(task_status_distribution),
      datasets: [
        {
          label: "Tasks",
          data: Object.values(task_status_distribution),
          backgroundColor: [colors.todo, colors.inProgress, colors.completed],
          borderColor: isDarkMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(255, 255, 255, 0.8)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Format priority distribution data
  const getPriorityData = () => {
    const colors = getChartColors(isDarkMode);

    if (!stats || !stats.priority_distribution) {
      return {
        labels: ["Low", "Medium", "High"],
        datasets: [
          {
            label: "Tasks by Priority",
            data: [0, 0, 0],
            backgroundColor: [colors.low, colors.medium, colors.high],
            borderColor: isDarkMode
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(255, 255, 255, 0.8)",
            borderWidth: 1,
          },
        ],
      };
    }

    const { priority_distribution } = stats;
    return {
      labels: Object.keys(priority_distribution),
      datasets: [
        {
          label: "Tasks by Priority",
          data: Object.values(priority_distribution),
          backgroundColor: [colors.low, colors.medium, colors.high],
          borderColor: isDarkMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(255, 255, 255, 0.8)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Format productivity data with actual dates
  const getProductivityData = () => {
    const colors = getChartColors(isDarkMode);

    if (!productivity || !productivity.data || productivity.data.length === 0) {
      const today = new Date();
      const labels = [];
      const data = [];

      for (let i = productivityDays - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        labels.push(dateStr);
        data.push(0);
      }

      return {
        labels,
        datasets: [
          {
            label: "Tasks Completed",
            data,
            borderColor: colors.line,
            backgroundColor: colors.lineBg,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: colors.line,
            pointBorderColor: isDarkMode ? "#1f2937" : "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };
    }

    // Sort productivity data by date
    const sortedData = [...productivity.data].sort((a, b) => {
      return new Date(a._id) - new Date(b._id);
    });

    const dataMap = new Map();
    sortedData.forEach((item) => {
      const date = new Date(item._id);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      dataMap.set(dateStr, item.count);
    });

    const labels = [];
    const data = [];
    const today = new Date();

    for (let i = productivityDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      labels.push(dateStr);

      const hasData = sortedData.some((item) => {
        const itemDate = new Date(item._id);
        return (
          itemDate.getDate() === date.getDate() &&
          itemDate.getMonth() === date.getMonth() &&
          itemDate.getFullYear() === date.getFullYear()
        );
      });

      if (hasData) {
        const dataPoint = sortedData.find((item) => {
          const itemDate = new Date(item._id);
          return (
            itemDate.getDate() === date.getDate() &&
            itemDate.getMonth() === date.getMonth() &&
            itemDate.getFullYear() === date.getFullYear()
          );
        });
        data.push(dataPoint?.count || 0);
      } else {
        data.push(0);
      }
    }

    return {
      labels,
      datasets: [
        {
          label: "Tasks Completed",
          data,
          borderColor: colors.line,
          backgroundColor: colors.lineBg,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.line,
          pointBorderColor: isDarkMode ? "#1f2937" : "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  const getChartOptions = (type = "doughnut") => {
    const colors = getChartColors(isDarkMode);

    const baseOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: colors.text,
            font: {
              size: 12,
            },
            padding: 20,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: isDarkMode ? "#374151" : "#ffffff",
          titleColor: isDarkMode ? "#f3f4f6" : "#111827",
          bodyColor: isDarkMode ? "#d1d5db" : "#4b5563",
          borderColor: isDarkMode ? "#4b5563" : "#e5e7eb",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 6,
          callbacks: {
            title: (context) => {
              if (type === "line") {
                const dateIndex = context[0].dataIndex;
                const label = context[0].dataset.data[dateIndex];
                const dateLabel = context[0].label;

                const today = new Date();
                const pointDate = new Date(today);
                pointDate.setDate(
                  today.getDate() - (productivityDays - 1 - dateIndex),
                );

                return pointDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              }
              return context[0].label;
            },
          },
        },
      },
    };

    if (type === "line") {
      return {
        ...baseOptions,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: colors.grid,
            },
            ticks: {
              color: colors.text,
              stepSize: 1,
              precision: 0,
            },
            title: {
              display: true,
              text: "Tasks Completed",
              color: colors.text,
              font: {
                size: 12,
              },
            },
          },
          x: {
            grid: {
              color: colors.grid,
            },
            ticks: {
              color: colors.text,
              maxRotation: 45,
              minRotation: 45,
            },
            title: {
              display: true,
              text: "Date (MM/DD)",
              color: colors.text,
              font: {
                size: 12,
              },
            },
          },
        },
      };
    }

    return baseOptions;
  };

  const taskStatusData = getTaskStatusData();
  const priorityData = getPriorityData();
  const productivityData = getProductivityData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Calculate daily average productivity
  const dailyAverage = productivity?.data?.length
    ? (
        productivity.data.reduce((sum, item) => sum + item.count, 0) /
        productivity.days
      ).toFixed(1)
    : "0.0";

  // Custom DatePicker styles
  const customDatePickerStyles = {
    wrapper: "w-full",
    input: `
      w-full px-4 py-2.5 rounded-lg
      border border-gray-300 dark:border-gray-600
      bg-white dark:bg-gray-700
      text-gray-900 dark:text-gray-100
      placeholder-gray-400 dark:placeholder-gray-500
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      transition-all duration-200
      hover:border-gray-400 dark:hover:border-gray-500
    `,
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 p-4 md:p-8 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold transition-colors">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p
            className={`mt-2 transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Here's your productivity overview
          </p>
        </div>

        {/* Filters Section */}
        <div
          className={`rounded-xl shadow-sm p-6 mb-8 ${
            isDarkMode ? "bg-gray-800 shadow-gray-800/50" : "bg-white"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold">Filter Dashboard Data</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleLastNDays(7)}
                className={`px-4 py-2.5 text-sm rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600 hover:shadow-lg hover:shadow-gray-900/30 hover:-translate-y-0.5 active:translate-y-0"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => handleLastNDays(30)}
                className={`px-4 py-2.5 text-sm rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600 hover:shadow-lg hover:shadow-gray-900/30 hover:-translate-y-0.5 active:translate-y-0"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => handleLastNDays(90)}
                className={`px-4 py-2.5 text-sm rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600 hover:shadow-lg hover:shadow-gray-900/30 hover:-translate-y-0.5 active:translate-y-0"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                Last 90 Days
              </button>
              <button
                onClick={handleDateRangeReset}
                className={`px-4 py-2.5 text-sm rounded-lg transition-all duration-200 font-medium cursor-pointer ${
                  isDarkMode
                    ? "bg-blue-700 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-900/30 hover:-translate-y-0.5 active:translate-y-0"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200/50 hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                Reset to Default
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Start Date Picker */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Start Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate}
                className={customDatePickerStyles.input}
                wrapperClassName={customDatePickerStyles.wrapper}
              />
            </div>

            {/* End Date Picker */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                End Date
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                className={customDatePickerStyles.input}
                wrapperClassName={customDatePickerStyles.wrapper}
              />
            </div>

            {/* Productivity Days Dropdown */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Productivity Chart Days
              </label>
              <select
                value={productivityDays}
                onChange={(e) => setProductivityDays(Number(e.target.value))}
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
                }`}
              >
                {daysOptions.map((days) => (
                  <option key={days} value={days}>
                    Last {days} Days
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range Summary */}
          <div
            className={`mt-4 pt-4 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Showing data from{" "}
              <span className="font-medium">
                {startDate.toLocaleDateString()}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {endDate.toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Tasks",
              value: stats?.total_tasks || 0,
              icon: "📊",
              color: "blue",
              bgColor: isDarkMode ? "bg-blue-900/30" : "bg-blue-100",
              textColor: isDarkMode ? "text-blue-400" : "text-blue-600",
            },
            {
              title: "Completed",
              value: stats?.completed_tasks || 0,
              icon: "✅",
              color: "green",
              bgColor: isDarkMode ? "bg-green-900/30" : "bg-green-100",
              textColor: isDarkMode ? "text-green-400" : "text-green-600",
            },
            {
              title: "Due Soon",
              value: stats?.due_tasks || 0,
              icon: "⏳",
              color: "yellow",
              bgColor: isDarkMode ? "bg-yellow-900/30" : "bg-yellow-100",
              textColor: isDarkMode ? "text-yellow-400" : "text-yellow-600",
            },
            {
              title: "Completion Rate",
              value: stats?.completion_rate
                ? `${stats.completion_rate.toFixed(1)}%`
                : "0%",
              icon: "📈",
              color: "purple",
              bgColor: isDarkMode ? "bg-purple-900/30" : "bg-purple-100",
              textColor: isDarkMode ? "text-purple-400" : "text-purple-600",
            },
          ].map((card, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-lg ${
                isDarkMode
                  ? "bg-gray-800 shadow-gray-800/50 hover:shadow-gray-700/50 hover:-translate-y-1"
                  : "bg-white hover:shadow-gray-200 hover:-translate-y-1"
              }`}
            >
              <div className="flex items-center">
                <div className="shrink-0">
                  <div
                    className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                  >
                    <span className={`${card.textColor} text-2xl`}>
                      {card.icon}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-3xl font-bold mt-1">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overdue Tasks Card */}
        {stats?.overdue_tasks > 0 && (
          <div className="mb-8">
            <div
              className={`border rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
                isDarkMode
                  ? "bg-red-900/20 border-red-800 hover:shadow-red-900/30 hover:-translate-y-0.5"
                  : "bg-red-50 border-red-200 hover:shadow-red-200/50 hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center">
                <div className="shrink-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110 ${
                      isDarkMode ? "bg-red-900" : "bg-red-100"
                    }`}
                  >
                    <span
                      className={`text-2xl ${isDarkMode ? "text-red-400" : "text-red-600"}`}
                    >
                      ⚠️
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3
                    className={`text-lg font-semibold ${
                      isDarkMode ? "text-red-400" : "text-red-800"
                    }`}
                  >
                    Overdue Tasks Alert
                  </h3>
                  <p
                    className={`mt-1 ${
                      isDarkMode ? "text-red-300" : "text-red-600"
                    }`}
                  >
                    You have{" "}
                    <span className="font-bold">{stats.overdue_tasks}</span>{" "}
                    overdue task{stats.overdue_tasks !== 1 ? "s" : ""} that need
                    attention.
                  </p>
                  <button
                    onClick={() =>
                      (window.location.href = "/tasks?filter=overdue")
                    }
                    className={`mt-4 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                      isDarkMode
                        ? "bg-red-700 hover:bg-red-600 text-white hover:shadow-red-900/30"
                        : "bg-red-600 hover:bg-red-700 text-white hover:shadow-red-200/50"
                    }`}
                  >
                    View Overdue Tasks
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Task Status Chart */}
          <div
            className={`rounded-xl shadow-sm p-6 lg:col-span-2 transition-all duration-300 hover:shadow-lg ${
              isDarkMode
                ? "bg-gray-800 shadow-gray-800/50 hover:shadow-gray-700/50 hover:-translate-y-0.5"
                : "bg-white hover:shadow-gray-200 hover:-translate-y-0.5"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4">
              Task Status Distribution
            </h3>
            <div className="h-64">
              <Doughnut
                data={taskStatusData}
                options={getChartOptions("doughnut")}
              />
            </div>
          </div>

          {/* Priority Distribution Chart */}
          <div
            className={`rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-lg ${
              isDarkMode
                ? "bg-gray-800 shadow-gray-800/50 hover:shadow-gray-700/50 hover:-translate-y-0.5"
                : "bg-white hover:shadow-gray-200 hover:-translate-y-0.5"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4">
              Priority Distribution
            </h3>
            <div className="h-64">
              <Doughnut
                data={priorityData}
                options={getChartOptions("doughnut")}
              />
            </div>
          </div>

          {/* Productivity Chart */}
          <div
            className={`rounded-xl shadow-sm p-6 lg:col-span-3 transition-all duration-300 hover:shadow-lg ${
              isDarkMode
                ? "bg-gray-800 shadow-gray-800/50 hover:shadow-gray-700/50 hover:-translate-y-0.5"
                : "bg-white hover:shadow-gray-200 hover:-translate-y-0.5"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
              <h3 className="text-xl font-semibold">
                Daily Productivity (Last {productivityDays} Days)
              </h3>
              <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                <span
                  className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Daily Average:{" "}
                  <span className="font-semibold">{dailyAverage}</span>{" "}
                  tasks/day
                </span>
                <span
                  className={`hidden sm:inline ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}
                >
                  •
                </span>
                <span
                  className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Total:{" "}
                  <span className="font-semibold">
                    {productivity?.data?.reduce(
                      (sum, item) => sum + item.count,
                      0,
                    ) || 0}
                  </span>{" "}
                  tasks
                </span>
              </div>
            </div>
            <div className="h-64">
              <Line data={productivityData} options={getChartOptions("line")} />
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div
          className={`rounded-xl shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-lg ${
            isDarkMode
              ? "bg-gray-800 shadow-gray-800/50 hover:shadow-gray-700/50 hover:-translate-y-0.5"
              : "bg-white hover:shadow-gray-200 hover:-translate-y-0.5"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold">Recent Tasks</h3>
              <p
                className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Latest {Math.min(tasks.length, 5)} of {tasks.length} tasks
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => (window.location.href = "/tasks")}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-lg transition-all duration-200 font-medium hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                  isDarkMode
                    ? "bg-blue-700 hover:bg-blue-600 text-white hover:shadow-blue-900/30"
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-200/50"
                }`}
              >
                View All Tasks
              </button>
            </div>
          </div>

          {tasks.length > 0 ? (
            <>
              <TaskList
                tasks={tasks.slice(0, 5)}
                refreshTasks={fetchDashboardData}
              />
              {tasks.length > 5 && (
                <div className="mt-4 text-center">
                  <p
                    className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Showing 5 of {tasks.length} tasks
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div
                className={`text-5xl mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}
              >
                📝
              </div>
              <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
              <p
                className={`mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Create your first task to get started
              </p>
              <button
                onClick={() => (window.location.href = "/tasks")}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                  isDarkMode
                    ? "bg-blue-700 hover:bg-blue-600 text-white hover:shadow-blue-900/30"
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-200/50"
                }`}
              >
                Create Task
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Task Summary",
              items: [
                { label: "Pending Tasks:", value: stats?.pending_tasks || 0 },
                {
                  label: "In Progress:",
                  value: stats?.task_status_distribution?.["In Progress"] || 0,
                },
                {
                  label: "Overdue:",
                  value: stats?.overdue_tasks || 0,
                  className: isDarkMode ? "text-red-400" : "text-red-600",
                },
              ],
            },
            {
              title: "Priority Summary",
              items: [
                {
                  label: "High Priority:",
                  value: stats?.priority_distribution?.High || 0,
                },
                {
                  label: "Medium Priority:",
                  value: stats?.priority_distribution?.Medium || 0,
                },
                {
                  label: "Low Priority:",
                  value: stats?.priority_distribution?.Low || 0,
                },
              ],
            },
            {
              title: "Productivity Insights",
              items: [
                {
                  label: "Completion Rate:",
                  value: stats?.completion_rate
                    ? `${stats.completion_rate.toFixed(1)}%`
                    : "0%",
                },
                { label: "Tasks Due Soon:", value: stats?.due_tasks || 0 },
                { label: "Daily Average:", value: `${dailyAverage} tasks/day` },
              ],
            },
          ].map((section, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 transition-all duration-300 hover:shadow-md ${
                isDarkMode
                  ? "bg-gray-800/50 hover:bg-gray-800/70 hover:-translate-y-0.5"
                  : "bg-gray-50 hover:bg-gray-100 hover:-translate-y-0.5"
              }`}
            >
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex justify-between items-center transition-transform duration-200 hover:translate-x-1"
                  >
                    <span
                      className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`font-medium transition-all duration-200 hover:scale-110 ${item.className || ""}`}
                    >
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Date Range Summary Footer */}
        <div
          className={`mt-8 p-4 rounded-lg transition-all duration-300 hover:shadow-md ${
            isDarkMode
              ? "bg-gray-800/50 hover:bg-gray-800/70 hover:-translate-y-0.5"
              : "bg-gray-100 hover:bg-gray-200 hover:-translate-y-0.5"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Showing statistics from{" "}
              <span className="font-medium">
                {startDate.toLocaleDateString()}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {endDate.toLocaleDateString()}
              </span>
            </p>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Last updated:{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;