import { Modal, List } from "antd";
import React, { useEffect } from "react";
import styles from "../app.module.css";
import { PlusSquareOutlined } from "@ant-design/icons";
import { MinusSquareOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { cart } from "../../../api/cart.js";
import { products } from "../../../api/products.js";

export function ShopCartModal({
  modalOpen,
  setModalOpen,
  cartItems,
  setCartItems,
  elements,
  setElements,
}) {
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

  return (
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
              <Button type="link" onClick={() => handleShopCardRemove(item.id)}>
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
  );
}
