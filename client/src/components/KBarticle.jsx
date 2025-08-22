import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function KBArticleView() {
  const { id } = useParams();
  const { token } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
   const backendUrl =import.meta.env.VITE_BACKEND_URL 
  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${backendUrl}/api/kb/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch article");
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchArticle();
  }, [backendUrl, id, token]);

  if (loading) return <p>Loading article...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!article) return <p>No article found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded bg-white">
      <h2 className="text-2xl font-semibold mb-4">{article.title}</h2>
      <p className="mb-4 text-gray-600">
        Status: <span className="font-medium">{article.status}</span> | Tags:{" "}
        {article.tags?.join(", ")}
      </p>
      <div className="prose mb-6 whitespace-pre-wrap">{article.body}</div>
      <Link
        to="/"
        className="text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
