import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "../Item/item.module.css";
import { products } from "../../api/products.js";
import { comments } from "../../api/comments.js";
import Comment from "./components/Comment.jsx";
import Album from "./components/Album.jsx";
import { Form, Input, Button } from "antd";

export default function ItemPage() {
  const { id } = useParams();
  const [element, setElement] = useState();
  const [inputComment, setInputComment] = useState("");

  const fetchProduct = async () => {
    const { data, error } = await products.getProductById(id);
    if (error) {
      setElement([]);
    } else {
      setElement(data.data);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!element) return <div>Loading...</div>;

  const handleAddComment = async () => {
    if (!inputComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }
    const newComment = {
      productId: id,
      text: inputComment,
    };
    const { data, error } = await comments.addComment(newComment);

    if (error) {
      setElement([]);
    } else {
      setElement((prevProduct) => ({
        ...prevProduct,
        comments: [...prevProduct.comments, data.data],
      }));
    }
    fetchProduct();
    setInputComment("");
  };

  const refreshComments = () => {
    fetchProduct();
  };

  const imageUrl = element.image
    ? `http://localhost:4000/static/${element.image}`
    : "https://picsum.photos/300/300?random";

  return (
    <div>
      <h2>{element.title}</h2>
      <p>You selected item: {id}</p>
      <div className={styles.imgContainer}>
        <img className={styles.img} src={imageUrl} alt={element.title}></img>
      </div>
      <div className={styles.albumContainer}>
        <Album albumPhotos={element.albumPhotos} />
      </div>

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
            <Comment
              key={comment.id}
              comment={comment}
              productId={id}
              refreshComments={refreshComments}
            />
          ))}
        </ul>
      ) : (
        <p>No comments available.</p>
      )}
    </div>
  );
}
