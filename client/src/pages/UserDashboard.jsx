import React, { useContext, useEffect, useState, useMemo } from "react";
import { FileText, User, Plus } from "lucide-react";
import AuthContext from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const { user, logoutUser } = useContext(AuthContext);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state for new complaint form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // ✅ Fetch user complaints
  const fetchMyComplaints = async () => {
    try {
      const res = await axiosInstance.get("/complaints/my");
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  // ✅ Stats (like Akash UI but backend-driven)
  const { total, active, resolved } = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter(
      (c) => c.status?.toLowerCase() === "resolved"
    ).length;
    const active = total - resolved;
    return { total, active, resolved };
  }, [complaints]);

  if (!user) return <p className="p-6">Loading...</p>;

  // ✅ Submit new complaint
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Title and description are required");
      return;
    }

    try {
      setSubmitting(true);
      await axiosInstance.post("/complaints", { title, description });

      // reset form
      setTitle("");
      setDescription("");
      setShowForm(false);

      // refresh complaints
      fetchMyComplaints();
    } catch (err) {
      console.error(err);
      alert("Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-white to-indigo-200 font-sans">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-xl border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">User Dashboard</h1>
            <p className="text-sm text-gray-600">
              Welcome back,{" "}
              <span className="font-medium capitalize">
                {user.fullname}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="px-4 py-2 flex items-center text-sm font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4 mr-1" />
              {showForm ? "Close" : "New Complaint"}
            </button>

            <button
              onClick={() => navigate("/user/profile")}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Profile"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* ✅ STATS SECTION */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 shadow">
            <p className="text-xs text-blue-600">Active</p>
            <p className="text-2xl font-bold text-blue-700">{active}</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 shadow">
            <p className="text-xs text-green-600">Resolved</p>
            <p className="text-2xl font-bold text-green-700">{resolved}</p>
          </div>
        </section>

        {/* ✅ NEW COMPLAINT FORM */}
        {showForm && (
          <div className="bg-white border rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">New Complaint</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  className="w-full border p-2 rounded mt-1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Complaint title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full border p-2 rounded mt-1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your issue..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </form>
          </div>
        )}

        {/* ✅ COMPLAINT LIST */}
        <section>
          <h2 className="text-lg font-semibold mb-4">My Complaints</h2>

          {loading ? (
            <p>Loading...</p>
          ) : complaints.length === 0 ? (
            <div className="bg-white p-8 rounded shadow text-center">
              <FileText className="mx-auto h-10 w-10 text-gray-300 mb-2" />
              <p className="text-gray-500">
                You haven’t raised any complaints yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {complaints.map((c) => (
                <div
                  key={c._id}
                  onClick={() => navigate(`/complaints/${c._id}`)}
                  className="bg-white p-5 rounded-xl shadow cursor-pointer hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {c.title}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                      {c.status || "open"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
