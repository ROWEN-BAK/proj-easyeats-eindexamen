import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMealById } from "../api/mealdb.js";
import "../styles/DetailRecipe.css";

function RecipeDetail({ recipeId: propId }) {
  const { id: routeId } = useParams();
  const recipeId = propId || routeId;

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const customRecipe = storedRecipes.find((r) => r.id === recipeId);

    if (customRecipe) {
      setMeal(customRecipe);
      setLoading(false);
      return;
    }

    async function fetchMeal() {
      try {
        const data = await getMealById(recipeId);
        if (!data) throw new Error("Geen maaltijd gevonden");
        setMeal(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMeal();
  }, [recipeId]);

  if (loading) return <p>Recept wordt geladen...</p>;
  if (error) return <p>Er ging iets mis: {error}</p>;
  if (!meal) return <p>Geen recept gevonden.</p>;

  const isCustom = meal.ingredients && Array.isArray(meal.ingredients);

  let ingredients = [];

  if (isCustom) {
    ingredients = meal.ingredients.map((i) => `${i.amount} ${i.name}`);
  } else {
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ing && ing.trim() !== "") {
        ingredients.push(`${measure} ${ing}`);
      }
    }
  }

  return (
    <div className="detail-wrapper">
      <h1>{meal.name || meal.strMeal}</h1>

      {(meal.image || meal.strMealThumb) && (
        <img
          src={meal.image || meal.strMealThumb}
          alt={meal.name || meal.strMeal}
          className="detail-image"
        />
      )}

      <h2>Category</h2>
      <p>{meal.category || meal.strCategory}</p>

      <h2>Country of origin</h2>
      <p>{meal.area || meal.strArea || "Unknown"}</p>

      <h2>Ingredients</h2>
      <ul>
        {ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h2>Instructions</h2>
      {isCustom ? (
        <ul>
          {meal.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      ) : (
        <p style={{ whiteSpace: "pre-line" }}>{meal.strInstructions}</p>
      )}

      {meal.strYoutube && (
        <>
          <h2>Video</h2>
          <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer">
            Watch on YouTube
          </a>
        </>
      )}
    </div>
  );
}

export default RecipeDetail;
