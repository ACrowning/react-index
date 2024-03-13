import React, { useState } from "react";
import { Button } from "antd";
import { Input } from "antd";
import styles from "../app.module.css";

export default function Count({
  item,
  onPlusClick,
  onMinusClick,
  handleAmountEdit,
  handleAddAmount,
}) {
  const [inputAmount, setInputAmount] = useState(item.amount);

  const handleAddCount = () => {
    handleAddAmount(inputAmount);
  };

  const handleAmount = () => {
    handleAmountEdit(item.id, inputAmount);
  };

  const minus = () => {
    onMinusClick(item.id, inputAmount);
    setInputAmount(Math.max(0, item.amount - 1));
  };

  const plus = () => {
    onPlusClick(item.id, inputAmount);
    setInputAmount(item.amount + 1);
  };

  return (
    <div>
      <div className={styles.flex}>
        <div>
          <Button type="primary" onClick={() => minus()}>
            -
          </Button>
        </div>
        <div>
          <Input
            type="number"
            value={inputAmount}
            onBlur={handleAmount}
            onChange={(event) => setInputAmount(parseInt(event.target.value))}
          />
        </div>
        <div>
          <Button type="primary" onClick={() => plus()}>
            +
          </Button>
        </div>
      </div>
      <div>
        <Button
          type="primary"
          className={styles.item}
          onClick={() => handleAddCount()}
        >
          Add to card
        </Button>
      </div>
    </div>
  );
}
