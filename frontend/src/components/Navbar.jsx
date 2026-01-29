import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  TagIcon, // Added for Categories
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const { user, darkMode, toggleDarkMode, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    closeMenu();

    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <ChartBarIcon className="w-5 h-5" />,
    },
    {
      to: "/tasks",
      label: "Tasks",
      icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
    },
    {
      to: "/categories",
      label: "Categories",
      icon: <TagIcon className="w-5 h-5" />,
    },
    {
      to: "/profile",
      label: "Profile",
      icon: <UserCircleIcon className="w-5 h-5" />,
    },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={handleLogoClick}
                className="flex items-center space-x-2 group focus:outline-none cursor-pointer"
                title={user ? "Logout and go to home" : "Go to home"}
              >
                <img
                  src="/logo_quicktask.svg"
                  alt="QuickTask Logo"
                  className="h-8 w-8"
                />
                <span
                  className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 
                                dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent
                                group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-200"
                >
                  QuickTask
                </span>
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
                      >
                        {link.icon}
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4 border-l border-gray-200 dark:border-gray-700 pl-8">
                    <button
                      onClick={toggleDarkMode}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-105 cursor-pointer"
                      aria-label={
                        darkMode
                          ? "Switch to light mode"
                          : "Switch to dark mode"
                      }
                    >
                      {darkMode ? (
                        <SunIcon className="w-5 h-5" />
                      ) : (
                        <MoonIcon className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden lg:block">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="
                        flex items-center gap-2 px-4 py-2 text-sm font-medium
                        rounded-lg
                        text-red-600 dark:text-red-400
                        border border-red-200 dark:border-red-900/40
                        bg-red-50 dark:bg-red-900/20
                        hover:bg-red-100 dark:hover:bg-red-900/40
                        hover:text-red-700 dark:hover:text-red-300
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-red-500/40 cursor-pointer
                      "
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all hover:shadow-lg"
                  >
                    Register Now
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {user && (
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer"
                  aria-label={
                    darkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {darkMode ? (
                    <SunIcon className="w-5 h-5" />
                  ) : (
                    <MoonIcon className="w-5 h-5" />
                  )}
                </button>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {user ? (
                <>
                  <div className="px-3 py-4 mb-2 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={closeMenu}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {link.icon}
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="
                      w-full mt-4 flex items-center justify-center gap-2
                      px-4 py-3 text-sm font-medium
                      rounded-lg
                      text-red-600 dark:text-red-400
                      border border-red-200 dark:border-red-900/40
                      bg-red-50 dark:bg-red-900/20
                      hover:bg-red-100 dark:hover:bg-red-900/40
                      transition-colors cursor-pointer
                    "
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span className="font-medium">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex items-center justify-center space-x-2 px-4 py-3 mt-2 text-sm font-medium bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors"
                  >
                    <span>Sign Up Free</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;