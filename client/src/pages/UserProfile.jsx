// client/src/pages/UserProfile.jsx
import React, { useContext } from "react";
import {
  LogOut,
  User,
  LayoutDashboard,
  Mail,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function UserProfile() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/70 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
              CMS
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                User Profile
              </h1>
              <p className="text-sm text-slate-500">
                Manage your account information
              </p>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="flex items-center gap-2 text-sm text-rose-600 hover:underline"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* PROFILE CARD */}
        <div className="bg-white/90 border border-white/80 rounded-2xl p-6 shadow-lg backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                {user.fullname?.[0] || "U"}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {user.fullname}
                </h2>
                <p className="text-sm text-slate-500">
                  {user.role?.toUpperCase()} Account
                </p>
              </div>
            </div>

            {/* ✅ FINAL FIX HERE */}
            <button
              onClick={() =>
                navigate("/user/dashboard", { replace: true })
              }
              className="flex items-center gap-2 text-sm text-sky-600 hover:underline"
            >
              <LayoutDashboard size={16} />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* USER INFO */}
          <div className="bg-white/95 rounded-2xl p-6 border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <User size={18} className="text-sky-500" />
              Personal Info
            </h3>

            <div className="space-y-3 text-sm text-slate-700">
              <p className="flex items-center gap-2">
                <User size={16} /> <strong>Name:</strong> {user.fullname}
              </p>
              <p className="flex items-center gap-2">
                <Shield size={16} /> <strong>Role:</strong> {user.role}
              </p>
            </div>
          </div>

          {/* ACCOUNT INFO */}
          <div className="bg-white/95 rounded-2xl p-6 border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <Mail size={18} className="text-indigo-500" />
              Account Info
            </h3>

            <div className="space-y-3 text-sm text-slate-700">
              <p className="flex items-center gap-2">
                <Mail size={16} /> <strong>Email:</strong> {user.email}
              </p>
              <p className="flex items-center gap-2">
                <Shield size={16} /> <strong>Status:</strong> Active
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
