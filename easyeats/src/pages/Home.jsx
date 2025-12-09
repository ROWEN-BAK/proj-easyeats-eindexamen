import { useEffect, useState, useRef } from "react";
import ReciptCard from "../components/ReciptCard";
import RecipeOfTheDay from "../components/RecipeOfTheDay";
import FilterMenu from "../components/FilterMenu";

import { getRandomMeals, getMealsByCategory, searchMeals } from "../api/mealdb";

import "../styles/Home.css";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const firstRun = useRef(true);

  // Load random recipes *only once*
  useEffect(() => {
    loadRandomRecipes();
  }, []);

  const loadRandomRecipes = async () => {
    setLoading(true);
    const randomMeals = await getRandomMeals(8);
    setRecipes(randomMeals);
    setLoading(false);
  };

  // Filter logic
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return; // ← prevents double loading
    }

    if (selectedCategories.length === 0) {
      loadRandomRecipes();
    } else {
      loadFilteredRecipes();
    }
  }, [selectedCategories]);

  const loadFilteredRecipes = async () => {
    setLoading(true);

    let allMeals = [];

    for (const category of selectedCategories) {
      const meals = await getMealsByCategory(category);
      allMeals.push(...meals);
    }

    const unique = [];
    const ids = new Set();

    for (const meal of allMeals) {
      if (!ids.has(meal.idMeal)) {
        ids.add(meal.idMeal);
        unique.push(meal);
      }
    }

    setRecipes(unique);
    setLoading(false);
  };

  // Search overrides filters
  const handleSearch = async (value) => {
    setSearch(value);

    if (value.trim() === "") {
      selectedCategories.length === 0
        ? loadRandomRecipes()
        : loadFilteredRecipes();
      return;
    }

    setLoading(true);
    const results = await searchMeals(value);
    setRecipes(results || []);
    setLoading(false);
  };

  return (
    <div className="home-container">

      <h1 className="home-main-title">Discover Delicious Recipes for Every Day</h1>
      <h2 className="home-sub-title">Get inspired and save your favorites</h2>

      <input
        type="text"
        className="home-search"
        placeholder="Search for a recipe..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <RecipeOfTheDay />

      {/* Recipes title + Filter button row */}
      <div className="recipes-header">
        <h2>Recipes</h2>

        <FilterMenu
          selected={selectedCategories}
          onChange={setSelectedCategories}
        />
      </div>

      <div className="cards-container">
        {recipes?.length > 0 ? (
          recipes.map((recipe) => (
            <ReciptCard key={recipe.idMeal} recipe={recipe} />
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>

    </div>
  );
}
