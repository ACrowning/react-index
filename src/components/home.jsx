import React, { useState, useEffect } from "react";
import styles from "../app.module.css";
import Item from "../components/item.jsx";
// import Mock from "../components/mock/mock.jsx";
import { Button } from "antd";
import { Input } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { Modal, List } from "antd";

function Home() {
  const [elements, setElements] = useState([]);
  const [inputTitle, setInputTitle] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [searchElement, setSearchElement] = useState("");
  const [sumCard, setSumCard] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [sortedAmount, setSortedAmount] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/elements")
      .then((res) => res.json())
      .then((res) => {
        setElements(res.data);
      });
  }, []);

  const handleDeleteItem = (itemsId) => {
    const itemsDeleted = elements.filter((element) => element.id !== itemsId);

    fetch(`http://localhost:4000/elements/${itemsId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });

    setElements(itemsDeleted);
  };

  const handleAddItem = async () => {
    const url = "http://localhost:4000/elements";
    const newItem = {
      title: inputTitle,
      amount: inputAmount,
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
  };

  const handleToggle = (itemsIndex) => {
    setElements((prevElements) =>
      prevElements.map((element) =>
        element.id === itemsIndex
          ? { ...element, favorite: !element.favorite }
          : element
      )
    );
  };

  const filteredElements = elements.filter((item) =>
    item.title.toLowerCase().includes(searchElement.toLowerCase())
  );

  const filteredItems =
    sortedAmount === "all"
      ? filteredElements
      : filteredElements.filter((item) => item.amount > 0);

  filteredItems.sort((a, b) => a.amount - b.amount);

  const handleSort = (e) => {
    setSortedAmount(e.target.value);
    setSearchParams({ sort: e.target.value });
  };

  useEffect(() => {
    const sort = searchParams.get("sort");
    setSortedAmount(sort);
  }, [searchParams]);

  const handleElementClick = async (itemsIndex, newText) => {
    const url = `http://localhost:4000/elements/${itemsIndex}`;
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
          element.id === itemsIndex ? { ...element, title: newText } : element
        )
      );
    } catch (error) {
      console.error("There was a problem with your PUT request:", error);
    }
  };

  const handleAmountEdit = async (itemsIndex, newCount) => {
    const url = `http://localhost:4000/elements/${itemsIndex.id}`;
    const changes = {
      amount: parseInt(itemsIndex.amount - newCount),
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
          element.id === itemsIndex.id
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

  const addToCart = (element, newCount) => {
    const url = `http://localhost:4000/cart`;
    const newItem = {
      id: element.id,
      title: element.title,
      amount: parseInt(newCount),
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    };

    fetch(url, options)
      .then((response) => {
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
      })
      .catch((error) => {
        console.error("There was a problem with your POST request:", error);
      });
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
    setLoading(true);
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
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={handleShopCardClick}
              >
                Checkout
              </Button>,
            ]}
          >
            <List
              itemLayout="horizontal"
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={`Amount: ${item.amount}`}
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
            <div>
              Sort:
              <select
                value={sortedAmount}
                onChange={handleSort}
                className={styles.select}
              >
                <option value="all">all</option>
                <option value="existing">only existing</option>
              </select>
            </div>
          </div>

          <div className={styles.container}>
            <Item
              handleDeleteItem={handleDeleteItem}
              handleToggle={handleToggle}
              filteredItems={filteredItems}
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
