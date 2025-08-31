'use client';
import { useState } from "react";
import Modal from "@/components/modal/Modal"; // <-- generic overlay modal
import Rating from "@/components/rating/Rating";
import { authPost } from "@/utils/api";
import styles from "./AddBookModal.module.scss";
import { camelToSnake } from "@/utils/caseHelpers";
import { toIsoDateTime } from "@/utils/dateHelpers";

type AddBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded: () => void;
};

export default function AddBookModal({ isOpen, onClose, onBookAdded }: AddBookModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [readDate, setReadDate] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setReview("");
    setRating(1);
    setReadDate("");
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const payload = camelToSnake({
      title,
      author,
      readDate: toIsoDateTime(readDate), // convert to SQL-friendly format
      review,
      rating,
    });

    console.log("Submitting payload:", payload);

    await authPost("/books", payload);

    onBookAdded();   // refresh list
    resetForm();     // clear fields
    onClose();       // close modal
  } catch (err) {
    console.error("Failed to add book", err);
  }
};

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Legg til en bok</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Tittel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Forfatter"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          type="month"
          placeholder="Lesedato"
          value={readDate}
          onChange={(e) => setReadDate(e.target.value)}
        />
        <textarea
          placeholder="Anmeldelse"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <div>
          <p>Rating:</p>
          <Rating initialRating={rating} onChange={(r) => setRating(r)} />
        </div>
        <div className={styles.buttons}>
          <button type="submit">Legg til</button>
          <button type="button" onClick={onClose}>Avbryt</button>
        </div>
      </form>
    </Modal>
  );
}

