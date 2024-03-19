import styles from "../app.module.css";
import Edit from "./edit.jsx";
import Count from "./count.jsx";
import { Button } from "antd";

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
    <div key={item.id} className={styles.item}>
      <Edit
        item={item}
        onItemClick={handleElementClick}
        handleToggle={handleToggle}
      />
      <Count
        item={item}
        handleAmountEdit={handleAmountEdit}
        handleAddAmount={handleAddAmount}
        addToCart={addToCart}
      />
      <div>
        <Button
          type="primary"
          className={styles.item}
          onClick={() => handleDeleteItem(index)}
        >
          Delete
        </Button>
      </div>
    </div>
  ));
}
