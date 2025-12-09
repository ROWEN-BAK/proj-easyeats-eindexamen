import { useEffect, useState, useRef } from "react";
import { getMealCategories } from "../api/mealdb";
import "../styles/FilterMenu.css";

export default function FilterMenu({ selected, onChange }) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  const containerRef = useRef(null); // reference to dropdown + button wrapper

  // Load categories
  useEffect(() => {
    getMealCategories().then((cats) => setCategories(cats));
  }, []);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (category) => {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category));
    } else {
      onChange([...selected, category]);
    }
  };

  return (
    <div className="filter-wrapper" ref={containerRef}>
      <button className="filter-toggle" onClick={() => setOpen(!open)}>
        ⚙ Filter Recipes
      </button>

      {open && (
        <div className="filter-dropdown">
          {categories.map((cat) => (
            <button
              key={cat.idCategory}
              className={
                selected.includes(cat.strCategory)
                  ? "filter-option active"
                  : "filter-option"
              }
              onClick={() => toggleCategory(cat.strCategory)}
            >
              {cat.strCategory}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
