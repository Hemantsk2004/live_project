import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  LayoutDashboard,
  UserCog,
  ClipboardList,
  FileText,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import AuthContext from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
  { id: "closed", label: "Closed" },
];

export default function AdminDashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("open");

  /* ================= FETCH COMPLAINTS ================= */
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axiosInstance.get("/complaints");
        setComplaints(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`/complaints/${id}/status`, { status });

      setComplaints((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status } : c
        )
      );
    } catch {
      alert("Failed to update status");
    }
  };

  /* ================= FILTER ================= */
  const filteredComplaints =
    activeFilter === "all"
      ? complaints
      : complaints.filter(
          (c) => (c.status || "open") === activeFilter
        );

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    const total = complaints.length;
    const open = complaints.filter(c => c.status === "open").length;
    const inProgress = complaints.filter(c => c.status === "in_progress").length;
    const resolved = complaints.filter(c => c.status === "resolved").length;
    const closed = complaints.filter(c => c.status === "closed").length;

    return [
      { id: "all", label: "All", count: total },
      { id: "open", label: "Open", count: open },
      { id: "in_progress", label: "In Progress", count: inProgress },
      { id: "resolved", label: "Resolved", count: resolved },
      { id: "closed", label: "Closed", count: closed },
    ];
  }, [complaints]);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-sky-100 via-white to-indigo-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-white/70 shadow-sm hidden md:flex flex-col">
        <div className="px-6 py-5 border-b border-white/70">
          <h2 className="text-lg font-bold text-slate-900">CMS</h2>
          <p className="text-xs text-slate-500 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-sky-50 text-sky-700 font-medium">
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/profile")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-sky-50 text-slate-700"
          >
            <UserCog size={18} />
            Profile
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
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-600">
            Manage and resolve user complaints efficiently
          </p>
        </div>

        {/* ROLE CONTEXT */}
        <div className="bg-white/90 rounded-2xl border border-white/80 shadow-lg p-6 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">
              Administrative Responsibilities
            </h2>
            <p className="text-sm text-slate-600">
              Review complaints, communicate with users, and update resolution
              status to maintain accountability.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((s) => (
            <div
              key={s.id}
              className="bg-white/95 rounded-2xl border border-white/80 shadow p-6"
            >
              <p className="text-xs uppercase text-slate-500 font-semibold">
                {s.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {s.count}
              </p>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${
                activeFilter === f.id
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-sky-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* COMPLAINT LIST */}
        <div className="bg-white/95 rounded-2xl border border-white/80 shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <ClipboardList size={18} />
            Complaints
          </h3>

          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <FileText className="mx-auto mb-2" />
              No complaints found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map((c) => (
                <div
                  key={c._id}
                  onClick={() => navigate(`/complaints/${c._id}`)}
                  className="bg-white rounded-xl border border-slate-200 p-4 cursor-pointer hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {c.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Raised by{" "}
                        <span className="font-medium text-slate-700">
                          {c.user?.fullname || "Unknown"}
                        </span>
                      </p>
                    </div>

                    <select
                      value={c.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateStatus(c._id, e.target.value)
                      }
                      className="text-xs border rounded-lg px-2 py-1 bg-white"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
