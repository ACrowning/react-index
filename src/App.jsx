import React, { useState } from "react";
import styles from "./app.module.css";
import List from "./components/item.jsx";
import Mock from "./components/mock/mock.js";

function App() {
  const [elements, setElements] = useState(Mock);

  const [inputTitle, setInputTitle] = useState("");
  const [inputDone, setInputDone] = useState("");

  const handleDeleteItem = (itemsIndex) => {
    const itemsDeleted = [
      ...elements.slice(0, itemsIndex),
      ...elements.slice(itemsIndex + 1),
    ];
    setElements(itemsDeleted);
  };

  const handleAddItem = () => {
    const newItem = {
      title: inputTitle,
      done: inputDone,
    };
    setInputTitle("");
    setInputDone("");

    setElements([...elements, newItem]);
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
        <div>
          <input
            value={inputDone}
            onChange={(event) => setInputDone(event.target.value)}
            type="text"
            placeholder="Enter the title"
          />
        </div>
        <button onClick={handleAddItem}>Add</button>
      </div>
      <div className={styles.itemsStyle}>
        <List handleDeleteItem={handleDeleteItem} items={elements} />
      </div>
    </div>
  );
}

export default App;
