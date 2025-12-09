import { getRandomMeals } from "../api/mealdb";

export async function getRecipeOfTheDay() {
  const stored = localStorage.getItem("recipeOfTheDay");

  if (stored) {
    const data = JSON.parse(stored);
    const today = new Date().toDateString();

    if (data.date === today) {
      return data.recipe; // same recipe for today
    }
  }

  // New random recipe for a new day
  const newRecipe = (await getRandomMeals(1))[0];

  const saveData = {
    date: new Date().toDateString(),
    recipe: newRecipe,
  };

  localStorage.setItem("recipeOfTheDay", JSON.stringify(saveData));

  return newRecipe;
}
