import React, { useState, useEffect, useContext, useCallback } from "react";
import { Button, Input, Form } from "antd";
import { CommentType } from "../types";
import { comments } from "../../../api/comments";
import { AuthContext } from "../../../context/AuthContext";
import styles from "../../Item/item.module.css";

interface Props {
  productId: string;
}

interface CommentTree extends CommentType {
  replies?: CommentTree[];
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

  const buildCommentTree = (
    comments: CommentType[],
    parentId: string | null = null
  ): CommentTree[] => {
    const commentTree: CommentTree[] = comments
      .filter((comment) => comment.parentCommentId === parentId)
      .map((comment) => ({
        ...comment,
        replies: buildCommentTree(comments, comment.id),
      }));

    return commentTree;
  };

  const renderComments = (comments: CommentTree[]): JSX.Element[] => {
    return comments.map((comment) => (
      <div key={comment.id} className={styles.commentContainer}>
        <div className={styles.username}>{comment.userId}</div>
        {editingComment?.id === comment.id ? (
          <Input.TextArea
            value={editingComment?.text}
            onChange={(e) =>
              editingComment &&
              setEditingComment({
                id: editingComment.id,
                text: e.target.value,
              })
            }
            onPressEnter={() => handleEditComment(comment.id)}
          />
        ) : (
          <div className={styles.commentText}>
            <p>{comment.text}</p>
          </div>
        )}
        <div className={styles.commentDate}>
          {new Date(comment.date).toLocaleString()}
        </div>

        {replyingTo === comment.id && (
          <div className={styles.replyInputContainer}>
            <Input.TextArea
              rows={2}
              value={replyTexts[comment.id] || ""}
              onChange={(e) =>
                setReplyTexts((prev) => ({
                  ...prev,
                  [comment.id]: e.target.value,
                }))
              }
              placeholder="Write a reply..."
            />
            <Button
              type="primary"
              className={styles.buttons}
              onClick={() => handleAddReply(comment.id)}
            >
              Submit Reply
            </Button>
          </div>
        )}

        <div className={styles.buttonContainer}>
          <Button type="link" onClick={() => handleReplyToComment(comment.id)}>
            Reply
          </Button>
          <Button
            type="link"
            onClick={() =>
              setEditingComment({ id: comment.id, text: comment.text })
            }
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteComment(comment.id)}
          >
            Delete
          </Button>
        </div>

        {comment.replies && renderComments(comment.replies)}
      </div>
    ));
  };

  const commentsTree = buildCommentTree(commentList);

  return (
    <div>
      {loading ? <div>Loading...</div> : renderComments(commentsTree)}
      <Form.Item>
        <Input.TextArea
          rows={4}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          className={styles.buttons}
          type="primary"
          onClick={handleAddComment}
        >
          Add Comment
        </Button>
      </Form.Item>
    </div>
  );
};

export default CommentSection;
