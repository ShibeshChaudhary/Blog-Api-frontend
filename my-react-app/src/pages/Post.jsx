import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./PostPage.css";

function Post() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    axios.get("http://localhost:3000/api/post")
      .then(res => setPosts(res.data))
      .catch(err => console.log(err));
  }, []);
  
  if (posts.length === 0) return <h2>Loading posts...</h2>;
  
  const featuredPost = posts[0]; 
  const otherPosts = posts.slice(1);
  
  return (
    <div className="blog-page">
      <h1 className="blog-title">The Blog</h1>
      
  
      <div className="featured-section">
        <div className="featured-content">
          <p className="date">{new Date(featuredPost.createdAt).toDateString()}</p>
          <h2 className="featured-heading">{featuredPost.title}</h2>
          <p className="featured-text">{featuredPost.content.slice(0, 150)}...</p>
          
          <div className="featured-tags">
            {featuredPost.tags && featuredPost.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
          <p className="featured-author">By {featuredPost.author}</p>
        </div>
      </div>
      <div className="post-grid">
        {otherPosts.map((post) => (
          <div className="post-card" key={post._id}>
            <p className="post-date">{new Date(post.createdAt).toDateString()}</p>
            <h3 className="post-title">{post.title}</h3>
            <p className="post-excerpt">{post.content.slice(0, 100)}...</p>
            
            <div className="post-tags">
              {post.tags && post.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
            
            <p className="post-author">By {post.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Post;