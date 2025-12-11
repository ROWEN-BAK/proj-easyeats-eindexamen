import { useEffect, useState } from "react";
import { getRecipeOfTheDay } from "../utils/recipeOfTheDay";
import "../styles/RecipeOfTheDay.css";

export default function RecipeOfTheDay({ onClick }) {
  const [recipe, setRecipe] = useState(null);
  const [dailyTime, setDailyTime] = useState(null);
  const [dailyPeople, setDailyPeople] = useState(null);

  useEffect(() => {
    getRecipeOfTheDay().then((meal) => setRecipe(meal));
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem("recipeOfDayRandom"));

    if (saved && saved.date === today) {
      setDailyTime(saved.time);
      setDailyPeople(saved.people);
    } else {
      const newTime = Math.floor(Math.random() * (90 - 15 + 1)) + 15;
      const newPeople = Math.floor(Math.random() * 6) + 1;
      const data = { date: today, time: newTime, people: newPeople };

      localStorage.setItem("recipeOfDayRandom", JSON.stringify(data));
      setDailyTime(newTime);
      setDailyPeople(newPeople);
    }
  }, []);

  if (!recipe || dailyTime === null || dailyPeople === null)
    return <p className="loading-text">Loading recipe of the day...</p>;

  return (
    <div className="rot-card">

      {/* TOP */}
      <div className="rot-top">
        <div>
          <h2 className="rot-title">Recipe of the Day</h2>
          <p className="rot-subtitle">Specially selected for you</p>
        </div>
        <span className="rot-badge">⭐ Recommended</span>
      </div>

      
      <div className="rot-main">
        <div className="rot-image-wrapper">
          <img src={recipe.strMealThumb} alt={recipe.strMeal} className="rot-image" />
        </div>

        <div className="rot-content">
          <h3 className="rot-name">{recipe.strMeal}</h3>

          
          <p className="rot-description">
            {recipe.strCategory} • {recipe.strArea}
          </p>

          <div className="rot-info">
            <span>⏱️ {dailyTime} min</span>
            <span>👥 {dailyPeople} people</span>
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
    </div>
  );
}
