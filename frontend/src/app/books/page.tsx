'use client';
import styles from "./page.module.scss";
import Image from 'next/image';
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiGet } from "@/utils/api";
import { snakeToCamel } from "@/utils/caseHelpers";
import { formatYearMonth } from "@/utils/dateHelpers";
import AddBookModal from "@/components/books/AddBookModal";
import DeleteBookModal from "@/components/books/DeleteBookModal";

type Book = {
  id?: number;
  title: string;
  author: string;
  review: string;
  rating: number;
  readDate: string;
};

export default function BooksPage() {
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Extract all unique years from books
  const years = Array.from(
    new Set(books.map((b) => (b.readDate ? new Date(b.readDate).getFullYear() : null)))
  )
    .filter(Boolean) as number[];

  const fetchBooks = async () => {
    try {
      const data: Book[] = await apiGet("/books");
      const camelBooks = snakeToCamel<Book[]>(data);

      setBooks(
        camelBooks.map((b) => ({
          ...b,
          readDate: b.readDate ? formatYearMonth(b.readDate) : "",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch books", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Frontend filtering
  const filteredBooks = selectedYear
    ? books.filter((b) => new Date(b.readDate).getFullYear() === selectedYear)
    : books;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Bøker jeg har lest</h1>

      {/* Year filter */}
      <div className={styles.filterBar}>
        <div className={styles.filters}>
          <strong>År</strong>
          <button
            onClick={() => setSelectedYear(null)}
            className={!selectedYear ? styles.active : ""}
          >
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

      {/* Book cards */}
      <div className={styles.cardsContainer}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, idx) => (
            <div key={idx} className={styles.card}>
              <h2 className={styles.bookTitle}>{book.title}</h2>
              <p className={styles.bookAuthor}>skrevet av {book.author}</p>
              <p className={styles.review}>{book.review}</p>
              <div className={styles.rating}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Image
                    key={i}
                    src="/images/cutepepe.png"
                    alt="rating"
                    width={26}
                    height={26}
                    className={i < book.rating ? styles.filledIcon : styles.emptyIcon}
                  />
                ))}
              </div>
              <p className={styles.readDate}>{book.readDate}</p>
            </div>
          ))
        ) : (
          <p>Ingen bøker funnet.</p>
        )}
      </div>

      {isAdmin && (
        <div className={styles.adminButtons}>
          <button onClick={() => setShowAddModal(true)}>Legg til en bok</button>
          <button onClick={() => setShowDeleteModal(true)}>Slett en bok</button>
        </div>
      )}

      <AddBookModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onBookAdded={fetchBooks}
      />

      <DeleteBookModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onBookDeleted={fetchBooks}
      />
    </div>
  );
}

