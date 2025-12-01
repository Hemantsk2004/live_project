import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function CommentBox({ complaintId, comments }) {
  const [text, setText] = useState("");

  const send = async () => {
    await axiosInstance.post(`/complaints/${complaintId}/comment`, {
      message: text,
    });
    window.location.reload();
  };

  return (
    <div className="mt-4">
      {comments.map((c, i) => (
        <p key={i} className="text-sm mb-1">
          <b>{c.senderRole}:</b> {c.message}
        </p>
      ))}

      <textarea
        className="border w-full p-2 mt-2"
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={send} className="mt-2 bg-green-600 text-white px-3 py-1 rounded">
        Reply
      </button>
    </div>
  );
}
