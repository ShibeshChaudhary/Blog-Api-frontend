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
    const token = localStorage.getItem("token");

    const response = await axios.get("http://localhost:3000/api/post", {
      headers: { Authorization: `Bearer ${token}` },
    });
 
    const postsData = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data.data)
      ? response.data.data
      : [];

    setPosts(postsData);

  } catch (err) {
    setError("Failed to load posts");
    console.error(err);
    setPosts([]); 
  } finally {
    setLoading(false);
  }
};


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //To ADD or UPDATE post
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (editingPost) {
        // UPDATE
        await axios.put(
          `http://localhost:3000/api/post/${editingPost.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // CREATE
        await axios.post("http://localhost:3000/api/post", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setFormData({ title: "", content: "" });
      setEditingPost(null);

      fetchPosts();
    } catch (err) {
      setError("Failed to save post");
      console.error(err);
    }
  };

  const handleEdit = (post) => {
  setEditingPost(post);
  setFormData({
    title: post.title,
    content: post.content,
    tag: post.tag?.join(", ") || ""
  });
};


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3000/api/post/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchPosts();
    } catch (err) {
      setError("Failed to delete post");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading editor dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

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
        <div className="posts-section">
          <h2>{editingPost ? "Edit Post" : "Add New Post"}</h2>

          <form onSubmit={handleSubmit} className="post-form">
            <input
              type="text"
              name="title"
              placeholder="Post title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />

            <textarea
              name="content"
              placeholder="Post content"
              rows="5"
              value={formData.content}
              onChange={handleInputChange}
              required
            ></textarea>
            <input
              type="text"
              name="tags"
              placeholder="Tags"
              value={formData.tag}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={formData.author}
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
                  setFormData({ title: "", content: "" });
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>

          <h2>All Posts</h2>

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
                    <td>{post.author?.name}</td>
                    <td>{post.tag?.join(", ")}</td>

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
        </div>
      </main>
    </div>
  );
}

export default EditorDashboard;
