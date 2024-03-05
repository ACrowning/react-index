import styles from "../app.module.css";
import Edit from "./edit.jsx";

export default function Item({
  handleToggle,
  handleDeleteItem,
  filteredElements,
  handleElementClick,
}) {
  return filteredElements.map((item, index) => (
    <div
      key={item.id}
      className={styles.item}
      style={{ textDecoration: item.done ? "line-through" : "none" }}
      onClick={() => handleToggle(item.id)}
    >
      <Edit item={item} onItemClick={handleElementClick} />

      <div>
        <button onClick={() => handleDeleteItem(index)}>Delete</button>
      </div>
    </div>
  ));
}
