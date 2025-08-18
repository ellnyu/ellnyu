'use client';
import { useState, useEffect } from "react";
import Modal from "@/components/modal/Modal";
import { apiGet, authDelete } from "@/utils/api";
import styles from "./DeleteBookModal.module.scss";

type Book = {
  id: number;
  title: string;
  author: string;
};

type DeleteBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onBookDeleted: () => void;
};

export default function DeleteBookModal({ isOpen, onClose, onBookDeleted }: DeleteBookModalProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchBooks = async () => {
      try {
        const data = await apiGet<Book[]>("/books");
        setBooks(data);
        if (data.length > 0) setSelectedBookId(data[0].id);
      } catch (err) {
        console.error("Failed to fetch books", err);
      }
    };

    fetchBooks();
  }, [isOpen]);

  const handleDelete = async () => {
    if (selectedBookId === null) return;

    const selectedBook = books.find((b) => b.id === selectedBookId);
    if (!selectedBook) return;

    setLoading(true);
    try {
      await authDelete("/books/delete", {
        title: selectedBook.title,
        author: selectedBook.author,
      });
      onBookDeleted(); // refresh books list
      onClose();
    } catch (err) {
      console.error("Failed to delete book", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Slett en bok</h2>
      {books.length === 0 ? (
        <p>Ingen bøker å slette.</p>
      ) : (
        <div className={styles.form}>
          <label htmlFor="bookSelect">Velg en bok:</label>
          <select
            id="bookSelect"
            value={selectedBookId ?? ""}
            onChange={(e) => setSelectedBookId(Number(e.target.value))}
          >
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} - {book.author}
              </option>
            ))}
          </select>
          <div className={styles.buttons}>
            <button onClick={handleDelete} disabled={loading}>
              {loading ? "Sletter..." : "Slett"}
            </button>
            <button onClick={onClose}>Avbryt</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

