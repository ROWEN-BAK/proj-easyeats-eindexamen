import { useEffect, useState } from "react";
import ReciptCard from "../components/ReciptCard";
import RecipeOfTheDay from "../components/RecipeOfTheDay";
import { getRandomMeals } from "../api/mealdb";

// ⬅️ VERY IMPORTANT: make sure this path matches your project
import "./Home.css";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecipes(8);
  }, []);

 const loadRecipes = async (count) => {
  setLoading(true);
  const newMeals = await getRandomMeals(count);

  setRecipes((prev) => {
    const existingIds = new Set(prev.map((meal) => meal.idMeal));

    const filtered = newMeals.filter(
      (meal) => !existingIds.has(meal.idMeal)
    );

    return [...prev, ...filtered];
  });

  setLoading(false);
};

  function handleCardClick(id) {
    console.log("Clicked recipe:", id);
  }

  return (
    <div className="home-container">
      <RecipeOfTheDay onClick={handleCardClick} />

      <h2 style={{ marginTop: "30px" }}>Random Recipes</h2>

      {/* ⬇️ This is the CONTAINER, not the card component */}
      <div className="cards-container">
        {recipes.map((recipe) => (
          <ReciptCard
            key={recipe.idMeal}
            recipe={recipe}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {/* ⬇️ Button that should use .load-more-btn */}
      <button
        className="load-more-btn"
        onClick={() => loadRecipes(40)}
        disabled={loading}
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
}
