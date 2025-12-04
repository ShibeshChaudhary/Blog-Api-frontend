import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./PostPage.css";

function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    axios.get("http://localhost:3000/api/post")
      .then(res => {
        setPosts(res.data.DATA);
        setLoading(false);
      })
      .catch(err => {
        console.log("Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <h2>Loading posts...</h2>;
  if (error) return <h2>Error: {error}</h2>;
  if (posts.length === 0) return <h2>No posts found</h2>;
  
  const featuredPost = posts[0]; 
  const otherPosts = posts.slice(1);
  
  return (
    <div className="blog-page">
      
      
      <div className="featured-section">
        <div className="featured-content">
          
          <h2 className="featured-heading">{featuredPost.title}</h2>
          <p className="featured-text">{featuredPost.content.slice(0, 150)}...</p>
                    <div className="featured-tags">
            {featuredPost.tag && (
              <span className="tag">{featuredPost.tag}</span>
            )}
          </div>
          
          <p className="featured-author">By {featuredPost.author}</p>
        </div>
      </div>
      
      <div className="post-grid">
        {otherPosts.map((post) => (
          <div className="post-card" key={post._id}>
            
            <h3 className="post-title">{post.title}</h3>
            <p className="post-excerpt">{post.content.slice(0, 100)}...</p>
                <div className="post-tags">
                  {post.tag && (
                    <span className="tag">{post.tag}</span>
              )}
            </div>
            
            <p className="post-author">By {post.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Post;