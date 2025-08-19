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
  // Initial fetch
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Bøker jeg har lest</h1>
        <div className={styles.cardsContainer}>
  {books && books.length > 0 ? (
    books.map((book, idx) => (
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
        onBookAdded={fetchBooks} // refresh books after adding
      />

      <DeleteBookModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onBookDeleted={fetchBooks} // refresh books after deleting
      />

    </div>
  );
}

