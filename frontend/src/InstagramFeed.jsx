import React, { useEffect, useState } from "react";

export default function InstagramFeed({ cardStyle }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/instagram/posts`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
      {posts.map((post) => (
        <div key={post.id} style={cardStyle}>
          {post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM" ? (
            <img
              src={post.media_url}
              alt={post.caption || "Instagram post"}
              style={{ width: "100%", borderRadius: "8px" }}
            />
          ) : post.media_type === "VIDEO" ? (
            <video controls style={{ width: "100%", borderRadius: "8px" }}>
              <source src={post.media_url} type="video/mp4" />
            </video>
          ) : null}
          {post.caption && <p>{post.caption}</p>}
        </div>
      ))}
    </div>
  );
}

