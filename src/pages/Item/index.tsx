import { useParams } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import styles from "../Item/item.module.css";
import { products } from "../../api/products";
import { comments } from "../../api/comments";
import Comment from "./components/Comment";
import Album from "./components/Album";
import { Form, Input, Button } from "antd";
import { Product, Comment as CommentType } from "./types";
import { AuthContext } from "../../context/AuthContext";

const ItemPage: React.FC = () => {
  const { id } = useParams<any>();
  const [element, setElement] = useState<Product | null>(null);
  const [inputComment, setInputComment] = useState<string>("");
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  const { user } = context;

  const fetchProduct = async () => {
    const { data, error } = await products.getProductById(id);
    if (error) {
      setElement(null);
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
      user,
    };
    const { data, error } = await comments.addComment(newComment);

    if (error) {
      setElement(null);
    } else {
      setElement((prevProduct) => ({
        ...prevProduct!,
        comments: [...prevProduct!.comments, data.data],
      }));
    }
    setInputComment("");
    fetchProduct();
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
      <h2 className={styles.comment}>{user && "Add a Comment"}</h2>
      <div>
        {user && (
          <Form onFinish={handleAddComment}>
            <Form.Item label="Comment" required>
              <Input.TextArea
                value={inputComment}
                onChange={(e) => setInputComment(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                className={styles.buttons}
                type="primary"
                htmlType="submit"
              >
                Add Comment
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>

      <h2>Comments</h2>
      {element.comments.length > 0 ? (
        <ul>
          {element.comments.map((comment: CommentType) => (
            <Comment
              key={comment.id}
              comment={comment}
              user={user}
              productId={id!}
              refreshComments={refreshComments}
            />
          ))}
        </ul>
      ) : (
        <p>No comments available.</p>
      )}
    </div>
  );
};

export default ItemPage;
