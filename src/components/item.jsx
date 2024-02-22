import styles from "../app.module.css";

export default function Item({ handleToggle, handleDeleteItem, items }) {
  return items.map((item, index) => (
    <div
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
