import React, { useState } from 'react';
import axios from 'axios';

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await axios.post(
      `http://localhost:4001/posts/${postId}/comments`,
      { content },
      config
    );

    setContent('');
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <label>New Comment</label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className='form-control my-3'
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default CommentCreate;
