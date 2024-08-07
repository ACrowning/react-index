import React, { useState, useContext } from "react";
import { Input } from "antd";
import { Button } from "antd";
import { Link } from "react-router-dom";
import styles from "../app.module.css";
import { EditOutlined } from "@ant-design/icons";
import { StarOutlined } from "@ant-design/icons";
import { AuthContext } from "../../../context/AuthContext";

export default function Edit({ item, onItemClick, handleToggle }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState<any>(item.title);
  const [isFavorite, setIsFavorite] = useState(false);
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  const { user } = context;

  const handleIsFavorite = () => {
    setIsFavorite(!isFavorite);
    handleToggle(item.id);
  };

  const handleItemClick = () => {
    setIsEditing(true);
  };

  const handleInputEdit = () => {
    setIsEditing(false);
    onItemClick(item.id, editText);
  };

  const handleInputKey = (event: any) => {
    if (event.key === "Enter") {
      handleInputEdit();
    }
  };

  const imageUrl = item.image
    ? `http://localhost:4000/static/${item.image}`
    : "https://picsum.photos/300/300?random";

  return (
    <div>
      <div>
        {isEditing ? (
          <div>
            <Input
              type="text"
              value={editText}
              onChange={(event) => setEditText(event.target.value)}
              onBlur={handleInputEdit}
              onKeyDown={handleInputKey}
              autoFocus
            />

            <Button onClick={() => handleInputEdit()}>Save</Button>
          </div>
        ) : (
          <div className={styles.title} onClick={handleItemClick}>
            <Link to={`/item/${item.id}`} className={styles.link}>
              {item.title}
            </Link>

            {user && user.role !== "GUEST" && (
              <EditOutlined className={styles.iconEdit} />
            )}
          </div>
        )}
      </div>
      <div>
        <StarOutlined
          className={isFavorite ? styles.star : styles.starDefault}
          onClick={handleIsFavorite}
        ></StarOutlined>
      </div>

      <img className={styles.img} src={imageUrl} alt={item.title}></img>
    </div>
  );
}
