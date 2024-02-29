import styles from "../app.module.css";

export default function Item({
  handleToggle,
  handleDeleteItem,
  filteredElements,
}) {
  return filteredElements.map((item, index) => (
    <div
      key={item.id}
      className={styles.item}
      style={{ textDecoration: item.done ? "line-through" : "none" }}
      onClick={() => handleToggle(item.id)}
    >
      {item.title}
      <div>
        <button onClick={() => handleDeleteItem(index)}>Delete</button>
      </div>
    </div>
  ));
}
