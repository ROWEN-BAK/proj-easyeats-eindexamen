import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMealById } from "../api/mealdb.js"; // <-- jouw functie importeren

function RecipeDetail({ recipeId: propId }) {
  const { id: routeId } = useParams();
  const recipeId = propId || routeId;

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  // INGREDIENTS + MEASURES uit TheMealDB dynamisch ophalen
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ing && ing.trim() !== "") {
      ingredients.push(`${measure} ${ing}`);
    }
  }

  return (
    <div style={{ maxWidth: "750px", margin: "0 auto", padding: "20px" }}>
      <h1>{meal.strMeal}</h1>

      {meal.strMealThumb && (
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          style={{ width: "100%", borderRadius: "10px", marginBottom: "20px" }}
        />
      )}

      <h2>Categorie</h2>
      <p>{meal.strCategory}</p>

      <h2>Herkomst</h2>
      <p>{meal.strArea}</p>

      <h2>Ingrediënten</h2>
      <ul>
        {ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h2>Bereidingswijze</h2>
      <p style={{ whiteSpace: "pre-line" }}>{meal.strInstructions}</p>

      {meal.strYoutube && (
        <>
          <h2>Video</h2>
          <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer">
            Bekijk op YouTube
          </a>
        </>
      )}
    </div>
  );
}

export default RecipeDetail;