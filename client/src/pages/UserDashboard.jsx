import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import {
  FileText,
  Plus,
  User,
  LayoutDashboard,
  ClipboardList,
  ShieldCheck,
  LogOut,
  X,
} from "lucide-react";
import AuthContext from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const { user, logoutUser, updateUserInfo } = useContext(AuthContext);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [requestingAdmin, setRequestingAdmin] = useState(false);

  const navigate = useNavigate();

  /* ================= FETCH COMPLAINTS ================= */
  const fetchMyComplaints = async () => {
    try {
      const res = await axiosInstance.get("/complaints/my");
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  /* ================= STATS ================= */
  const { total, active, resolved } = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter(
      (c) => c.status?.toLowerCase() === "resolved"
    ).length;
    const active = total - resolved;
    return { total, active, resolved };
  }, [complaints]);

  /* ================= SUBMIT COMPLAINT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      setSubmitting(true);
      await axiosInstance.post("/complaints", { title, description });
      setTitle("");
      setDescription("");
      setShowForm(false);
      fetchMyComplaints();
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= REQUEST ADMIN ================= */
  const requestAdminRole = async () => {
    try {
      setRequestingAdmin(true);
      await axiosInstance.post("/auth/request-admin");
      updateUserInfo({ adminRequested: true });
      alert("Admin request sent successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Request failed");
    } finally {
      setRequestingAdmin(false);
    }
  };

  if (!user) return <p className="p-6">Loading...</p>;

  const recentComplaints = complaints.slice(0, 6);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-sky-100 via-white to-indigo-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-white/70 shadow-sm hidden md:flex flex-col">
        <div className="px-6 py-5 border-b border-white/70">
          <h2 className="text-lg font-bold text-slate-900">CMS</h2>
          <p className="text-xs text-slate-500 mt-1">User Panel</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-sky-50 text-sky-700 font-medium">
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/user/profile")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-sky-50 text-slate-700"
          >
            <User size={18} />
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Dashboard Overview
            </h1>
            <p className="text-sm text-slate-600">
              Welcome back,{" "}
              <span className="font-medium">{user.fullname}</span>
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold shadow hover:shadow-lg transition"
          >
            <Plus className="inline w-4 h-4 mr-1" />
            New Complaint
          </button>
        </div>

        {/* REQUEST ADMIN ROLE */}
        {user.role === "user" && !user.adminRequested && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">
                Want to become an Admin?
              </h3>
              <p className="text-sm text-slate-600">
                Request elevated access to manage and resolve complaints.
              </p>
            </div>

            <button
              onClick={requestAdminRole}
              disabled={requestingAdmin}
              className="px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 disabled:opacity-60"
            >
              {requestingAdmin ? "Requesting..." : "Request Admin Role"}
            </button>
          </div>
        )}

        {user.adminRequested && (
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-sm text-sky-700">
            Your admin request is under review by SuperAdmin.
          </div>
        )}

        {/* ROLE CONTEXT */}
        <div className="bg-white/90 rounded-2xl border border-white/80 shadow-lg p-6 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
            <ShieldCheck className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">
              Your Role in the System
            </h2>
            <p className="text-sm text-slate-600">
              Submit complaints, monitor progress, and ensure accountability
              through a transparent workflow.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { label: "Total Complaints", value: total },
            { label: "Active", value: active },
            { label: "Resolved", value: resolved },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white/95 rounded-2xl border border-white/80 shadow p-6"
            >
              <p className="text-xs uppercase text-slate-500 font-semibold">
                {s.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* COMPLAINTS */}
        <div className="bg-white/95 rounded-2xl border border-white/80 shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <ClipboardList size={18} />
            Recent Complaints
          </h3>

          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : recentComplaints.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <FileText className="mx-auto mb-2" />
              No complaints raised yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {recentComplaints.map((c) => (
                <div
                  key={c._id}
                  onClick={() => navigate(`/complaints/${c._id}`)}
                  className="bg-white rounded-xl border border-slate-200 p-4 cursor-pointer hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-slate-900 line-clamp-1">
                      {c.title}
                    </p>
                    <span className="text-xs px-2 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700">
                      {c.status}
                    </span>
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

      {/* ================= MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />

          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Submit New Complaint
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full border rounded-xl p-2"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                rows={4}
                className="w-full border rounded-xl p-2"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
