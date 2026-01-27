import React, { createContext, useState, useContext, useEffect } from "react";
import { userAPI } from "../api/nodeApi";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.darkMode !== undefined) {
      if (user.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [user?.darkMode]);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setUser(response.data);
      if (response.data.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await userAPI.login(credentials);
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      if (user.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const register = async (userData) => {
    try {
      const response = await userAPI.register(userData);
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      if (response.data.user.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const toggleDarkMode = async () => {
    try {
      const response = await userAPI.toggleDarkMode();
      setUser((prevUser) => ({
        ...prevUser,
        darkMode: response.data.darkMode,
      }));
      toast.success(
        `Dark mode ${response.data.darkMode ? "enabled" : "disabled"}`,
      );
      return { success: true };
    } catch (error) {
      toast.error("Failed to update dark mode preference");
      console.error("Dark mode toggle failed:", error);
      return { success: false };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await userAPI.updateProfile(profileData);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await userAPI.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const deleteAccount = async () => {
    try {
      await userAPI.deleteAccount();
      logout();
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        toggleDarkMode,
        updateProfile,
        changePassword,
        deleteAccount,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};