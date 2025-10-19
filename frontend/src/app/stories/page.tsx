"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";
import { apiGet } from "@/utils/api";
import { snakeToCamel } from "@/utils/caseHelpers";

type Story = {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  local_path: string;
  timestamp: string;
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

  const years = Array.from(
    new Set(stories.map((s) => new Date(s.timestamp).getFullYear()))
  ).sort((a, b) => b - a);

  const filteredStories = stories.filter((story) => {
    const d = new Date(story.timestamp);
    const year = d.getFullYear();
    const month = d.getMonth();

    const yearMatch = selectedYear ? year === selectedYear : true;
    const monthMatch =
      selectedMonth !== null ? month === selectedMonth : true;

    return yearMatch && monthMatch;
  });

  // Group by date string
  const storiesByDate = filteredStories.reduce((acc, story) => {
    const dateStr = new Date(story.timestamp).toLocaleDateString("no-NO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(story);
    return acc;
  }, {} as Record<string, Story[]>);

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
                setSelectedMonth(null);
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

      {/* Story feed grouped by date */}
      <div className={styles.cards}>
        {loading && <p>Laster stories…</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && filteredStories.length === 0 && (
          <p>Ingen stories funnet.</p>
        )}

        {Object.entries(storiesByDate).map(([date, stories]) => (
          <div key={date}>
            <h2 className={styles.storyDateHeader}>{date}</h2>
            {stories.map((story) => (
              <div key={story.id} className={styles.card}>
                <div className={styles.mediaWrapper}>
                  {story.mediaType === "IMAGE" ||
                  story.mediaType === "CAROUSEL_ALBUM" ? (
                    <img
                      src={story.localPath}
                      alt={story.caption || "Instagram story"}
                      className={styles.storyImage}
                      loading="lazy"
                    />
                  ) : story.mediaType === "VIDEO" ? (
                    <video
                      controls
                      playsInline
                      muted
                      preload="metadata"
                      className={styles.storyVideo}
                    >
                      <source src={story.localPath} type="video/mp4" />
                      Din nettleser støtter ikke video.
                    </video>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

