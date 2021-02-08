import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const { data } = await axios.get(
      `http://localhost:4001/posts/${postId}/comments`
    );

    setComments(data);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, []);

  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>{comment.content}</li>
      ))}
    </ul>
  );
};

export default CommentList;
