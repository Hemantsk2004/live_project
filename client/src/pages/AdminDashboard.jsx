import React, { useContext, useEffect, useState, useMemo } from "react";
import { UserCog, FileText, LogOut } from "lucide-react";
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

  // ✅ Fetch from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axiosInstance.get("/complaints");
        setComplaints(res.data);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // ✅ Filter logic (backend-safe)
  const filteredComplaints =
    activeFilter === "all"
      ? complaints
      : complaints.filter(
          (c) => (c.status || "open") === activeFilter
        );

  // ✅ Stats (real DB data, Akash-style)
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
    <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 font-sans overflow-hidden">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-xl border-b shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
              CMS
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-500">
                Welcome, <span className="capitalize">{user.fullname}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/profile")}
              className="p-2 rounded-full hover:bg-sky-50"
            >
              <UserCog className="w-5 h-5 text-blue-600" />
            </button>

            <button
              onClick={logoutUser}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-rose-600 border border-rose-100 rounded-full bg-rose-50 hover:bg-rose-100"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* ✅ STATS CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white/90 rounded-2xl p-5 shadow border hover:shadow-lg transition"
            >
              <p className="text-xs uppercase text-slate-500 font-semibold">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {stat.count}
              </p>
            </div>
          ))}
        </section>

        {/* ✅ FILTERS */}
        <section className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition border ${
                activeFilter === filter.id
                  ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white border-blue-500"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </section>

        {/* ✅ COMPLAINT LIST */}
        <section className="space-y-4">
          {loading ? (
            <p>Loading complaints...</p>
          ) : filteredComplaints.length === 0 ? (
            <div className="bg-white/90 p-10 rounded-2xl shadow text-center">
              <FileText className="mx-auto h-14 w-14 text-slate-300 mb-3" />
              <p className="text-slate-500">
                No complaints found for this filter.
              </p>
            </div>
          ) : (
            filteredComplaints.map((c) => (
              <div
                key={c._id}
                onClick={() => navigate(`/complaints/${c._id}`)}
                className="bg-white/95 rounded-2xl p-5 shadow border cursor-pointer hover:-translate-y-[2px] hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start gap-3">
                  <h3 className="font-semibold text-slate-900">
                    {c.title}
                  </h3>

                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                    {c.status || "open"}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                  {c.description}
                </p>

                <p className="text-xs text-slate-400 mt-3">
                  Raised by{" "}
                  <span className="font-medium text-slate-600">
                    {c.user?.fullname || "Unknown"}
                  </span>
                </p>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
