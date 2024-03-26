import React, { useState } from "react";
import { Input } from "antd";
import { Button } from "antd";
import { Link } from "react-router-dom";
import styles from "../app.module.css";
import { EditOutlined } from "@ant-design/icons";

export default function Edit({ item, onItemClick, handleToggle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.title);
  const [isDone, setIsDone] = useState(false);

  const handleIsDone = () => {
    setIsDone(!isDone);
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
      <div onClick={handleIsDone}>
        <div style={{ textDecoration: item.done ? "line-through" : "none" }}>
          <div className={styles.done}>Done status</div>
        </div>
      </div>
    </div>
  );
}
