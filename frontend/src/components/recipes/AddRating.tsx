"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/modal/Modal";
import styles from "./AddRating.module.scss";
import { apiPost } from "@/utils/api";
import Rating from "@/components/rating/Rating";
import { toIsoDateTime } from "@/utils/dateHelpers";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  recipeId: number;
  recipeName: string;
  recipeRating?: number;   // ✅ add this
  recipeTriedDate?: string; // ✅ add this
  onUpdated: () => void;
};

export default function AddRatingModal({ isOpen, onClose, recipeId, recipeName, recipeRating, recipeTriedDate, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);
  const [triedDate, setTriedDate] = useState(recipeTriedDate ?? "");
  const [rating, setRating] = useState<number>(recipeRating ?? 0);
  useEffect(() => {
    setTriedDate(recipeTriedDate ?? "");
    setRating(recipeRating ?? 0);
  }, [recipeTriedDate, recipeRating]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiPost("/recipes/rating", {
        id: recipeId,
        rating,
        triedDate: triedDate ? new Date(triedDate).toISOString() : null,
      });

      onUpdated();
      onClose();
    } catch (err) {
      console.error("Failed to update recipe", err);
      alert("Kunne ikke lagre endringer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Oppdater {recipeName}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Prøvd dato</label>
        <input
          type="date"
          value={triedDate}
          onChange={(e) => setTriedDate(e.target.value)}
        />

        <label>Rating</label>
        <div className={styles.rating}>
          <Rating initialRating={rating} ratingIcon={"/images/star_cute.png"} onChange={(r) => setRating(r)} />
        </div>

        <div className={styles.buttons}>
          <button type="submit" disabled={loading}>
            {loading ? "Lagrer..." : "Lagre"}
          </button>
          <button type="button" onClick={onClose}>
            Avbryt
          </button>
        </div>
      </form>
    </Modal>
  );
}

