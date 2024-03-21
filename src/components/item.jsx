import styles from "../app.module.css";
import Edit from "./edit.jsx";
import Count from "./count.jsx";

export default function Item({
  handleToggle,
  handleDeleteItem,
  filteredElements,
  handleElementClick,
  handleAmountEdit,
  handleAddAmount,
  addToCart,
}) {
  return filteredElements.map((item, index) => (
    <div key={item.id} className={styles.itemsStyle}>
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
          handleAddAmount={handleAddAmount}
          addToCart={addToCart}
          handleDeleteItem={handleDeleteItem}
          index={index}
        />
      </div>
    </div>
  ));
}
