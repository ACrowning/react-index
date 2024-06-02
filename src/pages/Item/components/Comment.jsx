const Comment = ({ comment }) => (
  <li>
    <p>{comment.text}</p>
    <p>
      <strong>Date:</strong> {comment.date}
    </p>
    {comment.comment.length > 0 && (
      <ul>
        {comment.comment.map((nestedComment) => (
          <Comment key={nestedComment.id} comment={nestedComment} />
        ))}
      </ul>
    )}
  </li>
);

export default Comment;
