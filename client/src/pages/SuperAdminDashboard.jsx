import React, { useState, useEffect, useContext } from "react";
import {
  LayoutDashboard,
  Shield,
  UserCheck,
  Mail,
  LogOut,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ================= FETCH REQUESTS ================= */
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axiosInstance.get(
          "/superadmin/pending-admin-requests"
        );
        setPendingUsers(res.data.requests || res.data);
      } catch (err) {
        console.error(err);
        alert(
          err.response?.data?.message || "Failed to fetch pending requests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  /* ================= APPROVE ================= */
  const approveAdmin = async (userId) => {
    try {
      const res = await axiosInstance.post(
        `/superadmin/approve-admin/${userId}`
      );
      alert(res.data.message);

      const refreshed = await axiosInstance.get(
        "/superadmin/pending-admin-requests"
      );
      setPendingUsers(refreshed.data.requests || refreshed.data);
    } catch (err) {
      alert(err.response?.data?.message || "Approval failed");
    }
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-sky-100 via-white to-indigo-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-white/70 shadow-sm hidden md:flex flex-col">
        <div className="px-6 py-5 border-b border-white/70">
          <h2 className="text-lg font-bold text-slate-900">CMS</h2>
          <p className="text-xs text-slate-500 mt-1">SuperAdmin Panel</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-sky-50 text-sky-700 font-medium">
            <LayoutDashboard size={18} />
            Dashboard
          </button>
        </nav>

        <div className="px-4 py-4 border-t border-white/70">
          <button
            onClick={logoutUser}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-rose-600 hover:bg-rose-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            SuperAdmin Console
          </h1>
          <p className="text-sm text-slate-600">
            Approve administrators and oversee system governance
          </p>
        </div>

        {/* ROLE CONTEXT */}
        <div className="bg-white/90 rounded-2xl border border-white/80 shadow-lg p-6 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">
              Elevated Authority Mode
            </h2>
            <p className="text-sm text-slate-600">
              You control administrative access and system-level governance.
            </p>
          </div>
        </div>

        {/* REQUESTS */}
        <div className="bg-white/95 rounded-2xl border border-white/80 shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <UserCheck size={18} />
            Pending Admin Requests
          </h3>

          {loading ? (
            <p className="text-sm text-slate-500">Loading requests…</p>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <UserCheck className="mx-auto mb-2" />
              No pending admin approvals.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between gap-4 bg-white rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                      {u.fullname?.[0] || "U"}
                    </div>

                    <div>
                      <p className="font-medium text-slate-900">
                        {u.fullname}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail size={12} />
                        {u.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => approveAdmin(u._id)}
                    className="px-4 py-2 text-sm rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
