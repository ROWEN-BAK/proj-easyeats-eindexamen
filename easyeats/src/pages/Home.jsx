import { useEffect, useState } from "react";
import ReciptCard from "../components/ReciptCard";
import { getRandomMeals } from "../api/mealdb";

export default function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getRandomMeals(1).then((meals) => {
      setRecipes(meals);
    });
  }, []);

  function handleCardClick(id) {
    console.log("Clicked recipe:", id);
  }

  return (
    <div className="home-container">
      <h1 className="home-title">EasyEats Recipes</h1>

      <div className="cards-container">
        {recipes.map((recipe) => (
          <ReciptCard
            key={recipe.idMeal}
            recipe={recipe}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
}
