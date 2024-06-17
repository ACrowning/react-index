import React, { useState } from "react";
import { Input } from "antd";
import { Button } from "antd";
import { Link } from "react-router-dom";
import styles from "../app.module.css";
import { EditOutlined } from "@ant-design/icons";
import { StarOutlined } from "@ant-design/icons";

export default function Edit({ item, onItemClick, handleToggle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.title);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const handleInputKey = (event) => {
    if (event.key === "Enter") {
      handleInputEdit();
    }
  };

  return (
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
          <Button onClick={() => handleInputEdit(item.title)}>Save</Button>
        </div>
      ) : (
        <div className={styles.title} onClick={handleItemClick}>
          <Link to={`/item/${item.id}`} className={styles.link}>
            {item.title}
          </Link>

          <EditOutlined className={styles.iconEdit} />
        </div>
      )}

      <StarOutlined
        className={isFavorite ? styles.star : styles.starDefault}
        onClick={handleIsFavorite}
      ></StarOutlined>

      <img className={styles.img} src={item.image} alt={item.title}></img>
    </div>
  );
}
