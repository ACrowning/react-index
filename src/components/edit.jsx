import React, { useState } from "react";

export default function Edit({ item, onItemClick }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.title);

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
        <input
          type="text"
          value={editText}
          onChange={(event) => setEditText(event.target.value)}
          onBlur={handleInputEdit}
          onKeyDown={handleInputKey}
          autoFocus
        />
      ) : (
        <div onClick={handleItemClick}>{item.title}</div>
      )}
      <button onClick={() => handleInputEdit(item.id)}>Save</button>
    </div>
  );
}
