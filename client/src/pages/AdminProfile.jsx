
import React, { useContext } from "react";
import {
  UserCog,
  Mail,
  ShieldCheck,
  Activity,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function AdminProfile() {
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
                Admin Profile
              </h1>
              <p className="text-sm text-slate-500">
                Administrative account & system access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="text-sm text-sky-600 hover:underline flex items-center gap-1"
            >
              <Activity size={15} />
              Dashboard
            </button>
            <button
              onClick={logoutUser}
              className="flex items-center gap-1 text-sm text-rose-600 hover:underline"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* PROFILE CARD */}
        <section className="relative rounded-3xl border border-white/80 bg-white/95 shadow-xl">
          <div className="h-20 rounded-t-3xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />

          <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user.fullname?.[0] || "A"}
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {user.fullname}
                </h2>
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  <UserCog size={14} />
                  System Administrator
                </p>
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs">
                  <ShieldCheck size={12} />
                  Full Access
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ADMIN INFO */}
          <div className="bg-white/95 rounded-2xl p-6 border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <ShieldCheck size={18} className="text-sky-500" />
              Admin Information
            </h3>

            <div className="space-y-3 text-sm text-slate-700">
              <p className="flex items-center gap-2">
                <UserCog size={16} />
                <strong>Role:</strong> {user.role}
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck size={16} />
                <strong>Access Level:</strong> Full
              </p>
              <p className="flex items-center gap-2">
                <Activity size={16} />
                <strong>Status:</strong> Active
              </p>
            </div>
          </div>

          {/* ACCOUNT INFO */}
          <div className="bg-white/95 rounded-2xl p-6 border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <Mail size={18} className="text-indigo-500" />
              Account Details
            </h3>

            <div className="space-y-3 text-sm text-slate-700">
              <p className="flex items-center gap-2">
                <Mail size={16} />
                <strong>Email:</strong> {user.email}
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck size={16} />
                <strong>Authentication:</strong> Secure
              </p>
            </div>
          </div>
        </section>

        {/* SMALL SYSTEM NOTE */}
        <section className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-sm text-slate-700">
          This account has full administrative privileges to manage complaints,
          users, and system workflows.
        </section>
      </main>
    </div>
  );
}
