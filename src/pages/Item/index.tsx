import { useParams } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import styles from "../Item/item.module.css";
import { products } from "../../api/products";
import Album from "./components/Album";
import { Product } from "./types";
import CommentsSection from "./components/Comments";

const ItemPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [element, setElement] = useState<Product | null>(null);

  const fetchProduct = useCallback(async () => {
    const { data, error } = await products.getProductById(id);

    if (error) {
      setElement(null);
    } else if (data && data.data) {
      setElement(data.data.product);
    } else {
      setElement(null);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  if (!element) return <div>Loading...</div>;

  const imageUrl = element.image
    ? `http://localhost:4000/static/${element.image}`
    : "https://picsum.photos/300/300?random";

  return (
    <div>
      <h2>{element.title}</h2>
      <p>You selected item: {id}</p>
      <div className={styles.imgContainer}>
        <img className={styles.img} src={imageUrl} alt={element.title} />
      </div>
      <div className={styles.albumContainer}>
        <Album albumPhotos={element.albumPhotos} />
      </div>

      <p>Amount: {element.amount}</p>

      <CommentsSection productId={id!} />
    </div>
  );
};

export default ItemPage;
