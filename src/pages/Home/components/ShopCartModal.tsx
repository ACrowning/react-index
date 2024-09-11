import { Modal, List } from "antd";
import React, { useEffect } from "react";
import styles from "../app.module.css";
import { PlusSquareOutlined } from "@ant-design/icons";
import { MinusSquareOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { cart } from "../../../api/cart";
import { products } from "../../../api/products";

interface Props {
  modalOpen: any;
  setModalOpen: any;
  cartItems: any;
  setCartItems: any;
  elements: any;
  setElements: any;
}

export function ShopCartModal({
  modalOpen,
  setModalOpen,
  cartItems,
  setCartItems,
  elements,
  setElements,
}: Props) {
  useEffect(() => {
    (async () => {
      const { data, error } = await cart.getCart();
      if (error) {
        setCartItems([]);
      } else {
        setCartItems(data.data);
      }
    })();
  }, [setCartItems]);

  const handleShopCardRemove = async (itemsId: any) => {
    const itemsDeleted = cartItems.filter((item: any) => item.id !== itemsId);
    const removedItem = cartItems.find((item: any) => item.id === itemsId);
    const elementToUpdate = elements.find(
      (element: any) => element.id === itemsId
    );
    const amountReturn = elementToUpdate.amount + removedItem.amount;

    const { error } = await cart.removeFromCart(itemsId);
    await products.updateProduct(itemsId, amountReturn);

    if (error) {
      setElements([]);
    } else {
      setCartItems(itemsDeleted);
      setElements((prevElements: any) =>
        prevElements.map((element: any) =>
          element.id === itemsId
            ? { ...element, amount: amountReturn }
            : element
        )
      );
    }
  };

  const handleCartPlus = async (productId: any) => {
    const itemToUpdate = cartItems.find((item: any) => item.id === productId);
    const elementToUpdate = elements.find(
      (element: any) => element.id === productId
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
    await products.updateProduct(productId, amountReturn);

    if (error) {
      setCartItems([]);
    } else {
      setCartItems((prevElements: any) =>
        prevElements.map((element: any) =>
          element.id === productId
            ? { ...element, amount: updatedAmount }
            : element
        )
      );
    }
  };

  const handleCartMinus = async (productId: any) => {
    const itemToUpdate = cartItems.find((item: any) => item.id === productId);
    const elementToUpdate = elements.find(
      (element: any) => element.id === productId
    );
    const itemsDeleted = cartItems.filter((item: any) => item.id !== productId);

    const updatedAmount = itemToUpdate.amount - 1;
    const amountReturn = (elementToUpdate.amount += 1);
    const changes = {
      amount: updatedAmount,
    };
    if (itemToUpdate.amount <= 1) {
      const { error } = await cart.removeFromCart(productId);
      await products.updateProduct(productId, amountReturn);
      if (error) {
        setCartItems([]);
      } else {
        setCartItems(itemsDeleted);
      }
    } else {
      const { error } = await cart.cartPlusMinus(productId, changes);
      await products.updateProduct(productId, amountReturn);

      if (error) {
        setCartItems([]);
      } else {
        setCartItems((prevElements: any) =>
          prevElements.map((element: any) =>
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
        renderItem={(item: any) => (
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
