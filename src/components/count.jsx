import React, { useState } from "react";
import { Button } from "antd";
import { Input } from "antd";
import styles from "../app.module.css";

export default function Count({
  item,
  handleAmountEdit,
  handleAddAmount,
  addToCart,
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
      <div className={styles.flex}>
        <div>
          <Button
            type="primary"
            disabled={inputAmount === 0}
            onClick={() => minus()}
          >
            -
          </Button>
        </div>
        <div>
          <Input
            type="number"
            value={inputAmount}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Button
            type="primary"
            disabled={inputAmount >= item.amount && !isNaN(inputAmount)}
            onClick={() => plus()}
          >
            +
          </Button>
        </div>
      </div>
      <div>
        <Button
          type="primary"
          disabled={inputAmount === 0}
          className={styles.item}
          onClick={() => handleAddCount()}
        >
          Add to card
        </Button>
      </div>
    </div>
  );
}
