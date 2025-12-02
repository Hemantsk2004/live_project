import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import AuthContext from "../context/AuthContext";
import {
  Shield,
  UserCheck,
  Mail,
  LogOut,
} from "lucide-react";

export default function SuperAdminDashboard() {
  const { user, logoutUser, updateAuthToken } = useContext(AuthContext);
  const [pendingUsers, setPendingUsers] = useState([]);

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
      }
    };

    fetchPending();
  }, []);

  const approveAdmin = async (userId) => {
    try {
      const res = await axiosInstance.post(
        `/superadmin/approve-admin/${userId}`
      );

      alert(res.data.message);

      if (res.data.token && res.data.role) {
        updateAuthToken(res.data.token, res.data.role, res.data.fullname);
      }

      const refreshed = await axiosInstance.get(
        "/superadmin/pending-admin-requests"
      );
      setPendingUsers(refreshed.data.requests || refreshed.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Approval failed");
    }
  };

  if (!user) {
    return <p className="p-6 text-slate-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 font-sans">
      {/* HEADER */}
      <header className="bg-white/85 backdrop-blur-xl border-b border-white/70 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-600 text-white font-bold flex items-center justify-center shadow">
              CMS
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                SuperAdmin Console
              </h1>
              <p className="text-sm text-slate-500">
                Governance & access control
              </p>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="flex items-center gap-1 text-sm text-rose-600 hover:underline"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* CONTEXT CARD */}
        <section className="bg-white/95 border border-white/80 rounded-2xl shadow-lg p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Elevated Authority Mode
            </p>
            <p className="text-xs text-slate-600">
              You are approving administrative access across the system.
            </p>
          </div>
        </section>

        {/* PENDING ADMINS */}
        <section className="bg-white/95 border border-white/80 rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Pending Admin Requests
          </h2>

          {pendingUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-sm">
              <UserCheck className="w-10 h-10 mb-2 text-slate-300" />
              No pending admin approvals.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map((pendingUser) => (
                <div
                  key={pendingUser._id}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:shadow transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white flex items-center justify-center font-semibold">
                      {pendingUser.fullname?.[0] || "A"}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {pendingUser.fullname}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        {pendingUser.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => approveAdmin(pendingUser._id)}
                    className="px-4 py-2 text-sm rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
                  >
                    Approve Admin
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
