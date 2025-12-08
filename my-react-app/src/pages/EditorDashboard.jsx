import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./EditorDashboard.css"; 

function EditorDashboard() {
  const [activeTab] = useState("post");
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tag:"",
    author:"",

  });

  const [editingPost, setEditingPost] = useState(null);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "editor" && user?.role !== "admin") {
      navigate("/");
      return;
    }

    fetchPosts();
  }, [isAuthenticated, user, navigate]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:3000/api/post", {
        headers: { Authorization: `Bearer ${token}` },
      });
 
      const postsData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data?.DATA)
        ? response.data.DATA
        : [];

      setPosts(postsData);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to load posts";
      setError(errorMessage);
      console.error("Fetch posts error:", err);
      setPosts([]); 
    } finally {
      setLoading(false);
    }
  };


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
 
      const tagsArray = formData.tag
        ? formData.tag.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];
 
      const postData = {
        title: formData.title,
        content: formData.content,
        tag: tagsArray,
        author: formData.author || undefined
      };

      if (editingPost) {
   
        const postId = editingPost.id || editingPost._id;
        if (!postId) {
          setError("Post ID is missing. Cannot update post.");
          return;
        }
        await axios.put(
          `http://localhost:3000/api/post/${postId}`,
          postData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post("http://localhost:3000/api/post", postData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({ title: "", content: "", tag: "", author: "" });
      setEditingPost(null);
      setError(null);

      fetchPosts();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to save post";
      setError(errorMessage);
      console.error("Save post error:", err);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || "",
      content: post.content || "",
      tag: post.tag?.join(", ") || "",
      author: post.author?.name || post.author || ""
    });
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3000/api/post/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setError(null);
      fetchPosts();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete post";
      setError(errorMessage);
      console.error("Delete post error:", err);
    }
  };

  return (
    <div className="manager-dashboard">
      <header className="dashboard-header">
        <h1>Editor Dashboard</h1>
        <div className="user-info">
          <span>
            Welcome, {user?.firstName} {user?.lastName}
          </span>
          <span className="role-badge">{user?.role}</span>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-tab ${activeTab === "posts" ? "active" : ""}`}>
          Manage Posts
        </button>
      </nav>

      <main className="dashboard-content">
        {error && (
          <div className="error-banner" style={{color: 'red', padding: '10px', marginBottom: '20px'}}>
            {error}
            <button onClick={() => setError(null)} style={{marginLeft: '10px'}}>×</button>
          </div>
        )}
        {loading && <div className="loading">Loading posts...</div>}
        <div className="posts-section">
          <h2>{editingPost ? "Edit Post" : "Add New Post"}</h2>

          <form onSubmit={handleSubmit} className="post-form">
            <input
              type="text"
              name="title"
              placeholder="Post title"
              value={formData.title || ""}
              onChange={handleInputChange}
              required
            />

            <textarea
              name="content"
              placeholder="Post content"
              rows="5"
              value={formData.content || ""}
              onChange={handleInputChange}
              required
            ></textarea>
            <input
              type="text"
              name="tag"
              placeholder="Tags"
              value={formData.tag || ""}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={formData.author || ""}
              onChange={handleInputChange}
            />

            <button type="submit" className="save-btn">
              {editingPost ? "Update Post" : "Add Post"}
            </button>

            {editingPost && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditingPost(null);
                  setFormData({ title: "", content: "", tag: "", author: "" });
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>

          <h2>All Posts ({posts.length})</h2>

          {posts.length === 0 && !loading ? (
            <div>No posts found</div>
          ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Tags</th>
                  <th>Author</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {posts.map((post) => (
                  <tr key={post.id || post._id}>
                    <td>{post.id || post._id}</td>
                    <td>{post.title}</td>
                    <td>{post.content}</td>
                    <td>{post.tag?.join(", ")}</td>
                    <td>{post.author?.name}</td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(post)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(post.id || post._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default EditorDashboard;
