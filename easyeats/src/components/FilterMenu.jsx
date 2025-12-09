import { useEffect, useState, useRef } from "react";
import { getMealCategories } from "../api/mealdb";
import "../styles/FilterMenu.css";

export default function FilterMenu({ selected, onChange }) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Load categories
  useEffect(() => {
    getMealCategories().then((cats) => setCategories(cats));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const toggleCategory = (category) => {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category));
    } else {
      onChange([...selected, category]);
    }
  };

  return (
    <>
      <div className="filter-container">
        <button className="filter-toggle" onClick={() => setOpen(!open)}>
          ⚙ Filter Recipes
        </button>
      </div>

      {open && (
        <div className="filter-overlay">
          <div className="filter-dropdown" ref={dropdownRef}>
            <h3 className="filter-title">Select Categories</h3>

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
        </div>
      )}
    </>
  );
}
