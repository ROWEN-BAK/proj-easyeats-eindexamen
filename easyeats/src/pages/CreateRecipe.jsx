import React, { useEffect, useState } from "react";
import RegLogin from "../components/RegLogin";
import "../styles/CreateRecipe.css";

function CreateRecipe() {
  const [ingredients, setIngredients] = useState([{ amount: "", name: "" }]);
  const [steps, setSteps] = useState([""]);
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // NEW: image upload
  const [image, setImage] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setTimeout(() => setShowPopup(true), 200);
    }
  }, []);

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result); 
    reader.readAsDataURL(file);
  }

  function handleIngredientChange(i, field, value) {
    const updated = [...ingredients];
    updated[i][field] = value;
    setIngredients(updated);
  }

  function addIngredient() {
    setIngredients([...ingredients, { amount: "", name: "" }]);
  }

  function removeIngredient(i) {
    setIngredients(ingredients.filter((_, index) => index !== i));
  }

  function handleStepChange(i, value) {
    const updated = [...steps];
    updated[i] = value;
    setSteps(updated);
  }

  function addStep() {
    setSteps([...steps, ""]);
  }

  function removeStep(i) {
    setSteps(steps.filter((_, index) => index !== i));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    // VALIDATION HERE
    const name = e.target.name.value.trim();
    const category = e.target.category.value.trim();
    const time = e.target.time.value.trim();
    const persons = e.target.persons.value.trim();
    const description = e.target.description.value.trim();
    const tips = e.target.tips.value.trim();

    if (!image) return alert("Please upload an image.");
    if (!name) return alert("Recipe name is required.");
    if (!category) return alert("Please select a category.");
    if (!time) return alert("Preparation time is required.");
    if (!persons) return alert("Number of persons is required.");
    if (!description) return alert("Description is required.");
    if (ingredients.some(i => !i.amount.trim() || !i.name.trim()))
      return alert("All ingredient fields must be filled.");
    if (steps.some(s => !s.trim()))
      return alert("All steps must be filled.");
    if (!tips) return alert("Advice (tips) cannot be empty.");

    const id = "my-" + Date.now();

    const recipe = {
      id,
      name,
      category,
      time,
      persons,
      description,
      image: image || "/placeholder.png",
      ingredients,
      steps,
      tips,
      author: user.username,
      email: user.email,
    };

    const globalRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    globalRecipes.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(globalRecipes));

    const updatedUser = {
      ...user,
      myRecipes: [...(user.myRecipes || []), recipe],
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === updatedUser.email ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("Recipe saved!");
  }

  return (
    <div className="create-wrapper">
      <h1 className="page-title">Make your own recipe</h1>
      <p className="page-sub">Share your culinary creations with Easyeats</p>

      {showPopup && (
        <RegLogin
          onLogin={() => {
            setUser(JSON.parse(localStorage.getItem("user")));
            setShowPopup(false);
          }}
          close={() => setShowPopup(false)}
        />
      )}

      {user ? (
        <form className="create-card" onSubmit={handleSubmit}>
          <h2 className="section-title">Recipe Details</h2>

          <label>Recipe image *</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />

          {image && (
            <img src={image} alt="preview" className="preview-image" />
          )}

          <div className="grid-2">
            <div>
              <label>Recipe name *</label>
              <input type="text" name="name" />
            </div>

            <div>
              <label>Category *</label>
              <select name="category" defaultValue="">
                <option value="">Select category</option>
                <option value="Pasta">Pasta</option>
                <option value="Beef">Beef</option>
                <option value="Chicken">Chicken</option>
                <option value="Dessert">Dessert</option>
                <option value="Seafood">Seafood</option>
                <option value="lamb">lamb</option>
                <option value="Miscellaneous">Miscellaneous</option>
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
              <label>Preparation time *</label>
              <div className="time-input">
                <input type="number" name="time" defaultValue="30" />
                <span>min</span>
              </div>
            </div>

            <div>
              <label>For how many people *</label>
              <input type="number" name="persons" defaultValue="4" />
            </div>
          </div>

          <label>Short description *</label>
          <textarea name="description" />

          <h2 className="section-title">Ingredients *</h2>
          {ingredients.map((item, i) => (
            <div className="ingredient-row" key={i}>
              <input
                type="text"
                placeholder="200g"
                value={item.amount}
                onChange={(e) =>
                  handleIngredientChange(i, "amount", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Ingredient"
                value={item.name}
                onChange={(e) =>
                  handleIngredientChange(i, "name", e.target.value)
                }
              />
              {i > 0 && (
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => removeIngredient(i)}
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addIngredient}>
            + Add
          </button>

          <h2 className="section-title">Instructions *</h2>
          {steps.map((step, i) => (
            <div className="step-row" key={i}>
              <div className="step-num">{i + 1}</div>
              <textarea
                value={step}
                onChange={(e) => handleStepChange(i, e.target.value)}
              />
              {i > 0 && (
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => removeStep(i)}
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addStep}>
            + Add step
          </button>

          <h2 className="section-title">Advice *</h2>
          <textarea name="tips" />

          <button className="save-btn">Save</button>
        </form>
      ) : (
        <p style={{ textAlign: "center" }}>Please log in to create a recipe.</p>
      )}
    </div>
  );
}

export default CreateRecipe;
