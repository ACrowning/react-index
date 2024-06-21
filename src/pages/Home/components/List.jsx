import styles from "../app.module.css";
import Edit from "./Edit.jsx";
import Count from "./Count.jsx";

export function List({
  handleToggle,
  handleDeleteItem,
  sortedElements,
  handleElementClick,
  handleAmountEdit,
  addToCart,
}) {
  return sortedElements.map((item, index) => (
    <div key={item.id}>
      <div
        className={`${styles.itemsStyle} ${
          item.amount === 0 ? styles.zero : ""
        }`}
      >
        <div>
          <Edit
            item={item}
            onItemClick={handleElementClick}
            handleToggle={handleToggle}
          />
        </div>

        <div>
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
