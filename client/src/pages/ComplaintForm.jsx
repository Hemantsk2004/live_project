// client/src/components/ComplaintForm.jsx
import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { X } from "lucide-react";

export default function ComplaintForm({ visible, onSuccess, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ IMPORTANT: control visibility
  if (!visible) return null;

  const submitComplaint = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/complaints", { title, description });

      setTitle("");
      setDescription("");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded shadow p-6 relative">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4">New Complaint</h2>

        <form onSubmit={submitComplaint} className="space-y-4">
          <input
            placeholder="Title"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            rows={4}
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}
