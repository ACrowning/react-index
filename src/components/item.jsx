import styles from "../app.module.css";
import Edit from "./edit.jsx";
import Count from "./count.jsx";

function Item({
  handleToggle,
  handleDeleteItem,
  sortedElements,
  handleElementClick,
  handleAmountEdit,
  addToCart,
}) {
  return sortedElements.map((item, index) => (
    <div
      key={item.id}
      className={`${styles.itemsStyle} ${item.amount === 0 ? styles.zero : ""}`}
    >
      <div>
        <div>
          <Edit
            item={item}
            onItemClick={handleElementClick}
            handleToggle={handleToggle}
          />
        </div>

        <div className={styles.flexItem}>
          <Count
            item={item}
            handleAmountEdit={handleAmountEdit}
            addToCart={addToCart}
            handleDeleteItem={handleDeleteItem}
            index={index}
          />
        </div>
      </div>
    </div>
  ));
}
export default Item;
