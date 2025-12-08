import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// import "./PostPage.css";

function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/post")
      .then((res) => {
        setPosts(res.data.DATA || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading posts...</h2>;
  if (error) return <h2>Error: {error}</h2>;
  if (!posts || posts.length === 0) return <h2>No posts found</h2>;

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);
  const renderTags = (tag) => {
    if (!tag) return null;

    if (Array.isArray(tag)) {
      return tag.map((t, i) => (
        <span className="tag" key={i}>
          {t}
        </span>
      ));
    }

    if (typeof tag === "string") {
      return tag.split(",").map((t, i) => (
        <span className="tag" key={i}>
          {t.trim()}
        </span>
      ));
    }

    return null;
  };

  return (
    <div className="blog-page">
      <div className="featured-section">
        <div className="featured-content">
          <h2 className="featured-heading">
            {featuredPost?.title || "No Title"}
          </h2>

          <p className="featured-text">
            {featuredPost?.content
              ? featuredPost.content.slice(0, 150) + "..."
              : "No Content"}
          </p>

          <div className="featured-tags">
            {renderTags(featuredPost?.tag)}
          </div>

          <p className="featured-author">By {featuredPost?.author}</p>
        </div>
      </div>
      <div className="post-grid">
  {otherPosts.map((post) => (
    <Link
      to={`/post/${post._id}`}
      key={post._id}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="post-card">
        <h3 className="post-title">{post?.title}</h3>

        <p className="post-excerpt">
          {post?.content
            ? post.content.slice(0, 100) + "..."
            : "No content"}
        </p>

        <div className="post-tags">
          {renderTags(post?.tag)}
        </div>

        <p className="post-author">By {post?.author}</p>
      </div>
    </Link>
  ))}
</div>

    </div>
  );
}

export default Post;
