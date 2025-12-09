import { useEffect, useState, useRef } from "react";
import { getMealCategories } from "../api/mealdb";
import "../styles/FilterMenu.css";

export default function FilterMenu({ selected, onChange }) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);

  // Load categories once
  useEffect(() => {
    getMealCategories().then((cats) => setCategories(cats));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (cat) => {
    if (selected.includes(cat)) {
      onChange(selected.filter((c) => c !== cat));
    } else {
      onChange([...selected, cat]);
    }
  };

  return (
    <div className="filter-wrapper" ref={containerRef}>
      <button className="filter-toggle" onClick={() => setOpen(!open)}>
        ⚙ Filters
      </button>

      {open && (
        <div className="filter-dropdown">
          <h3 className="filter-title">Categories</h3>

          <div className="filter-section">
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
    </div>
  );
}
