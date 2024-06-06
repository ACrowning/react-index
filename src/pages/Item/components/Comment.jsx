import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import styles from "../../Item/item.module.css";
import { comments } from "../../../api/comments.js";

const Comment = ({ comment, productId, refreshComments }) => {
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const handleReply = async () => {
    if (!replyText.trim()) {
      alert("Reply cannot be empty");
      return;
    }
    const newComment = {
      productId,
      text: replyText,
      parentCommentId: comment.id,
    };
    const { data, error } = await comments.addComment(newComment);
    if (!error) {
      refreshComments();
      setReplyText("");
      setIsReplying(false);
    }
  };

  const handleUpdate = async () => {
    const { data, error } = await comments.editComment(comment.id, editText);
    if (!error) {
      refreshComments();
      setIsEditing(false);
    }
  };

  const handleInputEdit = () => {
    setIsEditing(false);
    handleUpdate(comment.id, editText);
  };

  const handleInputKey = (event) => {
    if (event.key === "Enter") {
      handleInputEdit();
    }
  };

  const handleDelete = async () => {
    const { data, error } = await comments.deleteComment(comment.id);
    if (!error) {
      refreshComments();
    }
  };

  return (
    <li>
      <p>
        {isEditing ? (
          <Input.TextArea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleInputEdit}
            onKeyDown={handleInputKey}
          />
        ) : (
          comment.text
        )}
      </p>
      <p className={styles.date}>{new Date(comment.date).toLocaleString()}</p>
      {isEditing ? (
        <>
          <Button type="link" onClick={handleUpdate}>
            Save
          </Button>
          <Button type="link" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Button type="link" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Button type="link" onClick={() => setIsReplying(!isReplying)}>
            {isReplying ? "Cancel" : "Reply"}
          </Button>
          <Button type="link" danger onClick={handleDelete}>
            Delete
          </Button>
        </>
      )}
      {isReplying && (
        <Form onFinish={handleReply}>
          <Form.Item label="Reply" required>
            <Input.TextArea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button className={styles.buttons} type="primary" htmlType="submit">
              Add Reply
            </Button>
          </Form.Item>
        </Form>
      )}

      {comment.comments && comment.comments.length > 0 && (
        <ul>
          {comment.comments.map((subComment) => (
            <Comment
              key={subComment.id}
              comment={subComment}
              productId={productId}
              refreshComments={refreshComments}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default Comment;
