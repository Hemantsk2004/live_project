import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const fetchComplaint = async () => {
    try {
      const res = await axiosInstance.get(`/complaints/${id}`);
      setComplaint(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load complaint");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const addComment = async () => {
    if (!comment.trim()) return;

    try {
      setSending(true);

      await axiosInstance.post(`/complaints/${id}/comment`, {
        message: comment,
      });

      setComment("");
      fetchComplaint();
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p className="p-6">Loading complaint...</p>;
  if (!complaint) return <p className="p-6">Complaint not found</p>;

  const statusClass = {
    open: "bg-blue-100 text-blue-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-gray-200 text-gray-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between">
          <h1 className="text-lg font-semibold">Complaint Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:underline"
          >
            Back
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* COMPLAINT */}
        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold">{complaint.title}</h2>
            <span
              className={`text-xs px-2 py-1 rounded font-medium ${
                statusClass[complaint.status || "open"]
              }`}
            >
              {complaint.status || "open"}
            </span>
          </div>

          <p className="text-gray-700 mt-3">{complaint.description}</p>

          <p className="text-xs text-gray-500 mt-4">
            Raised by{" "}
            <span className="font-medium">
              {complaint.user?.fullname || "Unknown"}
            </span>
          </p>

          {/* ATTACHMENTS */}
          {complaint.attachments?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">Attachments</h3>
              <div className="space-y-1">
                {complaint.attachments.map((file, i) => (
                  <a
                    key={i}
                    href={`http://localhost:5000/${file.path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm text-blue-600 underline"
                  >
                    {file.filename}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COMMENTS */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Comments</h3>

          {complaint.comments?.length === 0 ? (
            <p className="text-gray-500 text-sm">No comments yet</p>
          ) : (
            <div className="space-y-3">
              {complaint.comments.map((c, index) => (
                <div
                  key={index}
                  className={`border rounded p-3 ${
                    c.senderRole === "admin"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <p className="text-sm text-gray-800">{c.message}</p>
                  <p className="text-xs mt-1 font-medium text-gray-600">
                    {c.senderRole === "admin" ? "Admin" : "User"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ADD COMMENT */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">
            Add Comment ({user.role})
          </h3>

          {complaint.status === "closed" && (
            <p className="text-sm text-red-500 mb-2">
              This complaint is closed. No further comments allowed.
            </p>
          )}

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full border rounded p-2 text-sm"
            placeholder="Write your comment..."
            disabled={complaint.status === "closed"}
          />

          <button
            onClick={addComment}
            disabled={sending || complaint.status === "closed"}
            className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded disabled:opacity-60"
          >
            {sending ? "Sending..." : "Post Comment"}
          </button>
        </div>
      </main>
    </div>
  );
}
