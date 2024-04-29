import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { products } from "../../api/products.js";

export default function ItemPage() {
  const [element, setElement] = useState();
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const { data, error } = await products.getProductById(id);

      if (error) {
        setElement([]);
      } else {
        setElement(data);
      }
    })();
  }, [id]);
  if (!element) return <div>Loading...</div>;

  return (
    <div>
      <h2>{element.title}</h2>
      <p>You selected item: {id}</p>
      <p>Amount: {element.amount}</p>
    </div>
  );
}
