const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Get multiple random meals
export async function getRandomMeals(amount = 5) {
  const requests = Array.from({ length: amount }, () =>
    fetch(`${BASE_URL}/random.php`).then(res => res.json())
  );

  const results = await Promise.all(requests);
  return results.map(r => r.meals[0]); // flatten array
}

// Search meals by name
export async function searchMeals(query) {
  const res = await fetch(`${BASE_URL}/search.php?s=${query}`);
  const data = await res.json();
  return data.meals || [];
}

// Get all meal categories
export async function getMealCategories() {
  const res = await fetch(`${BASE_URL}/categories.php`);
  const data = await res.json();
  return data.categories || [];
}

// Get meals from a specific category
export async function getMealsByCategory(category) {
  const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
  const data = await res.json();
  return data.meals || [];
}

// Get full meal details by ID
export async function getMealById(id) {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data = await res.json();
  return data.meals ? data.meals[0] : null;
}
