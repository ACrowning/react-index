import { Modal, List, Button } from "antd";
import React, { useContext, useEffect } from "react";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import styles from "../app.module.css";
import { cart } from "../../../api/cart";
import { products } from "../../../api/products";
import { AuthContext } from "../../../context/AuthContext";
import { CartItem, Product } from "../../../constants/types";

interface Props {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  elements: Product[];
  setElements: (elements: Product[]) => void;
}

export function ShopCartModal({
  modalOpen,
  setModalOpen,
  cartItems,
  setCartItems,
  elements,
  setElements,
}: Props) {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { user } = context;

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data, error } = await cart.getCart(user.id);

      if (error) {
        setCartItems([]);
        return;
      }

      if (!Array.isArray(data.data)) {
        setCartItems([]);
        return;
      }

      setCartItems(data.data);
    })();
  }, [setCartItems, user?.id]);

  const handleShopCardRemove = async (cartItemId: string) => {
    if (!user) return;
    const removedItem = cartItems.find(
      (item) => item.cartItemId === cartItemId
    );
    if (!removedItem) return;

    const elementToUpdate = elements.find(
      (element) => element.id === removedItem.product.id
    );
    if (!elementToUpdate) return;

    const amountReturn = elementToUpdate.amount + removedItem.amount;

    const { error } = await cart.removeFromCart(
      removedItem.cartItemId,
      user.id,
      removedItem.product.id,
      removedItem.amount
    );
    await products.updateProduct(removedItem.product.id, amountReturn);

    if (error) {
      console.error("Error removing from cart:", error);
    } else {
      setCartItems(cartItems.filter((item) => item.cartItemId !== cartItemId));
      const updatedElements = elements.map((element: Product) =>
        element.id === removedItem.product.id
          ? { ...element, amount: amountReturn }
          : element
      );

      setElements(updatedElements);
    }
  };

  const handleCartPlus = async (productId: string) => {
    if (!user) return;
    const itemToUpdate = cartItems.find(
      (item) => item.product.id === productId
    );
    const elementToUpdate = elements.find(
      (element) => element.id === productId
    );

    if (!itemToUpdate || !elementToUpdate || elementToUpdate.amount === 0)
      return;

    const updatedAmount = itemToUpdate.amount + 1;
    const amountReturn = elementToUpdate.amount - 1;

    const { error } = await cart.addToCart(user.id, productId, updatedAmount);
    await products.updateProduct(productId, amountReturn);

    if (error) {
      console.error("Error adding to cart:", error);
    } else {
      const updatedCartItems = cartItems.map((item: CartItem) =>
        item.product.id === productId
          ? { ...item, amount: updatedAmount }
          : item
      );
      setCartItems(updatedCartItems);

      const updatedElements = elements.map((element: Product) =>
        element.id === productId
          ? { ...element, amount: amountReturn }
          : element
      );
      setElements(updatedElements);
    }
  };

  const handleCartMinus = async (productId: string) => {
    if (!user) return;
    const itemToUpdate = cartItems.find(
      (item) => item.product.id === productId
    );
    const elementToUpdate = elements.find(
      (element) => element.id === productId
    );

    if (!itemToUpdate || !elementToUpdate) return;

    const updatedAmount = itemToUpdate.amount - 1;
    const amountReturn = elementToUpdate.amount + 1;

    if (updatedAmount <= 0) {
      await handleShopCardRemove(itemToUpdate.cartItemId);
    } else {
      const { error } = await cart.addToCart(user.id, productId, updatedAmount);
      await products.updateProduct(productId, amountReturn);

      if (error) {
        console.error("Error updating cart:", error);
      } else {
        const updatedCartItems = cartItems.map((item: CartItem) =>
          item.product.id === productId
            ? { ...item, amount: updatedAmount }
            : item
        );
        setCartItems(updatedCartItems);

        const updatedElements = elements.map((element: Product) =>
          element.id === productId
            ? { ...element, amount: amountReturn }
            : element
        );
        setElements(updatedElements);
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
        renderItem={(item: CartItem) => (
          <List.Item
            actions={[
              <PlusSquareOutlined
                className={styles.iconsStyle}
                onClick={() => handleCartPlus(item.product.id)}
              />,
              <MinusSquareOutlined
                className={styles.iconsStyle}
                onClick={() => handleCartMinus(item.product.id)}
              />,
              <Button
                type="link"
                onClick={() => handleShopCardRemove(item.cartItemId)}
              >
                Remove
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={item.product.title}
              description={
                <>
                  <div>Amount: {item.amount}</div>
                  <div>Price: {item.product.price}</div>
                </>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
}
