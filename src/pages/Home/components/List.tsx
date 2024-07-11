import styles from "../app.module.css";
import Edit from "./Edit";
import Count from "./Count";

export function List({
  handleToggle,
  sortedElements,
  handleElementClick,
  handleAmountEdit,
  addToCart,
}: any) {
  return sortedElements.map((item: any, index: any) => (
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
            index={index}
          />
        </div>
      </div>
    </div>
  ));
}
