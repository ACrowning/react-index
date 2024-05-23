import React, { useState } from "react";
import { Button } from "antd";
import { Input } from "antd";
import styles from "../app.module.css";
import { PlusSquareOutlined } from "@ant-design/icons";

export default function Count({
  item,
  handleAmountEdit,

  addToCart,
  handleDeleteItem,
}) {
  const [inputAmount, setInputAmount] = useState(1);

  const handleAddCount = () => {
    handleAmountEdit(item, inputAmount);

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
      <div className={styles.price}>price: {item.price}</div>
      <div className={styles.amount}>amount: {item.amount}</div>
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
            type="default"
            disabled={inputAmount >= item.amount && !isNaN(inputAmount)}
            onClick={() => plus()}
            className={styles.buttonSize}
          >
            +
          </Button>
        </div>
      </div>

      <div className={styles.flexBtn}>
        <div>
          <Button
            type="primary"
            disabled={inputAmount === 0}
            onClick={() => handleAddCount()}
            className={styles.btnAdd}
          >
            Add to card
          </Button>
        </div>
        <div>
          <Button
            type="primary"
            onClick={() => handleDeleteItem(item.id)}
            className={styles.btnDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
