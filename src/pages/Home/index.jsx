import React, { useState, useEffect } from "react";
import styles from "../Home/app.module.css";
import Item from "./components/item.jsx";
import { Button } from "antd";
import { Input } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { PlusSquareOutlined } from "@ant-design/icons";
import { MinusSquareOutlined } from "@ant-design/icons";
import { Modal, List } from "antd";
import { cart } from "../../api/cart.js";
import { products } from "../../api/products.js";

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
      const { data, error } = await products.getProducts(
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

  useEffect(() => {
    (async () => {
      const { data, error } = await cart.getCart();
      if (error) {
        setCartItems([]);
      } else {
        setCartItems(data.data);
      }
    })();
  }, []);

  const handleDeleteItem = async (itemsId) => {
    const itemsDeleted = elements.filter((element) => element.id !== itemsId);

    const { error } = await products.deleteProduct(itemsId);

    if (error) {
      setElements([]);
    } else {
      setElements([...itemsDeleted]);
    }
  };

  const handleShopCardRemove = async (itemsId) => {
    const itemsDeleted = cartItems.filter((item) => item.id !== itemsId);
    const removedItem = cartItems.find((item) => item.id === itemsId);
    const elementToUpdate = elements.find((element) => element.id === itemsId);
    const amountReturn = elementToUpdate.amount + removedItem.amount;

    const { error } = await cart.removeFromCart(itemsId);
    await products.updateProductAmount(itemsId, amountReturn);

    if (error) {
      setElements([]);
    } else {
      setCartItems(itemsDeleted);
      setElements((prevElements) =>
        prevElements.map((element) =>
          element.id === itemsId
            ? { ...element, amount: amountReturn }
            : element
        )
      );
    }
  };

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

    const { error } = await cart.cartPlusMinus(productId, changes);
    await products.updateProductAmount(productId, amountReturn);

    if (error) {
      setCartItems([]);
    } else {
      setCartItems((prevElements) =>
        prevElements.map((element) =>
          element.id === productId
            ? { ...element, amount: updatedAmount }
            : element
        )
      );
    }
  };

  const handleCartMinus = async (productId) => {
    const itemToUpdate = cartItems.find((item) => item.id === productId);
    const elementToUpdate = elements.find(
      (element) => element.id === productId
    );
    const itemsDeleted = cartItems.filter((item) => item.id !== productId);

    const updatedAmount = itemToUpdate.amount - 1;
    const amountReturn = (elementToUpdate.amount += 1);
    const changes = {
      amount: updatedAmount,
    };
    if (itemToUpdate.amount <= 1) {
      const { error } = await cart.removeFromCart(productId);
      await products.updateProductAmount(productId, amountReturn);
      if (error) {
        setCartItems([]);
      } else {
        setCartItems(itemsDeleted);
      }
    } else {
      const { error } = await cart.cartPlusMinus(productId, changes);
      await products.updateProductAmount(productId, amountReturn);

      if (error) {
        setCartItems([]);
      } else {
        setCartItems((prevElements) =>
          prevElements.map((element) =>
            element.id === productId
              ? { ...element, amount: updatedAmount }
              : element
          )
        );
      }
    }
  };

  const handleElementClick = async (productId, newText) => {
    const { error } = await products.editTitle(productId, newText);

    if (error) {
      setElements([]);
    } else {
      setElements((prevElements) =>
        prevElements.map((element) =>
          element.id === productId ? { ...element, title: newText } : element
        )
      );
    }
  };

  const handleAmountEdit = async (productId, newCount) => {
    const changes = {
      amount: parseInt(productId.amount - newCount),
    };
    const { error } = await products.changeAmount(productId.id, changes);

    if (error) {
      setElements([]);
    } else {
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
    const newItem = {
      id: element.id,
      title: element.title,
      amount: parseInt(newCount),
      price: element.price,
    };
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === newItem.id
    );

    const { error } = await cart.addToCart(newItem);

    if (error) {
      setCartItems([]);
    } else if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].amount += newItem.amount;
      setCartItems([...cartItems]);
    } else {
      setCartItems([...cartItems, newItem]);
    }
  };

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
                      className={styles.iconsStyle}
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
