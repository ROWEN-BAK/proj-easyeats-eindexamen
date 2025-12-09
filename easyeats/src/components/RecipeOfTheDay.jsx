import { useEffect, useState, useMemo } from "react";
import { getRecipeOfTheDay } from "../utils/recipeOfTheDay";
import "../styles/RecipeOfTheDay.css";

export default function RecipeOfTheDay({ onClick }) {
  const [recipe, setRecipe] = useState(null);
  const [dailyTime, setDailyTime] = useState(null);
  const [dailyPeople, setDailyPeople] = useState(null);

  // Load recipe
  useEffect(() => {
    getRecipeOfTheDay().then((meal) => {
      setRecipe(meal);
    });
  }, []);

  // 🔥 Check or generate daily random values
  useEffect(() => {
    const today = new Date().toDateString();

    const saved = JSON.parse(localStorage.getItem("recipeOfDayRandom"));

    if (saved && saved.date === today) {
      // ✅ Use stored values
      setDailyTime(saved.time);
      setDailyPeople(saved.people);
    } else {
      // ❌ Generate NEW values for today
      const newTime = Math.floor(Math.random() * (90 - 15 + 1)) + 15;   // 15–90 min
      const newPeople = Math.floor(Math.random() * 6) + 1;              // 1–6 people

      const data = {
        date: today,
        time: newTime,
        people: newPeople,
      };

      localStorage.setItem("recipeOfDayRandom", JSON.stringify(data));

      setDailyTime(newTime);
      setDailyPeople(newPeople);
    }
  }, []);

  // Auto description
  const dishDescription = useMemo(() => {
    if (!recipe) return "";
    const area = recipe.strArea || "Unknown origin";
    const category = recipe.strCategory || "Dish";

    return `A delicious ${category.toLowerCase()} from ${area}, known for its rich flavors and popularity around the world.`;
  }, [recipe]);

  if (!recipe || dailyTime === null || dailyPeople === null)
    return <p className="loading-text">Loading recipe of the day...</p>;

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

        <p className="rot-description">{dishDescription}</p>

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
  );
}
