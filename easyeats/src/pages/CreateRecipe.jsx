import React, { useEffect, useState } from "react";
import RegLogin from "../components/RegLogin";
import "../styles/CreateRecipe.css";

function CreateRecipe() {
  const [ingredients, setIngredients] = useState([{ amount: "", name: "" }]);
  const [steps, setSteps] = useState([""]);

  // 🔥 LOGIN CHECK
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setTimeout(() => setShowPopup(true), 200); // delay same as profile
    }
  }, []);

  // ───────────────── INGREDIENTS ─────────────────

  function handleIngredientChange(index, field, value) {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  }

  function addIngredient() {
    setIngredients([...ingredients, { amount: "", name: "" }]);
  }

  function removeIngredient(index) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  // ───────────────── STEPS ─────────────────

  function handleStepChange(index, value) {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  }

  function addStep() {
    setSteps([...steps, ""]);
  }

  function removeStep(index) {
    setSteps(steps.filter((_, i) => i !== index));
  }

  // ───────────────── SUBMIT ─────────────────
  function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to create a recipe.");
      setShowPopup(true);
      return;
    }

    const recipe = {
      name: e.target.name.value,
      category: e.target.category.value,
      time: e.target.time.value,
      persons: e.target.persons.value,
      description: e.target.description.value,
      image: e.target.image.value,
      ingredients,
      steps,
      tips: e.target.tips.value,
      author: user.username,      // optional - links recipe to user
      email: user.email           // optional
    };

    console.log("NEW RECIPE:", recipe);
    alert("Recipe saved! (check console)");
  }

  return (
    <div className="create-wrapper">
      <h1 className="page-title">Make your own recipe</h1>
      <p className="page-sub">share your culinary creations with Easyeats</p>

      {/* SHOW POPUP IF NOT LOGGED IN */}
      {showPopup && (
        <RegLogin
          onLogin={() => { setUser(JSON.parse(localStorage.getItem("user"))); setShowPopup(false); }}
          close={() => setShowPopup(false)}
        />
      )}

      {user ? (
        <form className="create-card" onSubmit={handleSubmit}>
          {/* All your form content unchanged ↓ */}
          
          <h2 className="section-title">Recipe Details</h2>
          <div className="grid-2">
            <div>
              <label>Recipe name *</label>
              <input type="text" name="name" placeholder="Bv. Pizza pepperoni" required />
            </div>

            <div>
              <label>Category</label>
              <select name="category" defaultValue="">
                <option value="">Select category</option>
                <option value="Pasta">Pasta</option>
                <option value="Beef">Beef</option>
                <option value="Chicken">Chicken</option>
                <option value="Dessert">Dessert</option>
                <option value="Lamb">Lamb</option>
                <option value="Misscelaneous">Misscellaneous</option>
                <option value="Pork">Pork</option>
                <option value="Seafood">Seafood</option>
                <option value="Side">Side</option>
                <option value="Starter">Starter</option>
                <option value="Vegan">Vegan</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Goat">Goat</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label>Preparation time</label>
              <div className="time-input">
                <input type="number" name="time" defaultValue="30" />
                <span>min</span>
              </div>
            </div>

            <div>
              <label>For how many people</label>
              <input type="number" name="persons" defaultValue="4" />
            </div>
          </div>

          <label>Short description</label>
          <textarea name="description" placeholder="Describe your recipe..." />

          <h2 className="section-title">Recipe Image</h2>
          <div className="upload-box">
            <p>🖼️ drag image here to add</p>
            <small>PNG, JPG up to 5MB</small>
          </div>

          <h2 className="section-title">Ingredients</h2>
          {ingredients.map((item, i) => (
            <div key={i} className="ingredient-row">
              <input
                type="text"
                placeholder="200g"
                value={item.amount}
                onChange={(e) => handleIngredientChange(i, "amount", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Ingredient"
                value={item.name}
                onChange={(e) => handleIngredientChange(i, "name", e.target.value)}
                required
              />
              {i > 0 && <button type="button" className="delete-btn" onClick={() => removeIngredient(i)}>🗑️</button>}
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addIngredient}>+ Add</button>

          <h2 className="section-title">Instructions</h2>
          {steps.map((step, i) => (
            <div key={i} className="step-row">
              <div className="step-num">{i + 1}</div>
              <textarea
                placeholder="Describe..."
                value={step}
                onChange={(e) => handleStepChange(i, e.target.value)}
                required
              />
              {i > 0 && <button type="button" className="delete-btn" onClick={() => removeStep(i)}>🗑️</button>}
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addStep}>+ Add step</button>

          <h2 className="section-title">Advice and pointers</h2>
          <textarea name="tips" placeholder="Optional tips..." />

          <button className="save-btn">Save</button>
        </form>
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Please log in to create a recipe.
        </p>
      )}
    </div>
  );
}

export default CreateRecipe;
