import "../styles/ReciptCard.css";
import { useMemo } from "react";

export default function ReciptCard({ recipe, showDetail }) {
  const title = recipe?.strMeal || "Loading title...";
  const image = recipe?.strMealThumb || "https://via.placeholder.com/300x200";
  const id = recipe?.idMeal;

  // Generate a random cooking time only once per card
  const randomTime = useMemo(() => {
    return Math.floor(Math.random() * (90 - 15 + 1)) + 15; // 15–90 minutes
  }, []);

  return (
    <div className="recipt-card">
      <div className="image-wrapper">
        <img src={image} alt={title} />
        <div className="heart-icon">♡</div>
      </div>

      <h3 className="recipt-title">{title}</h3>

      <div className="recipt-info-row">
        <span className="time-text">⏱ {randomTime} min</span>

        <button className="open-btn" onClick={() => showDetail(id)}>
          View Recipe
        </button>
      </div>
    </div>
  );
}
