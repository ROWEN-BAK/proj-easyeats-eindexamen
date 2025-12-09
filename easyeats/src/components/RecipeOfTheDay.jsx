import { useEffect, useState, useMemo } from "react";
import { getRecipeOfTheDay } from "../utils/recipeOfTheDay";
import "./RecipeOfTheDay.css";

export default function RecipeOfTheDay({ onClick }) {
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    getRecipeOfTheDay().then((meal) => {
      setRecipe(meal);
    });
  }, []);

  // Generate a short natural description of the dish
  const dishDescription = useMemo(() => {
    if (!recipe) return "";

    const area = recipe.strArea || "Unknown origin";
    const category = recipe.strCategory || "Dish";
    const name = recipe.strMeal;

    return `A delicious ${category.toLowerCase()} from ${area}, known for its flavorful preparation and popularity.`;
  }, [recipe]);

  if (!recipe) return <p className="loading-text">Loading recipe of the day...</p>;

  return (
    <div className="rot-card">
      <div className="rot-image-wrapper">
        <img src={recipe.strMealThumb} alt={recipe.strMeal} className="rot-image" />
      </div>

      <div className="rot-content">
        <div className="rot-header">
          <h2 className="rot-title">Recipe of the Day</h2>
          <span className="rot-badge">⭐ Recommended</span>
        </div>

        <h3 className="rot-name">{recipe.strMeal}</h3>

        {/* NEW auto-generated description */}
        <p className="rot-description">
          {dishDescription}
        </p>

        <div className="rot-info">
          <span>⏱️ 30 min</span> {/* Placeholder */}
          <span>👥 4 people</span> {/* Placeholder */}
        </div>

        <div className="rot-actions">
          <button
            className="rot-button"
            onClick={() => onClick?.(recipe.idMeal)}
          >
            View Recipe
          </button>

          <button className="rot-heart">♡</button>
        </div>
      </div>
    </div>
  );
}
