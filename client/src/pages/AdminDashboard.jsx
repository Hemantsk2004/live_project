import React, { useContext, useEffect, useState } from "react";
import { FileText } from "lucide-react";
import AuthContext from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

export default function AdminDashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ Fetch complaints
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

  if (!user) return <p className="p-6">Loading...</p>;

  // ✅ Apply filter
  const filteredComplaints =
    statusFilter === "all"
      ? complaints
      : complaints.filter((c) => (c.status || "open") === statusFilter);

  // ✅ Status badge color
  const statusStyle = {
    open: "bg-blue-100 text-blue-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-gray-200 text-gray-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HEADER */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome, {user.fullname}
            </p>
          </div>

          <button
            onClick={logoutUser}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* ✅ STATUS FILTERS */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-1.5 rounded text-sm font-medium border ${
                statusFilter === filter.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* ✅ COMPLAINT LIST */}
        {loading ? (
          <p>Loading complaints...</p>
        ) : filteredComplaints.length === 0 ? (
          <div className="bg-white p-10 rounded shadow text-center">
            <FileText className="mx-auto h-10 w-10 text-gray-300 mb-2" />
            <p className="text-gray-500">
              No complaints found for this status.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((c) => (
              <div
                key={c._id}
                onClick={() => navigate(`/complaints/${c._id}`)}
                className="bg-white p-4 rounded shadow border cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{c.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      statusStyle[c.status || "open"]
                    }`}
                  >
                    {c.status || "open"}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                  {c.description}
                </p>

                <div className="text-xs text-gray-500 mt-3">
                  Raised by{" "}
                  <span className="font-medium">
                    {c.user?.fullname || "Unknown"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
