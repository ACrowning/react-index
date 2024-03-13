import React, { useState } from "react";
import styles from "./app.module.css";
import Item from "./components/item.jsx";
import Mock from "./components/mock/mock.js";
import { Button } from "antd";
import { Input } from "antd";

function App() {
  const [elements, setElements] = useState(Mock);
  const [inputTitle, setInputTitle] = useState("");
  const [searchElement, setSearchElement] = useState("");
  const [sumCard, setSumCard] = useState(0);

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
      amount: 1,
    };
    setInputTitle("");

    setElements([...elements, newItem]);
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

  const handlePlusCount = (itemsIndex) => {
    setElements((prevElements) =>
      prevElements.map((element) =>
        element.id === itemsIndex
          ? {
              ...element,
              amount: parseInt(element.amount) + 1,
            }
          : element
      )
    );
  };

  const handleMinusCount = (itemsIndex) => {
    setElements((prevElements) =>
      prevElements.map((element) =>
        element.id === itemsIndex
          ? {
              ...element,
              amount: Math.max(0, element.amount - 1),
            }
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
          ? { ...element, amount: parseInt(newCount) }
          : element
      )
    );
  };

  return (
    <div className={styles.containerStyle}>
      <div className={styles.navbar}>
        <div>
          <Input
            value={inputTitle}
            onChange={(event) => setInputTitle(event.target.value)}
            type="text"
            placeholder="Enter the title"
          />
        </div>
        <Button type="primary" onClick={handleAddItem}>
          Add
        </Button>
        <div className={styles.item}>
          <Input
            type="text"
            placeholder="Find the title"
            value={searchElement}
            onChange={(event) => setSearchElement(event.target.value)}
          />
        </div>
      </div>

      <div className={styles.itemsStyle}>
        <Item
          handleDeleteItem={handleDeleteItem}
          handleToggle={handleToggle}
          filteredElements={filteredElements}
          handleElementClick={handleElementClick}
          handlePlusCount={handlePlusCount}
          handleMinusCount={handleMinusCount}
          handleAmountEdit={handleAmountEdit}
          handleAddAmount={handleAddAmount}
        />
      </div>

      <div> Sum: {sumCard}</div>
    </div>
  );
}

export default App;
