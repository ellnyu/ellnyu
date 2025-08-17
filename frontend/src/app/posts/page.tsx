'use client';
import React from "react";
import { useInstagramPosts } from "@/hooks/useInstagramPosts";
import styles from "./page.module.scss";

const Posts: React.FC = () => {
  const { posts, loading, error } = useInstagramPosts();

  if (loading) return <p>Henter instagram posts...</p>;
  if (error) return <p>HEHEHE feeil: {error}</p>;

  return (
    <div className={styles.postsGrid}>
      {posts.map((post) => (
        <div key={post.id} className={styles.card}>
          {post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM" ? (
            <img src={post.media_url} alt={post.caption || "Instagram post"} />
          ) : post.media_type === "VIDEO" ? (
            <video controls>
              <source src={post.media_url} type="video/mp4" />
            </video>
          ) : null}
          {post.caption && <p>{post.caption}</p>}
        </div>
      ))}
    </div>
  );
};

export default Posts;


