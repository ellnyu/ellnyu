"use client";

import { useState } from "react";
import styles from "./AddRecipesForm.module.scss";
import { authPost } from "@/utils/api";
import { camelToSnake } from "@/utils/caseHelpers";
import Modal from "@/components/modal/Modal";

type NewImage = {
  url: string;
  position: number;
};

type AddRecipesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRecipeAdded: () => void;
};

export default function AddRecipe({ isOpen, onClose, onRecipeAdded }: AddRecipesModalProps) {
  const [name, setName] = useState("");
  const [recipeURL, setRecipeURL] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [images, setImages] = useState<NewImage[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setRecipeURL("");
    setTags([]);
    setCategory("");
    setImages([]);
    setImageUrl("");
  };

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;
    setImages([...images, { url: imageUrl, position: 0 }]);
    setImageUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        recipeURL,
        tags,
        category,
        images,
    };

      await authPost("/recipes", payload);

      onRecipeAdded();   // refresh list in parent
      resetForm();     // clear fields
      onClose();       // close modal
    } catch (err) {
      console.error("Failed to create blog post", err);
      alert("Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Legg til oppskrift</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Link til oppskrift (hvis du har)</label>
        <input
          type="text"
          value={recipeURL}
          onChange={(e) => setRecipeURL(e.target.value)}
          required
        />

        <label>Tags (separert med komma)</label>
        <input
          type="text"
          value={tags.join(", ")}
          onChange={(e) =>
            setTags(e.target.value.split(",").map((t) => t.trim()))
          }
        />

        <label>Kategori</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <label>Legg til bilde URL</label>
        <div className={styles.imageInput}>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <button type="button" onClick={handleAddImage}>
            Add Image
          </button>
        </div>

        {images.length > 0 && (
          <ul>
            {images.map((img, idx) => (
              <li key={img.url + idx}>
                {img.url} (pos {img.position})
              </li>
            ))}
          </ul>
        )}

        <div className={styles.buttons}>
          <button type="submit" disabled={loading}>
            {loading ? "Legger til..." : "Legg til oppskrift"}
          </button>
          <button type="button" onClick={onClose}>Kanseller</button>
        </div>
      </form>
    </Modal>
  );
}
