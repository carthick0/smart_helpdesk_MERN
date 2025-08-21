import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import KBEditor from "./KBeditor";

export default function KBList() {
  const { token ,logout} = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingArticle, setEditingArticle] = useState(null);

const fetchAllArticles = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/kb", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch articles");
    const articles = await res.json();
    return articles;
  } catch (err) {
    console.error(err);
    return [];
  }
};

useEffect(() => {
  async function loadArticles() {
    setLoading(true);
    setError("");
    const data = await fetchAllArticles();
    setArticles(data);
    setLoading(false);
  }
  loadArticles();
}, []);

const handleDelete = async (id) => {
  if (!window.confirm("Delete this article?")) return;
  try {
    const res = await fetch(`http://localhost:8000/api/kb/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error("Failed to delete article");
    }
    // Refresh the list after deletion
    const data = await fetchAllArticles();
    setArticles(data);
  } catch (err) {
    setError(err.message);
  }
};


  if (editingArticle)
    return (
      <KBEditor
        article={editingArticle}
        onSuccess={() => {
          setEditingArticle(null);
          fetchAllArticles();
        }}
        onCancel={() => setEditingArticle(null)}
      />
    );

  return (
    <div className="max-w-4xl mx-auto mt-8">
        <div className="flex justify-end mb-4">
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Knowledge Base Articles</h2>
        <button
          className="px-4 py-1 bg-green-700 text-white rounded"
          onClick={() => setEditingArticle({})}
        >
          + New Article
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="w-full border shadow">
          <thead>
            <tr>
              <th className="py-2 px-4">Title</th>
              <th>Tags</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((art) => (
              <tr key={art._id}>
                <td className="p-3">{art.title}</td>
                <td>{(art.tags || []).join(", ")}</td>
                <td>{art.status}</td>
                <td>
                  <button
                    onClick={() => setEditingArticle(art)}
                    className="px-2 py-1 text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(art._id)}
                    className="px-2 py-1 text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No KB articles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
