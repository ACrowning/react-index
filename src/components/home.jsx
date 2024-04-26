import React, { useState, useEffect } from "react";
import styles from "../app.module.css";
import Item from "../components/item.jsx";
// import Mock from "../components/mock/mock.jsx";
import { Button } from "antd";
import { Input } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { PlusSquareOutlined } from "@ant-design/icons";
import { MinusSquareOutlined } from "@ant-design/icons";
import { Modal, List } from "antd";
import { cart } from "../api/cart.js";
import { products } from "../api/products.js";

function Home() {
  const [elements, setElements] = useState([]);
  const [inputTitle, setInputTitle] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [searchElement, setSearchElement] = useState("");
  const [sumCard, setSumCard] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("asc");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await products.fetchSortedElements(
        searchElement,
        sortByPrice
      );

      if (error) {
        setElements([]);
      } else {
        setElements(data);
      }
    })();
  }, [searchElement, sortByPrice]);

  const handleSort = (e) => {
    setSortByPrice(e.target.value);
  };

  const handleDeleteItem = async (itemsId) => {
    try {
      const itemsDeleted = elements.filter((element) => element.id !== itemsId);

      const response = await fetch(
        `http://localhost:4000/products/${itemsId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      setElements(itemsDeleted);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const handleShopCardRemove = async (itemsId) => {
    try {
      const itemsDeleted = cartItems.filter((item) => item.id !== itemsId);
      const removedItem = cartItems.find((item) => item.id === itemsId);
      const elementToUpdate = elements.find(
        (element) => element.id === itemsId
      );
      const amountReturn = elementToUpdate.amount + removedItem.amount;

      const deleteResponse = await fetch(
        `http://localhost:4000/cart/${itemsId}`,
        {
          method: "DELETE",
        }
      );
      if (!deleteResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const updateResponse = await fetch(
        `http://localhost:4000/products/${itemsId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: amountReturn }),
        }
      );
      const data = await updateResponse.json();
      console.log(data);
      setCartItems(itemsDeleted);
      setElements((prevElements) =>
        prevElements.map((element) =>
          element.id === itemsId
            ? { ...element, amount: amountReturn }
            : element
        )
      );
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const handleAddItem = async () => {
    const url = "http://localhost:4000/products/create";
    const newItem = {
      title: inputTitle,
      amount: inputAmount,
      price: inputPrice,
      favorite: false,
    };
    if (inputAmount === "" || inputTitle === "") {
      alert("Enter the title and the count!");
    } else {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const responseData = await response.json();
        console.log(responseData);
        setElements([...elements, responseData.data]);
      } catch (error) {
        console.error("There was a problem with your POST request:", error);
      }
    }

    setInputTitle("");
    setInputAmount("");
    setInputPrice("");
  };

  const handleToggle = (productId) => {
    setElements((prevElements) =>
      prevElements.map((element) =>
        element.id === productId
          ? { ...element, favorite: !element.favorite }
          : element
      )
    );
  };

  const handleCartPlus = async (productId) => {
    const url = `http://localhost:4000/cart/${productId}`;

    const itemToUpdate = cartItems.find((item) => item.id === productId);
    const elementToUpdate = elements.find(
      (element) => element.id === productId
    );

    if (elementToUpdate.amount === 0) {
      return;
    }

    const updatedAmount = (itemToUpdate.amount += 1);
    const amountReturn = Math.max((elementToUpdate.amount -= 1), 0);

    const changes = {
      amount: updatedAmount,
    };
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changes),
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updateResponse = await fetch(
        `http://localhost:4000/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: amountReturn }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await updateResponse.json();
      console.log(data);

      setCartItems((prevElements) =>
        prevElements.map((element) =>
          element.id === productId
            ? { ...element, amount: updatedAmount }
            : element
        )
      );
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const handleCartMinus = async (productId) => {
    const url = `http://localhost:4000/cart/${productId}`;

    const itemToUpdate = cartItems.find((item) => item.id === productId);
    const elementToUpdate = elements.find(
      (element) => element.id === productId
    );

    if (itemToUpdate.amount === 0) {
      return;
    }

    const updatedAmount = Math.max((itemToUpdate.amount -= 1), 0);
    const amountReturn = (elementToUpdate.amount += 1);

    const changes = {
      amount: updatedAmount,
    };
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changes),
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updateResponse = await fetch(
        `http://localhost:4000/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: amountReturn }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await updateResponse.json();
      console.log(data);

      setCartItems((prevElements) =>
        prevElements.map((element) =>
          element.id === productId
            ? { ...element, amount: updatedAmount }
            : element
        )
      );
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const handleElementClick = async (productId, newText) => {
    const url = `http://localhost:4000/products/${productId}`;
    const changes = {
      title: newText,
    };
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changes),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log(responseData);

      setElements((prevElements) =>
        prevElements.map((element) =>
          element.id === productId ? { ...element, title: newText } : element
        )
      );
    } catch (error) {
      console.error("There was a problem with your PUT request:", error);
    }
  };

  const handleAmountEdit = async (productId, newCount) => {
    const url = `http://localhost:4000/products/${productId.id}`;
    const changes = {
      amount: parseInt(productId.amount - newCount),
    };
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changes),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log(responseData);

      setElements((prevElements) =>
        prevElements.map((element) =>
          element.id === productId.id
            ? {
                ...element,
                amount: Math.max(0, element.amount - newCount),
              }
            : element
        )
      );
    } catch (error) {
      console.error("There was a problem with your PUT request:", error);
    }
  };

  useEffect(() => {
    const totalItems = cartItems.reduce(
      (total, item) => total + item.amount,
      0
    );
    setSumCard(totalItems);
  }, [cartItems]);

  const addToCart = async (element, newCount) => {
    try {
      const url = `http://localhost:4000/cart`;
      const newItem = {
        id: element.id,
        title: element.title,
        amount: parseInt(newCount),
        price: element.price,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].amount += newItem.amount;
        setCartItems([...cartItems]);
      } else {
        setCartItems([...cartItems, newItem]);
      }
    } catch (error) {
      console.error("There was a problem with your POST request:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/cart");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const responseData = await response.json();

        setCartItems(responseData.data);
      } catch (error) {
        console.error("There was a problem with your GET request:", error);
      }
    };

    fetchData();
  }, []);

  const handleShopCardClick = () => {
    setModalOpen(true);
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
          <Modal
            open={modalOpen}
            title="Shopping Cart"
            onCancel={() => setModalOpen(false)}
            footer={[
              <Button key="back" onClick={() => setModalOpen(false)}>
                Close
              </Button>,
            ]}
          >
            <List
              itemLayout="horizontal"
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <PlusSquareOutlined
                      className={styles.iconsStyle}
                      onClick={() => handleCartPlus(item.id)}
                    ></PlusSquareOutlined>,
                    <MinusSquareOutlined
                      className={`${styles.iconsStyle} ${
                        item.amount === 0 ? styles.zero : ""
                      }`}
                      onClick={() => handleCartMinus(item.id)}
                    ></MinusSquareOutlined>,
                    <Button
                      type="link"
                      onClick={() => handleShopCardRemove(item.id)}
                    >
                      Remove
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <>
                        <div>Amount: {item.amount}</div>
                        <div>Price: {item.price}</div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Modal>
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

          <div className={styles.container}>
            <Item
              handleDeleteItem={handleDeleteItem}
              handleToggle={handleToggle}
              sortedElements={elements}
              handleElementClick={handleElementClick}
              handleAmountEdit={handleAmountEdit}
              addToCart={addToCart}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
