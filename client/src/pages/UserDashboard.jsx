// client/src/pages/UserDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { FileText, User, Plus } from "lucide-react";
import AuthContext from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const { user, logoutUser } = useContext(AuthContext);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state for form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

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

  if (!user) return <p className="p-6">Loading...</p>;

  // ✅ Handle complaint submit
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

      // refresh list
      fetchMyComplaints();
    } catch (err) {
      console.error(err);
      alert("Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      {/* HEADER */}
      <header className="bg-white border-b shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">User Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {user.fullname}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="px-4 py-2 flex items-center text-sm font-semibold rounded bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              {showForm ? "Close" : "New Complaint"}
            </button>

            <button
              onClick={logoutUser}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* ✅ INLINE COMPLAINT FORM */}
        {showForm && (
          <div className="bg-white border rounded shadow p-6">
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
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  rows={4}
                  className="w-full border p-2 rounded mt-1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your issue..."
                />
              </div>

              <button
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </form>
          </div>
        )}

        {/* COMPLAINT LIST */}
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
            <div className="space-y-4">
              {complaints.map((c) => (
                <div
                  key={c._id}
                  onClick={() => navigate(`/complaints/${c._id}`)}
                  className="bg-white p-4 rounded shadow border cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{c.title}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                      {c.status || "open"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
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
