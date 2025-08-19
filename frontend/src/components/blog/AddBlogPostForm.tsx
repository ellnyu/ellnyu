"use client";

import { useState } from "react";
import styles from "./AddBlogPostForm.module.scss";
import { authPost } from "@/utils/api";
import Modal from "@/components/modal/Modal";

type NewImage = {
  url: string;
  position: number;
};

type AddBlogPostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPostAdded: () => void;
};

export default function AddBlogPost({ isOpen, onClose, onPostAdded }: AddBlogPostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [images, setImages] = useState<NewImage[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setCategory("");
    setImages([]);
    setImageUrl("");
  };

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;
    setImages([...images, { url: imageUrl, position: content.length }]);
    setImageUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authPost("/blog", {
        title,
        content,
        tags,
        category,
        images,
      });

      onPostAdded();   // refresh list in parent
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
      <h2>Create Blog Post</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          required
        />

        <label>Tags (comma separated)</label>
        <input
          type="text"
          value={tags.join(", ")}
          onChange={(e) =>
            setTags(e.target.value.split(",").map((t) => t.trim()))
          }
        />

        <label>Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <label>Add Image URL</label>
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
            {loading ? "Saving..." : "Save Blog Post"}
          </button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

