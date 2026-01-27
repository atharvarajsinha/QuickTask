import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  UserCircleIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
  LockClosedIcon,
  EnvelopeIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const { user, updateProfile, changePassword, deleteAccount, logout } =
    useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim() || !profileData.email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    const result = await updateProfile(profileData);
    setLoading(false);
    if (result.success) {
      toast.success("Profile updated successfully");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    const result = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
    setLoading(false);

    if (result.success) {
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await new Promise((resolve) => {
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} 
          max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="shrink-0 pt-0.5">
                  <ExclamationTriangleIcon className="h-10 w-10 text-red-600 dark:text-red-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Delete Account
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    This action cannot be undone. All your data will be
                    permanently deleted.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => {
                    resolve(true);
                    toast.dismiss(t.id);
                  }}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    resolve(false);
                    toast.dismiss(t.id);
                  }}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ),
        { duration: Infinity },
      );
    });

    if (confirmed) {
      await deleteAccount();
    }
  };

  const handleLogout = async () => {
    const confirmed = await new Promise((resolve) => {
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} 
          max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="shrink-0 pt-0.5">
                  <ArrowRightOnRectangleIcon className="h-10 w-10 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Logout Confirmation
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to logout from your account?
                  </p>
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => {
                    resolve(true);
                    toast.dismiss(t.id);
                  }}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 cursor-pointer"
                >
                  Logout
                </button>
                <button
                  onClick={() => {
                    resolve(false);
                    toast.dismiss(t.id);
                  }}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ),
        { duration: Infinity },
      );
    });

    if (confirmed) {
      await logout();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 flex items-center justify-center py-5 px-6 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === "profile"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-linear-to-b from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
                }`}
              >
                <UserCircleIcon
                  className={`w-5 h-5 mr-2 ${activeTab === "profile" ? "text-blue-600 dark:text-blue-400" : ""}`}
                />
                Profile
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex-1 flex items-center justify-center py-5 px-6 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === "security"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-linear-to-b from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
                }`}
              >
                <ShieldCheckIcon
                  className={`w-5 h-5 mr-2 ${activeTab === "security" ? "text-blue-600 dark:text-blue-400" : ""}`}
                />
                Security
              </button>
              <button
                onClick={() => setActiveTab("danger")}
                className={`flex-1 flex items-center justify-center py-5 px-6 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === "danger"
                    ? "text-red-600 dark:text-red-400 border-b-2 border-red-500 bg-linear-to-b from-white to-red-50 dark:from-gray-800 dark:to-red-900/20"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
                }`}
              >
                <ExclamationTriangleIcon
                  className={`w-5 h-5 mr-2 ${activeTab === "danger" ? "text-red-600 dark:text-red-400" : ""}`}
                />
                Danger Zone
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "profile" && (
              <div className="space-y-8">
                {/* Current Profile Info */}
                <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                      <UserCircleIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Current Profile
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your current profile information
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium mb-1">
                        Name
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {user?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium mb-1">
                        Email
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Update Form */}
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Update Profile
                    </h3>

                    <div className="space-y-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <div className="flex items-center">
                            <UserCircleIcon className="w-4 h-4 mr-2 text-gray-400" />
                            Name
                          </div>
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                          placeholder="Enter your name"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-7">
                          <UserCircleIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <div className="flex items-center">
                            <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                            Email
                          </div>
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          className="mt-1 block w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                          placeholder="Enter your email"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-7">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={
                        loading ||
                        (!profileData.name.trim() && !profileData.email.trim())
                      }
                      className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-5 h-5 mr-2" />
                          Update Profile
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-8">
                {/* Password Strength Info */}
                <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800/30">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                      <LockClosedIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Password Security
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tips for a strong password
                      </p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      {
                        text: "At least 8 characters",
                        valid: passwordData.newPassword.length >= 8,
                      },
                      {
                        text: "Contains uppercase letter",
                        valid: /[A-Z]/.test(passwordData.newPassword),
                      },
                      {
                        text: "Contains lowercase letter",
                        valid: /[a-z]/.test(passwordData.newPassword),
                      },
                      {
                        text: "Contains number",
                        valid: /\d/.test(passwordData.newPassword),
                      },
                      {
                        text: "Contains special character",
                        valid: /[!@#$%^&*]/.test(passwordData.newPassword),
                      },
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        {item.valid ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        ) : (
                          <XCircleIcon className="w-5 h-5 text-gray-300 dark:text-gray-600 mr-2" />
                        )}
                        <span
                          className={`text-sm ${item.valid ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}`}
                        >
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Change Password Form */}
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Change Password
                  </h3>

                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center">
                          <KeyIcon className="w-4 h-4 mr-2 text-gray-400" />
                          Current Password
                        </div>
                      </label>
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="Enter current password"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-7">
                        <KeyIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center mt-7 cursor-pointer"
                      >
                        {showCurrentPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center">
                          <KeyIcon className="w-4 h-4 mr-2 text-gray-400" />
                          New Password
                        </div>
                      </label>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="Enter new password"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-7">
                        <KeyIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center mt-7 cursor-pointer"
                      >
                        {showNewPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center">
                          <KeyIcon className="w-4 h-4 mr-2 text-gray-400" />
                          Confirm New Password
                        </div>
                      </label>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmNewPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmNewPassword: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="Confirm new password"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-7">
                        <KeyIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center mt-7 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={
                        loading ||
                        !passwordData.currentPassword ||
                        !passwordData.newPassword ||
                        !passwordData.confirmNewPassword
                      }
                      className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-linear-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Changing...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-5 h-5 mr-2" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "danger" && (
              <div className="space-y-8">
                {/* Warning Header */}
                <div className="text-center mb-8">
                  <ExclamationTriangleIcon className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Danger Zone
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    These actions are irreversible. Please proceed with caution.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Delete Account Card */}
                  <div className="bg-linear-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-xl p-6 border border-red-200 dark:border-red-800/30 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200">
                    <div className="flex items-start mb-4">
                      <div className="w-12 h-12 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4 shrink-0">
                        <TrashIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                          Delete Account
                        </h3>
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400/80">
                          Permanently delete your account and all associated
                          data. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleDeleteAccount}
                        className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Delete Account
                      </button>
                    </div>
                  </div>

                  {/* Logout Card */}
                  <div className="bg-linear-to-r from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/10 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800/30 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-200">
                    <div className="flex items-start mb-4">
                      <div className="w-12 h-12 bg-linear-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mr-4 shrink-0">
                        <ArrowRightOnRectangleIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                          Logout
                        </h3>
                        <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400/80">
                          Sign out from your current session. You will need to
                          log in again to access your account.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleLogout}
                        className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()} • Account created:{" "}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;