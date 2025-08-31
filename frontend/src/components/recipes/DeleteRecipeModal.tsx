'use client';
import { useState, useEffect } from "react";
import Modal from "@/components/modal/Modal";
import { apiGet, authDelete } from "@/utils/api";
import styles from "./DeleteRecipeModal.module.scss";

type Recipe = {
  id: number;
  name: string;
};

type DeleteRecipeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRecipeDeleted: () => void;
};

export default function DeleteRecipeModal({ isOpen, onClose, onRecipeDeleted }: DeleteRecipeModalProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchRecipes = async () => {
      try {
        const data = await apiGet<Recipe[]>("/recipes");

        console.log(data);
        setRecipes(data);
        if (data.length > 0) setSelectedRecipeId(data[0].id);
      } catch (err) {
        console.error("Failed to fetch books", err);
      }
    };

    fetchRecipes();
  }, [isOpen]);

  const handleDelete = async () => {
    if (selectedRecipeId === null) return;

    const selectedRecipe = recipes.find((b) => b.id === selectedRecipeId);
    if (!selectedRecipe) return;

    setLoading(true);
    try {
      // Use recipe ID instead of name
      await authDelete("/recipes/delete", {
        id: selectedRecipe.id,
      });
      onRecipeDeleted(); // refresh list
      onClose();
    } catch (err) {
      console.error("Failed to delete recipe", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Slett en oppskrift</h2>
      {recipes.length === 0 ? (
        <p>Ingen oppskrifter å slette.</p>
      ) : (
        <div className={styles.form}>
          <label htmlFor="bookSelect">Velg en oppskrift:</label>
          <select
            id="recipeSelect"
            value={selectedRecipeId ?? ""}
            onChange={(e) => setSelectedRecipeId(Number(e.target.value))}
          >
            {recipes.map((recipe) => (
              <option key={recipe.id} value={recipe.id}>
                {recipe.name}
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


