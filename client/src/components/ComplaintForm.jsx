import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function ComplaintForm({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      // POST /api/complaints  (axiosInstance baseURL should already include /api)
      await axiosInstance.post("/complaints", {
        title,
        description,
        category,
      });

      // reset
      setTitle("");
      setDescription("");
      setCategory("other");

      if (onSuccess) onSuccess(); // refresh complaints on parent
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Raise a Complaint</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium block mb-1">Title</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Short issue summary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Description</label>
            <textarea
              rows={4}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Explain your issue in detail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Category</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="infrastructure">Infrastructure</option>
              <option value="academic">Academic</option>
              <option value="hostel">Hostel</option>
              <option value="transport">Transport</option>
              <option value="administration">Administration</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-sm bg-gray-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-sm bg-blue-600 text-white disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
