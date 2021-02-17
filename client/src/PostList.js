import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = () => {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    const { data } = await axios.get('http://localhost:4002/posts');

    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // get array of posts values
  const postsArray = Object.values(posts);
  const style = {
    width: '30%',
    marginBottom: '20px',
  };

  return (
    <div className='d-flex flex-row flex-wrap justify-content-between'>
      {postsArray.map((post) => (
        <div className='card' style={style} key={post.id}>
          <div className='card-body'>
            <h3>{post.title}</h3>
            {/* comment list */}
            <CommentList comments={post.comments} />
            {/* comment create form */}
            <CommentCreate postId={post.id} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
