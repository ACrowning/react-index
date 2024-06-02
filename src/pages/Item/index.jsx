import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "../Item/item.module.css";
import { products } from "../../api/products.js";
import Comment from "./components/Comment.jsx";
import { Form, Input, Button } from "antd";

export default function ItemPage() {
  const { id } = useParams();
  const [element, setElement] = useState();
  const [inputComment, setInputComment] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await products.getProductById(id);

      if (error) {
        setElement([]);
      } else {
        setElement(data.data);
      }
    })();
  }, [id]);
  if (!element) return <div>Loading...</div>;

  const handleAddComment = async () => {
    const newComment = {
      productId: id,
      text: inputComment,
    };
    const { data, error } = await products.addComment(newComment);

    if (error) {
      setElement([]);
    } else {
      setElement((prevProduct) => ({
        ...prevProduct,
        comments: [...prevProduct.comments, data.data],
      }));
    }
    setInputComment("");
  };

  return (
    <div>
      <h2>{element.title}</h2>
      <p>You selected item: {id}</p>
      <p>Amount: {element.amount}</p>
      <h2 className={styles.comment}>Add a Comment</h2>
      <Form onFinish={handleAddComment}>
        <Form.Item label="Comment" required>
          <Input.TextArea
            value={inputComment}
            onChange={(e) => setInputComment(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button className={styles.buttons} type="primary" htmlType="submit">
            Add Comment
          </Button>
        </Form.Item>
      </Form>
      <h2>Comments</h2>
      {element.comments.length > 0 ? (
        <ul>
          {element.comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </ul>
      ) : (
        <p>No comments available.</p>
      )}
    </div>
  );
}
