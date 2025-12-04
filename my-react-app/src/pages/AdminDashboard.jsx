import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./AdminDashboard.css"; 

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [usersLoading, setUsersLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchUsers();
    fetchPosts();
  }, [isAuthenticated, user, navigate]);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      if (!token) throw new Error("No token found");

      const response = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Simplified response handling
      const usersData = response.data?.data || response.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.response?.data?.message || "Failed to load users");
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      if (!token) throw new Error("No token found");

      const response = await axios.get("http://localhost:3000/api/post", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const postsData = response.data?.data || response.data || [];
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (err) {
      console.error("Fetch posts error:", err);
      setError(err.response?.data?.message || "Failed to load posts");
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    // Prevent self-deletion
    if (id === user?.id || id === user?._id) {
      setError("Cannot delete yourself");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Refresh users list
    } catch (err) {
      console.error("Delete user error:", err);
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/post/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts(); // Refresh posts list
    } catch (err) {
      console.error("Delete post error:", err);
      setError(err.response?.data?.message || "Failed to delete post");
    }
  };

  const isLoading = usersLoading || postsLoading;

  if (isLoading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="manager-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.firstName} {user?.lastName}</span>
          <span className="role-badge">{user?.role}</span>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Manage Users
        </button>
        <button
          className={`nav-tab ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
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

        {activeTab === "users" && (
          <div className="users-section">
            <h2>All Users ({users.length})</h2>
            {usersLoading ? (
              <div>Loading users...</div>
            ) : users.length === 0 ? (
              <div>No users found</div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id || u._id}>
                        <td>{u.id || u._id}</td>
                        <td>{u.firstName} {u.lastName}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteUser(u.id || u._id)}
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
        )}

        {activeTab === "posts" && (
          <div className="posts-section">
            <h2>All Posts ({posts.length})</h2>
            {postsLoading ? (
              <div>Loading posts...</div>
            ) : posts.length === 0 ? (
              <div>No posts found</div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Content</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id || post._id}>
                        <td>{post.id || post._id}</td>
                        <td>{post.title}</td>
                        <td>{post.content?.substring(0, 100)}...</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeletePost(post.id || post._id)}
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
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
