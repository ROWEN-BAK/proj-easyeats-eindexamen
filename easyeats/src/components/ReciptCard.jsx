import "./ReciptCard.css";

export default function ReciptCard({ recipe, onClick }) {

  const title = recipe?.strMeal || "Loading title...";
  const image = recipe?.strMealThumb || "https://via.placeholder.com/300x200";
  const id = recipe?.idMeal;

  return (
    <div className="recipt-card" onClick={() => onClick && onClick(id)}>
      <img src={image} alt={title} />
      <h3 className="recipt-title">{title}</h3>
    </div>
  );
}
