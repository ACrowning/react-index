import React, { useState, useEffect, useContext, useCallback } from "react";
import { List, Button, Input, Form } from "antd";
import { CommentType } from "../types";
import { comments } from "../../../api/comments";
import { AuthContext } from "../../../context/AuthContext";
import styles from "../../Item/item.module.css";

interface Props {
  productId: string;
}

const CommentSection: React.FC<Props> = ({ productId }) => {
  const [commentList, setCommentList] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  const [editingComment, setEditingComment] = useState<{
    id: string;
    text: string;
  } | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { user } = context;

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const response = await comments.getComments();
    if (response.data) {
      setCommentList(response.data);
    } else {
      console.error("Error fetching comments:", response.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!user) return;

    const response = await comments.addComment(
      productId,
      newComment,
      user.username,
      undefined
    );

    if (response.data) {
      setCommentList((prevComments) => [...prevComments, response.data]);
      setNewComment("");
    }
  };

  const handleAddReply = async (parentId: string) => {
    const replyText = replyTexts[parentId];
    if (!replyText?.trim()) return;
    if (!user) return;

    const response = await comments.addComment(
      productId,
      replyText,
      user.username,
      parentId
    );

    if (response.data) {
      setCommentList((prevComments) => [...prevComments, response.data]);
      setReplyTexts((prev) => ({ ...prev, [parentId]: "" }));
      setReplyingTo(null);
    }
  };

  const handleEditComment = async (id: string) => {
    if (!editingComment?.text.trim()) return;
    const response = await comments.updateComment(id, editingComment.text);
    if (response.data) {
      setCommentList((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id ? response.data : comment
        )
      );
      setEditingComment(null);
    }
  };

  const handleDeleteComment = async (id: string) => {
    const response = await comments.deleteComment(id);
    if (response.data) {
      setCommentList((prevComments) =>
        prevComments.filter((comment) => comment.id !== id)
      );
    }
  };

  const handleReplyToComment = (parentId: string) => {
    setReplyingTo(parentId);
  };

  const renderReplies = (parentId: string) => {
    return commentList
      .filter((reply) => reply.parentId === parentId)
      .map((reply) => (
        <div key={reply.id} className={styles.replyContainer}>
          <div className={styles.username}>{reply.user.username}</div>
          <p>{reply.text}</p>
          <div className={styles.commentDate}>
            {new Date(reply.date).toLocaleString()}
          </div>
          {replyingTo === reply.id && (
            <div className={styles.replyInputContainer}>
              <Input.TextArea
                rows={2}
                value={replyTexts[reply.id] || ""}
                onChange={(e) =>
                  setReplyTexts((prev) => ({
                    ...prev,
                    [reply.id]: e.target.value,
                  }))
                }
                placeholder="Write a reply..."
              />
              <Button
                type="primary"
                style={{ marginTop: 8 }}
                onClick={() => handleAddReply(reply.id)}
              >
                Submit Reply
              </Button>
            </div>
          )}
          <div className={styles.buttonContainer}>
            <Button type="link" onClick={() => handleReplyToComment(reply.id)}>
              Reply
            </Button>
            <Button
              type="link"
              onClick={() =>
                setEditingComment({ id: reply.id, text: reply.text })
              }
            >
              Edit
            </Button>
            <Button
              type="link"
              danger
              onClick={() => handleDeleteComment(reply.id)}
            >
              Delete
            </Button>
          </div>
          {renderReplies(reply.id)}
        </div>
      ));
  };

  return (
    <div>
      <List
        loading={loading}
        dataSource={commentList.filter((comment) => !comment.parentId)}
        renderItem={(item: CommentType) => (
          <div key={item.id} className={styles.commentContainer}>
            <div className={styles.username}>{user!.username}</div>
            {editingComment?.id === item.id ? (
              <Input.TextArea
                value={editingComment?.text}
                onChange={(e) =>
                  editingComment &&
                  setEditingComment({
                    id: editingComment.id,
                    text: e.target.value,
                  })
                }
                onPressEnter={() => handleEditComment(item.id)}
              />
            ) : (
              <div className={styles.commentText}>
                <p>{item.text}</p>
              </div>
            )}
            <div className={styles.commentDate}>
              {new Date(item.date).toLocaleString()}
            </div>

            {replyingTo === item.id && (
              <div className={styles.replyInputContainer}>
                <Input.TextArea
                  rows={2}
                  value={replyTexts[item.id] || ""}
                  onChange={(e) =>
                    setReplyTexts((prev) => ({
                      ...prev,
                      [item.id]: e.target.value,
                    }))
                  }
                  placeholder="Write a reply..."
                />
                <Button
                  type="primary"
                  style={{ marginTop: 8 }}
                  onClick={() => handleAddReply(item.id)}
                >
                  Submit Reply
                </Button>
              </div>
            )}

            <div className={styles.buttonContainer}>
              <Button type="link" onClick={() => handleReplyToComment(item.id)}>
                Reply
              </Button>
              <Button
                type="link"
                onClick={() =>
                  setEditingComment({ id: item.id, text: item.text })
                }
              >
                Edit
              </Button>
              <Button
                type="link"
                danger
                onClick={() => handleDeleteComment(item.id)}
              >
                Delete
              </Button>
            </div>

            {renderReplies(item.id)}
          </div>
        )}
      />
      <Form.Item>
        <Input.TextArea
          rows={4}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary" onClick={handleAddComment}>
          Add Comment
        </Button>
      </Form.Item>
    </div>
  );
};

export default CommentSection;
