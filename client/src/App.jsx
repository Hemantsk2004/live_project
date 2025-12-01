import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AuthForm from "./pages/AuthForm";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ComplaintDetails from "./pages/ComplaintDetails";

import AuthContext from "./context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <Navigate to="/" />;
  if (!allowedRoles.includes(user.role))
    return <p className="p-6 text-red-600">Access Denied</p>;

  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<AuthForm />} />

        {/* USER */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* SUPERADMIN */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* COMPLAINT DETAILS */}
        <Route
          path="/complaints/:id"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <ComplaintDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints/:id"
          element={<ComplaintDetails />}
        />
      </Routes>
    </Router>
  );
}
