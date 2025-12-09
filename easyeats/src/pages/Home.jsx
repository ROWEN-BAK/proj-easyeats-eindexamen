import { useEffect, useState } from "react";
import ReciptCard from "../components/ReciptCard";
import RecipeOfTheDay from "../components/RecipeOfTheDay";
import { getRandomMeals, searchMeals } from "../api/mealdb";

import "./Home.css";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadRecipes(8);
  }, []);

  const loadRecipes = async (count) => {
    setLoading(true);
    const newMeals = await getRandomMeals(count);

    setRecipes((prev) => {
      const existingIds = new Set(prev.map((meal) => meal.idMeal));
      const filtered = newMeals.filter((meal) => !existingIds.has(meal.idMeal));
      return [...prev, ...filtered];
    });

    setLoading(false);
  };

  // ⭐ SEARCH — Fetch ALL matching recipes from API
  const handleSearch = async (value) => {
    setSearch(value);

    if (value.trim() === "") {
      // Reset to random recipes
      setRecipes([]);
      loadRecipes(8);
      return;
    }

    setLoading(true);
    const results = await searchMeals(value);
    setRecipes(results || []);
    setLoading(false);
  };

  function handleCardClick(id) {
    console.log("Clicked recipe:", id);
  }

  return (
    <div className="home-container">

      {/* TOP TITLES */}
      <h1 className="home-main-title">Discover Delicious Recipes for Every Day</h1>
      <h2 className="home-sub-title">Get inspired and save your favorites</h2>

      {/* SEARCH BAR */}
      <input
        type="text"
        className="home-search"
        placeholder="Search for a recipe..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* RECIPE OF THE DAY */}
      <RecipeOfTheDay onClick={handleCardClick} />

      <h2 style={{ marginTop: "30px" }}>Random Recipes</h2>

      <div className="cards-container">
        {recipes?.length > 0 ? (
          recipes.map((recipe) => (
            <ReciptCard
              key={recipe.idMeal}
              recipe={recipe}
              onClick={handleCardClick}
            />
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>

      {/* LOAD MORE BUTTON (hidden during search) */}
      {search === "" && (
        <button
          className="load-more-btn"
          onClick={() => loadRecipes(40)}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
