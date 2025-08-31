'use client';

import Image from "next/image";
import Modal from "@/components/modal/Modal";
import styles from "./RandomRecipeModal.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  recipe: {
    name: string;
    recipeUrl: string;
    rating: number;
    triedDate?: string;
    category?: string;
  } | null;
};

export default function RandomRecipeModal({ isOpen, onClose, recipe }: Props) {
  if (!recipe) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <h2>{recipe.name}</h2>
        <p>
          Kategori: <strong>{recipe.category ?? "Ingen"}</strong>
        </p>
        <p>
          URL:{" "}
          <a href={recipe.recipeUrl} target="_blank" rel="noopener noreferrer">
            {recipe.recipeUrl}
          </a>
        </p>
        <div className={styles.rating}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Image
              key={i}
              src="/images/star_cute.png"
              alt={`Rating ${i + 1}`}
              width={28}
              height={28}
              className={i < recipe.rating ? styles.filledIcon : styles.emptyIcon}
            />
          ))}
        </div>
        <p>
          {recipe.triedDate
            ? `Prøvd: ${new Date(recipe.triedDate).toLocaleDateString()}`
            : "Har ikke prøvd enna"}
        </p>
        <button className={styles.closeButton} onClick={onClose}>
          Lukk
        </button>
    </Modal>
  );
}

