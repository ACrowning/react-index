import styles from "../app.module.css";
import Edit from "./edit.jsx";

export default function Item({
  handleToggle,
  handleDeleteItem,
  filteredElements,
  handleElementClick,
}) {
  return filteredElements.map((item, index) => (
    <div key={item.id} className={styles.item}>
      <Edit
        item={item}
        onItemClick={handleElementClick}
        handleToggle={handleToggle}
      />

      <div>
        <button onClick={() => handleDeleteItem(index)}>Delete</button>
      </div>
    </div>
  ));
}
