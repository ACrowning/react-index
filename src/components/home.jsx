import React, { useState } from "react";
import styles from "../app.module.css";
import Item from "../components/item.jsx";
import Mock from "../components/mock/mock.js";
import { Button } from "antd";
import { Input } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

function Home() {
  const [elements, setElements] = useState(Mock);
  const [inputTitle, setInputTitle] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [searchElement, setSearchElement] = useState("");
  const [sumCard, setSumCard] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const handleAddAmount = (newCount) => {
    if (!isNaN(newCount) && newCount >= 0) {
      setSumCard((prevSum) => parseInt(prevSum + newCount));
    } else {
      alert("Wrong count");
    }
  };

  const handleDeleteItem = (itemsIndex) => {
    const itemsDeleted = [
      ...elements.slice(0, itemsIndex),
      ...elements.slice(itemsIndex + 1),
    ];
    setElements(itemsDeleted);
  };

  const handleAddItem = () => {
    const newItem = {
      id: `${elements.length + 1}`,
      title: inputTitle,
      amount: inputAmount,
    };
    if (inputAmount === "" || inputTitle === "") {
      alert("Enter the title and the count!");
    } else {
      setElements([...elements, newItem]);
    }
    setInputTitle("");
    setInputAmount("");
  };

  const handleToggle = (itemsIndex) => {
    setElements((prevElements) =>
      prevElements.map((element) =>
        element.id === itemsIndex
          ? { ...element, done: !element.done }
          : element
      )
    );
  };

  const filteredElements = elements.filter((item) =>
    item.title.toLowerCase().includes(searchElement.toLowerCase())
  );

  const handleElementClick = (itemsIndex, newText) => {
    setElements((prevElements) =>
      prevElements.map((element) =>
        element.id === itemsIndex ? { ...element, title: newText } : element
      )
    );
  };

  const handleAmountEdit = (itemsIndex, newCount) => {
    setElements((prevElements) =>
      prevElements.map((element) =>
        element.id === itemsIndex
          ? {
              ...element,
              amount: Math.max(0, element.amount - newCount),
            }
          : element
      )
    );
  };

  const addToCart = (element, newCount) => {
    const newItem = {
      id: element.id,
      title: element.title,
      amount: parseInt(newCount),
    };
    setCartItems([...cartItems, newItem]);
  };

  const handleShopCardClick = () => {
    console.log(cartItems);
  };

  return (
    <>
      <div>
        <div className={styles.top}>
          <div>
            <div className={styles.circle}>{sumCard}</div>
            <ShoppingCartOutlined
              className={styles.iconCart}
              onClick={handleShopCardClick}
            />
          </div>
        </div>
        <div className={styles.containerStyle}>
          <div className={styles.navbar}>
            <div className={styles.font}>Fill in the fields:</div>
            <div className={styles.input}>
              <Input
                value={inputTitle}
                onChange={(event) => setInputTitle(event.target.value)}
                type="text"
                placeholder="Enter the title"
              />
            </div>
            <div>
              <Input
                value={inputAmount}
                onChange={(event) => setInputAmount(event.target.value)}
                type="number"
                placeholder="Enter the count"
              />
            </div>
            <Button
              className={styles.buttons}
              type="primary"
              onClick={handleAddItem}
            >
              Add
            </Button>

            <div>
              <div className={styles.font}>Filter:</div>
              <Input
                type="text"
                placeholder="Find the title"
                value={searchElement}
                onChange={(event) => setSearchElement(event.target.value)}
              />
            </div>
          </div>

          <div className={styles.container}>
            <Item
              handleDeleteItem={handleDeleteItem}
              handleToggle={handleToggle}
              filteredElements={filteredElements}
              handleElementClick={handleElementClick}
              handleAmountEdit={handleAmountEdit}
              handleAddAmount={handleAddAmount}
              addToCart={addToCart}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
