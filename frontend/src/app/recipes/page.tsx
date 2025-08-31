"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import AddRecipeForm from "@/components/recipes/AddRecipesForm";
import DeleteRecipeModal from "@/components/recipes/DeleteRecipeModal";
import AddRatingModal from "@/components/recipes/AddRating";
import RandomRecipeModal from "@/components/recipes/RandomRecipeModal";
import { apiGet } from "@/utils/api";
import { snakeToCamel } from "@/utils/caseHelpers";
import { useAuth } from "@/context/AuthContext";

// Backend type
type BackendRating = { Int32: number; Valid: boolean } | null;

type BackendRecipe = {
  id?: number;
  name: string;
  recipeUrl?: string;
  rating?: BackendRating;
  triedDate?: string;
  tags?: string[];
  category?: string;
};

// Normalized frontend type
type Recipe = {
  id?: number;
  name: string;
  recipeUrl?: string;
  rating: number; // always a number
  triedDate?: string;
  tags?: string[];
  category?: string;
};

export default function RecipesPage() {
  const { isAdmin } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [randomRecipe, setRandomRecipe] = useState<Recipe | null>(null);

  const categories = Array.from(new Set(recipes.map((r) => r.category).filter(Boolean))) as string[];

  const filteredRecipes = recipes.filter((r) =>
    selectedCategory ? r.category === selectedCategory : true
  );

  const fetchRecipes = async () => {
    try {
      const data: BackendRecipe[] = await apiGet("/recipes");
      const camelRecipes = snakeToCamel<BackendRecipe[]>(data);

      const normalized: Recipe[] = camelRecipes.map((r) => ({
        ...r,
        rating: r.rating && r.rating.Valid ? r.rating.Int32 : 0,
      }));

      console.log(normalized);

      setRecipes(normalized);
    } catch (err) {
      console.error("Failed to fetch recipes", err);
      setRecipes([]);
    }
  };

  const handleRandomRecipe = () => {
  if (recipes.length === 0) return;

  const filtered = selectedCategory
    ? recipes.filter((r) => r.category === selectedCategory)
    : recipes;

  const randomIndex = Math.floor(Math.random() * filtered.length);
  setRandomRecipe(filtered[randomIndex]);
};


  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Oppskrifter</h1>

      <div className={styles.filterBar}>
        <div className={styles.filters}>
          <strong>Kategorier</strong>
          <button
            onClick={() => setSelectedCategory(null)}
            className={!selectedCategory ? styles.active : ""}
          >
            Alle
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? styles.active : ""}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleRandomRecipe} className={styles.randomButton}>
        Velg en tilfeldig oppskrift
      </button>

      <div className={styles.cardsContainer}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className={styles.card}
              onClick={() => setSelectedRecipe(recipe)}
            >
              <h2 className={styles.bookTitle}>{recipe.name}</h2>
              <p className={styles.bookAuthor}>{recipe.recipeUrl}</p>

              <div className={styles.rating}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Image
                    key={i}
                    src="/images/star_cute.png"
                    alt="rating"
                    width={26}
                    height={26}
                    className={i < recipe.rating ? styles.filledIcon : styles.emptyIcon}
                  />
                ))}
              </div>

              <p className={styles.bookAuthor}>{recipe.category}</p>
              <p className={styles.readDate}>
                {recipe.triedDate
                  ? new Date(recipe.triedDate).toLocaleDateString()
                  : "har ikke prøvd enna"}
              </p>
            </div>
          ))
        ) : (
          <p>Ingen oppskrifter funnet.</p>
        )}
      </div>

      {isAdmin && (
        <div className={styles.adminButtons}>
          <button onClick={() => setShowAddModal(true)}>Legg til en oppskrift</button>
          <button onClick={() => setShowDeleteModal(true)}>Slett en oppskrift</button>
        </div>
      )}

      <AddRecipeForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onRecipeAdded={fetchRecipes}
      />

      <DeleteRecipeModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onRecipeDeleted={fetchRecipes}
      />


      {/* Add Rating Modal */}
      {selectedRecipe && (
        <AddRatingModal
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          recipeId={selectedRecipe.id!}
          recipeName={selectedRecipe.name}
          recipeRating={selectedRecipe.rating}
          recipeTriedDate={selectedRecipe.triedDate}
          onUpdated={fetchRecipes}
        />
      )}

      {randomRecipe && (
        <RandomRecipeModal
          isOpen={!!randomRecipe}
          onClose={() => setRandomRecipe(null)}
          recipe={randomRecipe}
        />
      )}

    </div>
  );
}

