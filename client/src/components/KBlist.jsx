import React, { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import KBEditor from "./KBeditor";

export default function KBList() {
  const { token } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [editingArticle, setEditingArticle] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchAllArticles = React.useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/api/kb`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch articles");
      const articles = await res.json();
      return articles;
    } catch (err) {
      console.error(err);
      return [];
    }
  }, [backendUrl, token]);

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      setError("");
      setInfoMessage("");
      const data = await fetchAllArticles();
      setArticles(data);
      setLoading(false);
    }
    loadArticles();
  }, [fetchAllArticles]);

  // auto clear info message after 2 sec
  useEffect(() => {
    if (infoMessage) {
      const timer = setTimeout(() => setInfoMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [infoMessage]);

  const handleDelete = async (id) => {
    setError("");
    setInfoMessage("");
    try {
      const res = await fetch(`${backendUrl}/api/kb/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Failed to delete article");
      }
      const updatedArticles = await fetchAllArticles();
      setArticles(updatedArticles);
      setInfoMessage("__DELETE_SUCCESS__"); 
    } catch (err) {
      setError(err.message);
    }
  };

  if (editingArticle)
    return (
      <KBEditor
        article={editingArticle}
        onSuccess={async (message) => {
          setEditingArticle(null);
          const updatedArticles = await fetchAllArticles();
          setArticles(updatedArticles);
          setInfoMessage(message);
        }}
        onCancel={() => {
          setEditingArticle(null);
          setInfoMessage("");
          setError("");
        }}
      />
    );

  return (
    <div className="max-w-7xl mx-auto mt-8 p-4 bg-gray-50 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Knowledge Base Articles
        </h2>
        <button
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600"
          onClick={() => {
            setEditingArticle({});
            setInfoMessage("");
            setError("");
          }}
        >
          + New Article
        </button>
      </div>

      {/* Info / Delete message */}
      {infoMessage && (
        <div
          className={`mb-4 p-3 border rounded ${
            infoMessage === "__DELETE_SUCCESS__"
              ? "bg-red-100 text-red-800 border-red-300"
              : "bg-green-100 text-green-800 border-green-300"
          }`}
        >
          {infoMessage === "__DELETE_SUCCESS__"
            ? "Article deleted successfully."
            : infoMessage}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-300 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-600 text-lg">Loading articles...</p>
      ) : articles.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No knowledge base articles found.
        </p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300 shadow-sm rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm font-semibold">
              <th className="border border-gray-300 px-6 py-3 text-left">
                Title
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left">
                Tags
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left">
                Status
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {articles.map((art) => (
              <tr
                key={art._id}
                className="hover:bg-gray-100 even:bg-gray-50 transition-colors duration-200"
              >
                <td className="border border-gray-300 px-6 py-4">
                  {art.title}
                </td>
                <td className="border border-gray-300 px-6 py-4">
                  {(art.tags || []).join(", ")}
                </td>
                <td className="border border-gray-300 px-6 py-4 capitalize">
                  {art.status}
                </td>
                <td className="border border-gray-300 px-6 py-4 space-x-3">
                  <button
                    onClick={() => {
                      setEditingArticle(art);
                      setInfoMessage("");
                      setError("");
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(art._id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
