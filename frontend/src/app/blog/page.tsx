"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";
import Link from "next/link";
import AddBlogPostForm from "@/components/blog/AddBlogPostForm"; 
import { apiGet } from "@/utils/api";
import { snakeToCamel } from "@/utils/caseHelpers";
import { useAuth } from "@/context/AuthContext";

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  year: number;
  tags: string[];
  category: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = useAuth();

  const fetchPosts = async () => {
    try {
        const data: BlogPost[] = await apiGet("/blog");
        const camelPosts = snakeToCamel<BlogPost[]>(data);
          setPosts(data ?? []);
    } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Could not load posts.");
        setPosts([]); // fallback to empty array

    } finally {
        setLoading(false);
      }

  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const tags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));
  const years = Array.from(new Set(posts.map((p) => p.year))).sort((a, b) => b - a);

  const filteredPosts = posts.filter((post) => {
    const tagMatch = selectedTag ? post.tags?.includes(selectedTag) : true;
    const yearMatch = selectedYear ? post.year === selectedYear : true;
    return tagMatch && yearMatch;
  });

  return (
    <div className={styles.blog}>
      {isAdmin && (
      <>
        <button onClick={() => setIsModalOpen(true)}>+ New Blog Post</button>
        <AddBlogPostForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPostAdded={fetchPosts} // call your fetch to refresh list
        />
      </>
    )}

      {/* Navigation bar for filtering */}
      <div className={styles.filterBar}>
        <div className={styles.filters}>
          <strong>Tagger</strong>
          <button onClick={() => setSelectedTag(null)} className={!selectedTag ? styles.active : ""}>
            All
          </button>
          {tags.map((tag, idx) => (
            <button
              key={`${tag}-${idx}`}
              onClick={() => setSelectedTag(tag)}
              className={selectedTag === tag ? styles.active : ""}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className={styles.filters}>
          <strong>År</strong>
          <button onClick={() => setSelectedYear(null)} className={!selectedYear ? styles.active : ""}>
            Alle
          </button>

          {years.map((year, idx) => (
            <button
              key={`${year}-${idx}`}
              onClick={() => setSelectedYear(year)}
              className={selectedYear === year ? styles.active : ""}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Blog cards */}
      <div className={styles.cards}>
        {loading && <p>Loading posts...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && filteredPosts.length === 0 && <p>No posts found.</p>}
        {filteredPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`}>
            <div className={styles.card}>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <div className={styles.meta}>
                <span>{post.year}</span>
                <span>{post.tags?.join(", ") || "No tags"}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

