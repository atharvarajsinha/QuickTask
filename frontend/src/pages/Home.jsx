import { useEffect, useState } from "react";
import analyticsApi from "../api/analyticsApi";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await analyticsApi.get("/analytics/public-stats/");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch public stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Prepare chart data
  const taskDistributionData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: stats
          ? [stats.tasks_completed, stats.total_tasks - stats.tasks_completed]
          : [0, 0],
        backgroundColor: ["rgba(59, 130, 246, 0.8)", "rgba(139, 92, 246, 0.8)"],
        borderColor: ["rgb(59, 130, 246)", "rgb(139, 92, 246)"],
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
            Loading statistics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
              Organize Your Work,
              <span className="block mt-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Amplify Your Productivity
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The intelligent task management platform that helps individuals
              stay organized, focused, and achieve more every day.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Register Now
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Many
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Join our community of productive users worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
            {/* Total Users Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg dark:hover:shadow-blue-900/10 transition-all duration-200">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0H21m-4.5 0H12m4.5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.total_users?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Tasks Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-lg dark:hover:shadow-purple-900/10 transition-all duration-200">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/30">
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Tasks Created
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.total_tasks?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Completed Tasks Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-green-300 dark:hover:border-green-500 hover:shadow-lg dark:hover:shadow-green-900/10 transition-all duration-200">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Tasks Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.tasks_completed?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Completion Rate Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-yellow-300 dark:hover:border-yellow-500 hover:shadow-lg dark:hover:shadow-yellow-900/10 transition-all duration-200">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/30">
                  <svg
                    className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Completion Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.completion_rate?.toFixed(1) || 0}%
                  </p>
                </div>
              </div>
            </div>

            {/* Total Users Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg dark:hover:shadow-blue-900/10 transition-all duration-200">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0H21m-4.5 0H12m4.5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.active_users?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Task Distribution Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Task Distribution
              </h3>
              <div className="h-64">
                <Doughnut
                  data={taskDistributionData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          padding: 15,
                          font: {
                            size: 13,
                          },
                          color: isDarkMode ? "#D1D5DB" : "#374151",
                        },
                      },
                    },
                    cutout: "65%",
                  }}
                />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.tasks_completed}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Completed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.total_tasks - stats.tasks_completed}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    In Progress
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Visualization */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Productivity Metrics
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Task Completion
                    </span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {stats.completion_rate?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 dark:bg-green-400 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${stats.completion_rate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active Engagement
                    </span>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {stats.total_users > 0
                        ? (
                            (stats.active_users / stats.total_users) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${stats.total_users > 0 ? (stats.active_users / stats.total_users) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.total_users > 0
                          ? (stats.total_tasks / stats.total_users).toFixed(1)
                          : 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Tasks per User
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        {stats.tasks_completed > 0
                          ? (stats.total_tasks / stats.tasks_completed).toFixed(
                              1,
                            )
                          : 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Efficiency Ratio
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Why Choose QuickTask?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-8 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg dark:hover:shadow-blue-900/10 transition-all duration-200">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Lightning Fast
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Create and manage tasks instantly with our streamlined
                  interface.
                </p>
              </div>

              <div className="text-center p-8 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-lg dark:hover:shadow-purple-900/10 transition-all duration-200">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Smart Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Gain insights with detailed productivity tracking and reports.
                </p>
              </div>

              <div className="text-center p-8 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-300 dark:hover:border-green-500 hover:shadow-lg dark:hover:shadow-green-900/10 transition-all duration-200">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Secure & Private
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Your data is protected with industry-leading security
                  measures.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center p-8 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800/30 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Many users have transformed their productivity with QuickTask.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}