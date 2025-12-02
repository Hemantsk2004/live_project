import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ----------------------------------
     FETCH USER ON APP LOAD / REFRESH
  ---------------------------------- */
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    // ✅ CRITICAL: attach token before calling /auth/me
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;

    try {
      const res = await axiosInstance.get("/auth/me");

      setUser({
        ...res.data.user,
        role: res.data.user.role?.toLowerCase(), // ✅ normalize role
      });
    } catch (err) {
      console.error("Error fetching user:", err);

      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  /* ----------------------------------
     LOGIN USER
  ---------------------------------- */
  const loginUser = (userData, token) => {
    localStorage.setItem("token", token);

    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;

    setUser({
      ...userData,
      role: userData.role?.toLowerCase(),
    });
  };

  /* ----------------------------------
     LOGOUT USER
  ---------------------------------- */
  const logoutUser = () => {
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setUser(null);
  };

  /* ----------------------------------
     UPDATE TOKEN / ROLE (OPTIONAL)
  ---------------------------------- */
  const updateAuthToken = (token, role, fullname) => {
    localStorage.setItem("token", token);

    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;

    setUser((prev) => ({
      ...prev,
      role: role?.toLowerCase(),
      fullname,
    }));
  };

  /* ----------------------------------
     UPDATE USER INFO (PROFILE ETC.)
  ---------------------------------- */
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
        updateUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
