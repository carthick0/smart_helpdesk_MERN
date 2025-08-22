import React, { useState } from "react";
import { useAuth } from "../context/useAuth";

export default function KBEditor({ article = {}, onSuccess, onCancel }) {
  const isEdit = !!article._id;
  const { token } = useAuth();
  const [title, setTitle] = useState(article.title || "");
  const [body, setBody] = useState(article.body || "");
  const [tags, setTags] = useState(article.tags ? article.tags.join(",") : "");
  const [status, setStatus] = useState(article.status || "published");
  const [error, setError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `${backendUrl}/api/kb/${article._id}`
      : `${backendUrl}/api/kb`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        body,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        status,
      }),
    });

    if (!res.ok) {
      setError("Save failed");
    } else {
      onSuccess(
        isEdit
          ? "✅ Article updated successfully."
          : "✅ Article created successfully."
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 border bg-white rounded">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">
          {isEdit ? "Edit" : "Add"} KB Article
        </h2>
        <div>
          <label className="block font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
            rows={6}
          />
        </div>
        <div>
          <label className="block font-medium">Tags (comma-separated)</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            {isEdit ? "Save" : "Create"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}
