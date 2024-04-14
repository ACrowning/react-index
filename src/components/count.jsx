import React, { useState } from "react";
import { Button } from "antd";
import { Input } from "antd";
import styles from "../app.module.css";

export default function Count({
  item,
  handleAmountEdit,
  handleAddAmount,
  addToCart,
  handleDeleteItem,
  index,
}) {
  const [inputAmount, setInputAmount] = useState(1);

  const handleAddCount = () => {
    handleAddAmount(inputAmount);
    handleAmountEdit(item.id, inputAmount);

    addToCart(item, inputAmount);

    setInputAmount(parseInt(item.amount - inputAmount && 1));
  };

  const handleInputChange = (e) => {
    if (!e.target.value) {
      return setInputAmount(0);
    }
    if (parseInt(e.target.value) > item.amount) {
      alert("Wrong count");
    } else setInputAmount(parseInt(e.target.value));
  };

  const minus = () => {
    setInputAmount(Math.max(0, inputAmount - 1));
  };

  const plus = () => {
    setInputAmount(inputAmount + 1);
  };

  return (
    <div>
      <div className={styles.flexItem}>
        <div>
          <Button
            type="primary"
            disabled={inputAmount === 0}
            onClick={() => minus()}
            className={styles.buttonSize}
          >
            -
          </Button>
        </div>
        <div className={styles.inputNum}>
          <Input
            type="number"
            value={inputAmount}
            onChange={handleInputChange}
            min={0}
          />
        </div>
        <div>
          <Button
            type="primary"
            disabled={inputAmount >= item.amount && !isNaN(inputAmount)}
            onClick={() => plus()}
            className={styles.btnSize}
          >
            +
          </Button>
        </div>
      </div>
      <div className={styles.amount}>amount: {item.amount}</div>
      <div className={styles.itemBtn}>
        <div className={styles.flexBtn}>
          <div>
            <Button
              type="primary"
              disabled={inputAmount === 0}
              onClick={() => handleAddCount()}
              className={styles.btnSize}
            >
              Add to card
            </Button>
          </div>
          <div>
            <Button
              type="primary"
              onClick={() => handleDeleteItem(index, item.id)}
              className={styles.btnSize}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
