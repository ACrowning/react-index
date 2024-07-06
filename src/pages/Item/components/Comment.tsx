import React, { useContext, useState } from "react";
import { Form, Input, Button } from "antd";
import styles from "../../Item/item.module.css";
import { comments } from "../../../api/comments";
import { Comment as CommentType } from "../types";
import { AuthContext } from "../../../context/AuthContext";

interface Props {
  comment: CommentType;
  productId: string;
  refreshComments: () => void;
}

const Comment = ({ comment, productId, refreshComments }: Props) => {
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showReplies, setShowReplies] = useState(false);
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  const { user } = context;

  const handleReply = async () => {
    if (!replyText.trim()) {
      alert("Reply cannot be empty");
      return;
    }
    const newComment = {
      productId,
      text: replyText,
      user: comment.user,
      parentCommentId: comment.id,
    };
    const { data, error } = await comments.addComment(newComment);
    if (!error) {
      refreshComments();
      setReplyText("");
      setIsReplying(false);
    }
  };

  const handleReplyClick = () => {
    setIsReplying(true);
    setReplyText(`${comment.user.name}, `);
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
    handleUpdate();
  };

  const handleInputKey = (event: any) => {
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

  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const countReplies = (comment: any) => {
    let count = comment.comments.length;
    for (let reply of comment.comments) {
      count += countReplies(reply);
    }
    return count;
  };

  return (
    <li>
      <p>
        <strong>{comment.user.name}</strong>
      </p>
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
          {user && (
            <Button type="link" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
          {user && (
            <Button type="link" onClick={handleReplyClick}>
              {isReplying ? "Cancel" : "Reply"}
            </Button>
          )}
          {user && (
            <Button type="link" danger onClick={handleDelete}>
              Delete
            </Button>
          )}
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
        <>
          <Button type="link" onClick={handleToggleReplies}>
            {showReplies ? "Hide" : `Show (${countReplies(comment)})`}
          </Button>
          {showReplies && (
            <ul>
              {comment.comments.map((subComment: any) => (
                <Comment
                  key={subComment.id}
                  comment={subComment}
                  productId={productId}
                  refreshComments={refreshComments}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </li>
  );
};

export default Comment;
