import React, { useState } from "react";
import styles from "./app.module.css";
import Item from "./components/item.jsx";
import Mock from "./components/mock/mock.js";

function App() {
  const [elements, setElements] = useState(Mock);

  const [inputTitle, setInputTitle] = useState("");

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

  return (
    <div className={styles.containerStyle}>
      <div className={styles.navbar}>
        <div>
          <input
            value={inputTitle}
            onChange={(event) => setInputTitle(event.target.value)}
            type="text"
            placeholder="Enter the title"
          />
        </div>

        <button onClick={handleAddItem}>Add</button>
      </div>
      <div className={styles.itemsStyle}>
        <Item
          handleDeleteItem={handleDeleteItem}
          items={elements}
          handleToggle={handleToggle}
        />
      </div>
    </div>
  );
}

export default App;
