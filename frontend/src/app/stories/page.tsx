"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";
import { apiGet } from "@/utils/api";
import { snakeToCamel } from "@/utils/caseHelpers";

type Story = {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  timestamp: string; // ISO date string
  caption?: string;
  username?: string;
};

const monthNames = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const fetchStories = async () => {
    try {
      const data: Story[] = await apiGet("/instagram/stories");
      const camelStories = snakeToCamel<Story[]>(data);
      setStories(camelStories ?? []);
    } catch (err) {
      console.error("Failed to fetch stories:", err);
      setError("Kunne ikke hente stories.");
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Extract years and months
  const years = Array.from(
    new Set(stories.map((s) => new Date(s.timestamp).getFullYear()))
  ).sort((a, b) => b - a);

  const filteredStories = stories.filter((story) => {
    const d = new Date(story.timestamp);
    const year = d.getFullYear();
    const month = d.getMonth(); // 0–11

    const yearMatch = selectedYear ? year === selectedYear : true;
    const monthMatch =
      selectedMonth !== null ? month === selectedMonth : true;

    return yearMatch && monthMatch;
  });

  return (
    <div className={styles.stories}>
      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.filters}>
          <strong>År</strong>
          <button
            onClick={() => {
              setSelectedYear(null);
              setSelectedMonth(null);
            }}
            className={!selectedYear ? styles.active : ""}
          >
            Alle
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => {
                setSelectedYear(year);
                setSelectedMonth(null); // reset month on year change
              }}
              className={selectedYear === year ? styles.active : ""}
            >
              {year}
            </button>
          ))}
        </div>

        {selectedYear && (
          <div className={styles.filters}>
            <strong>Måned</strong>
            <button
              onClick={() => setSelectedMonth(null)}
              className={selectedMonth === null ? styles.active : ""}
            >
              Alle
            </button>
            {monthNames.map((month, idx) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(idx)}
                className={selectedMonth === idx ? styles.active : ""}
              >
                {month}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Story feed */}
      <div className={styles.cards}>
        {loading && <p>Laster stories…</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && filteredStories.length === 0 && (
          <p>Ingen stories funnet.</p>
        )}

        {filteredStories.map((story) => (
          <div key={story.id} className={styles.card}>
            <div className={styles.mediaWrapper}>
              {story.media_type === "IMAGE" ||
              story.media_type === "CAROUSEL_ALBUM" ? (
                <img
                  src={story.media_url}
                  alt={story.caption || "Instagram story"}
                  className={styles.storyImage}
                />
              ) : story.media_type === "VIDEO" ? (
                <video controls className={styles.storyVideo}>
                  <source src={story.media_url} type="video/mp4" />
                </video>
              ) : null}
            </div>
            <div className={styles.meta}>
              <span>
                {new Date(story.timestamp).toLocaleDateString("no-NO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {story.username && <span>@{story.username}</span>}
            </div>
            {story.caption && (
              <p className={styles.caption}>{story.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

