import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function ItemPage() {
  const [element, setElement] = useState();
  const { id } = useParams();

  useEffect(() => {
    const fetchElementData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/products/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const userData = await response.json();
        setElement(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchElementData();
  }, []);
  if (!element) return <div>Loading...</div>;

  return (
    <div>
      <h2>{element.title}</h2>
      <p>You selected item: {id}</p>
      <p>Amount: {element.amount}</p>
    </div>
  );
}
