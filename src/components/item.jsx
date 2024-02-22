import styles from "../app.module.css";

export default function List({ handleDeleteItem, items }) {
  return items.map((item, index) => (
    <div className={styles.item}>
      {item.title} {item.done}
      <div>
        <button onClick={() => handleDeleteItem(index)}>Delete</button>
      </div>
    </div>
  ));
}
