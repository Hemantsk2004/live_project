import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user on load
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Login user
  const loginUser = (userData, token) => {
    localStorage.setItem("token", token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  // Logout user
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("fullname");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // Update token + info (OPTION B)
  const updateAuthToken = (token, role, fullname) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("fullname", fullname);

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setUser((prev) => ({
      ...prev,
      role,
      fullname
    }));
  };

  // Update selected fields
  const updateUserInfo = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        logoutUser,
        fetchUser,
        updateAuthToken,
        updateUserInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
