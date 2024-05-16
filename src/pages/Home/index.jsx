import React, { useState, useEffect } from "react";
import styles from "../Home/app.module.css";
import { List } from "./components/List.jsx";
import { Navbar } from "./components/TheNavbar.jsx";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { ShopCartModal } from "./components/ShopCartModal.jsx";
import { cart } from "../../api/cart.js";
import { products } from "../../api/products.js";
import { Pagination } from "antd";

function Home() {
  const [elements, setElements] = useState([]);
  const [searchElement, setSearchElement] = useState("");
  const [sumCard, setSumCard] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState();
  const [currentLimit, setCurrentLimit] = useState();
  const [totalPages, setTotalPages] = useState();

  // useEffect(() => {
  //   (async () => {
  //     const { data, error } = await products.getProducts(
  //       searchElement,
  //       sortByPrice,
  //       currentPage,
  //       currentLimit
  //     );
  //     if (error) {
  //       setElements([]);
  //     } else {
  //       setCurrentLimit(currentLimit);
  //       setCurrentPage(currentPage);
  //       setTotalPages(data.total);
  //       setElements(data);
  //     }
  //   })();
  // }, [searchElement, sortByPrice]);

  const fetchData = async () => {
    (async () => {
      const { data, error } = await products.getProducts(
        searchElement,
        sortByPrice,
        currentPage,
        currentLimit
      );
      if (error) {
        setElements([]);
      } else {
        setCurrentLimit(currentLimit);
        setCurrentPage(currentPage);
        setTotalPages(data.total);
        setElements(data);
      }
    })();
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = () => {
    setCurrentPage(currentPage);
  };

  const onShowSizeChange = () => {
    console.log(currentPage, totalPages);
  };

  const handleDeleteItem = async (itemsId) => {
    const itemsDeleted = elements.filter((element) => element.id !== itemsId);

    const { error } = await products.deleteProduct(itemsId);

    if (error) {
      setElements([]);
    } else {
      setElements([...itemsDeleted]);
    }
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
        <div>
          <header className={styles.top}>
            <div className={styles.circle}>{sumCard}</div>
            <ShoppingCartOutlined
              className={styles.iconCart}
              onClick={handleShopCardClick}
            />
          </header>
          <ShopCartModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            cartItems={cartItems}
            setCartItems={setCartItems}
            elements={elements}
            setElements={setElements}
          />
        </div>
        <div className={styles.containerStyle}>
          <Navbar
            elements={elements}
            setElements={setElements}
            searchElement={searchElement}
            setSearchElement={setSearchElement}
            sortByPrice={sortByPrice}
            setSortByPrice={setSortByPrice}
          />

          <div className={styles.container}>
            <List
              handleDeleteItem={handleDeleteItem}
              handleToggle={handleToggle}
              sortedElements={elements}
              handleElementClick={handleElementClick}
              handleAmountEdit={handleAmountEdit}
              addToCart={addToCart}
            />
            <div>
              <Pagination
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
                onChange={handlePageChange}
                defaultCurrent={1}
                total={20}
              />
              <br />
              <Pagination
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
                defaultCurrent={1}
                total={100}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
