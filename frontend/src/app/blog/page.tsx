"use client";

import { useState } from "react";
import styles from "./page.module.scss";

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  year: number;
  tags: string[];
};

const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: "Hvorfor jeg hater styling",
    excerpt: "Jeg klarer ikke å style shit så derfor fikk jeg chat til å gjøre det.",
    year: 2025,
    tags: ["frontend", "css"],
  },
  {
    id: 2,
    title: "Hvorfor jeg ikke klarer Go",
    excerpt: "Cuz I can't Go get em heh",
    year: 2025,
    tags: ["backend", "go"],
  },
  {
    id: 3,
    title: "Første post",
    excerpt: "Dette er starten og slutten. Og ja, jeg har hardkodet disse for nå, jeg må lage interface for å skrive ting og det ooorker jeg ikke atm.",
    year: 2024,
    tags: ["misc"],
  },
];

export default function BlogPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const tags = Array.from(new Set(mockPosts.flatMap((p) => p.tags)));
  const years = Array.from(new Set(mockPosts.map((p) => p.year))).sort((a, b) => b - a);

  const filteredPosts = mockPosts.filter((post) => {
    const tagMatch = selectedTag ? post.tags.includes(selectedTag) : true;
    const yearMatch = selectedYear ? post.year === selectedYear : true;
    return tagMatch && yearMatch;
  });

  return (
    <div className={styles.blog}>
      {/* Navigation bar for filtering */}
      <div className={styles.filterBar}>
        <div className={styles.filters}>
          <strong>Tagger</strong>
          <button onClick={() => setSelectedTag(null)} className={!selectedTag ? styles.active : ""}>
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
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
          {years.map((year) => (
            <button
              key={year}
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
        {filteredPosts.map((post) => (
          <div key={post.id} className={styles.card}>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <div className={styles.meta}>
              <span>{post.year}</span>
              <span>{post.tags.join(", ")}</span>
            </div>
          </div>
        ))}
        {filteredPosts.length === 0 && <p>No posts found.</p>}
      </div>
    </div>
  );
}

