import React, { useState } from "react";

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
          <input
            type="text"
            value={editText}
            onChange={(event) => setEditText(event.target.value)}
            onBlur={handleInputEdit}
            onKeyDown={handleInputKey}
            autoFocus
          />
          <button onClick={() => handleInputEdit(item.title)}>Save</button>
        </div>
      ) : (
        <div onClick={handleItemClick}>{item.title} </div>
      )}
      <div onClick={handleIsDone}>
        <div style={{ textDecoration: item.done ? "line-through" : "none" }}>
          <div>Done status</div>
        </div>
      </div>
    </div>
  );
}
