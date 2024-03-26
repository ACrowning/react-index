import styles from "../app.module.css";
import Edit from "./edit.jsx";
import Count from "./count.jsx";
import { Link } from "react-router-dom";

function Item({
  handleToggle,
  handleDeleteItem,
  filteredElements,
  handleElementClick,
  handleAmountEdit,
  handleAddAmount,
  addToCart,
}) {
  const handleClick = (e) => {
    const isClicked =
      e.target.classList.contains("ant-btn") ||
      e.target.closest(".ant-btn") ||
      e.target.tagName.toLowerCase() === "input";

    if (isClicked) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return filteredElements.map((item, index) => (
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
        <Link to={`/item/${JSON.stringify(item)}`} className={styles.link}>
          <div className={styles.flexItem} onClick={handleClick}>
            <Count
              item={item}
              handleAmountEdit={handleAmountEdit}
              handleAddAmount={handleAddAmount}
              addToCart={addToCart}
              handleDeleteItem={handleDeleteItem}
              index={index}
            />
          </div>
        </Link>
      </div>
    </div>
  ));
}
export default Item;
