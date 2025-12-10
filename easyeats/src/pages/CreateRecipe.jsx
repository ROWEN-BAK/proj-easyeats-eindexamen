import React, { useState } from "react";
import "../styles/CreateRecipe.css";

function CreateRecipe() {
  const [ingredients, setIngredients] = useState([
    { amount: "", name: "" }
  ]);
  const [steps, setSteps] = useState([""]);

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

  function handleSubmit(e) {
    e.preventDefault();

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
    };

    console.log("NEW RECIPE:", recipe);
    alert("Recept opgeslagen! (console checken)");
  }

  return (
    <div className="create-wrapper">
      <h1 className="page-title">Make your own recipe</h1>
      <p className="page-sub">share your culinary creations with Easyeats</p>

      <form className="create-card" onSubmit={handleSubmit}>

        {/* SECTION: Recept Details */}
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
            <label>Preperation time</label>
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
        <textarea name="description" placeholder="Describe your recipe in a few sentences..." />


        {/* SECTION: Foto */}
        <h2 className="section-title">Recipe Image</h2>
        <div className="upload-box">
          <p>🖼️ drag image here to add</p>
          <small>PNG, JPG tot 5MB</small>
        </div>


        {/* SECTION: Ingrediënten */}
        <h2 className="section-title">Ingredients</h2>

        {ingredients.map((item, i) => (
          <div key={i} className="ingredient-row">
            <input
              type="text"
              placeholder="weight amount (bijv. 200g)"
              value={item.amount}
              onChange={(e) =>
                handleIngredientChange(i, "amount", e.target.value)
              }
              required
            />
            <input
              type="text"
              placeholder="Ingredient name"
              value={item.name}
              onChange={(e) =>
                handleIngredientChange(i, "name", e.target.value)
              }
              required
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


        {/* SECTION: Bereidingswijze */}
        <h2 className="section-title">Instructions</h2>

        {steps.map((step, i) => (
          <div key={i} className="step-row">
            <div className="step-num">{i + 1}</div>
            <textarea
              placeholder="Describe the instruction..."
              value={step}
              onChange={(e) => handleStepChange(i, e.target.value)}
              required
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


        {/* SECTION: Tips */}
        <h2 className="section-title">Advice and pointers</h2>
        <textarea
          name="tips"
          placeholder="Share your advice and points of interest"
        />

        {/* SUBMIT */}
        <button className="save-btn">Save</button>
      </form>
    </div>
  );
}

export default CreateRecipe;
