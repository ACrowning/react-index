import React, { useState } from "react";
import styles from "../app.module.css";
import { Button } from "antd";
import { Input } from "antd";
import { products } from "../../../api/products.js";

export function Navbar({
  elements,
  setElements,
  searchElement,
  setSearchElement,
  sortByPrice,
  setSortByPrice,
  setSearchParams,
}) {
  const [inputTitle, setInputTitle] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [inputPrice, setInputPrice] = useState("");

  const handleAddItem = async () => {
    const newItem = {
      title: inputTitle,
      amount: inputAmount,
      price: inputPrice,
      favorite: false,
    };
    if (inputAmount === "" || inputTitle === "") {
      alert("Enter the title and the count!");
    } else {
      const { data, error } = await products.addProduct(newItem);

      if (error) {
        setElements([]);
      } else {
        setElements([...elements, data.data]);
      }
    }

    setInputTitle("");
    setInputAmount("");
    setInputPrice("");
  };

  const handleSort = (e) => {
    setSortByPrice(e.target.value);
    setSearchParams({ sort: e.target.value });
  };

  return (
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
      <div className={styles.input}>
        <Input
          value={inputAmount}
          onChange={(event) => setInputAmount(event.target.value)}
          type="number"
          placeholder="Enter the count"
        />
      </div>
      <div>
        <Input
          value={inputPrice}
          onChange={(event) => setInputPrice(event.target.value)}
          type="number"
          placeholder="Enter the price"
        />
      </div>
      <Button className={styles.buttons} type="primary" onClick={handleAddItem}>
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
      <div className={styles.select}>
        Sort by price:
        <select
          value={sortByPrice}
          onChange={handleSort}
          className={styles.select}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}
