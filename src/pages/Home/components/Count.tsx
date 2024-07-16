import React, { useState, useContext } from "react";
import { Button } from "antd";
import { Input } from "antd";
import styles from "../app.module.css";
import { AuthContext } from "../../../context/AuthContext";

export default function Count({ item, handleAmountEdit, addToCart }: any) {
  const [inputAmount, setInputAmount] = useState<any>(1);
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  const { user } = context;

  const handleAddCount = () => {
    handleAmountEdit(item, inputAmount);

    addToCart(item, inputAmount);

    setInputAmount(parseInt(item.amount - inputAmount && (1 as any)));
  };

  const handleInputChange = (e: any) => {
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
        {user && (
          <>
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
                className={styles.buttonSize}
              >
                +
              </Button>
            </div>
          </>
        )}
      </div>

      <div className={styles.flexBtn}>
        <div>
          {user && (
            <Button
              type="primary"
              disabled={inputAmount === 0}
              onClick={() => handleAddCount()}
              className={styles.btnAdd}
            >
              Add to card
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
