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
  const [usersError, setUsersError] = useState(null);
  const [postsError, setPostsError] = useState(null);

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
      setUsersError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setUsersError("No authentication token found. Please login again.");
        setUsersLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle different response formats
      const usersData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data?.users)
        ? response.data.users
        : [];
      setUsers(usersData);
    } catch (err) {
      console.error("Fetch users error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to load users";
      setUsersError(errorMessage);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      setPostsError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setPostsError("No authentication token found. Please login again.");
        setPostsLoading(false);
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
      console.error("Fetch posts error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to load posts";
      setPostsError(errorMessage);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    // Prevent self-deletion
    if (id === user?.id || id === user?._id) {
      setUsersError("Cannot delete yourself");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsersError(null);
      fetchUsers(); // Refresh users list
    } catch (err) {
      console.error("Delete user error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete user";
      setUsersError(errorMessage);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/post/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPostsError(null);
      fetchPosts(); // Refresh posts list
    } catch (err) {
      console.error("Delete post error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete post";
      setPostsError(errorMessage);
    }
  };

  // Helper function to get user display name
  const getUserDisplayName = (u) => {
    if (u.firstName && u.lastName) {
      return `${u.firstName} ${u.lastName}`;
    } else if (u.name) {
      return u.name;
    } else if (u.firstName) {
      return u.firstName;
    }
    return "Unknown User";
  };

  return (
    <div className="manager-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {getUserDisplayName(user || {})}</span>
          <span className="role-badge">{user?.role || "admin"}</span>
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
        {activeTab === "users" && (
          <div className="users-section">
            <h2>All Users ({users.length})</h2>
            {usersError && (
              <div className="error-banner" style={{color: 'red', padding: '10px', marginBottom: '20px'}}>
                {usersError}
                <button onClick={() => setUsersError(null)} style={{marginLeft: '10px'}}>×</button>
              </div>
            )}
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
                        <td>{getUserDisplayName(u)}</td>
                        <td>{u.email}</td>
                        <td>{u.role || "user"}</td>
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
            {postsError && (
              <div className="error-banner" style={{color: 'red', padding: '10px', marginBottom: '20px'}}>
                {postsError}
                <button onClick={() => setPostsError(null)} style={{marginLeft: '10px'}}>×</button>
              </div>
            )}
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
                        <td>{post.content?.substring(0, 100)}{post.content?.length > 100 ? "..." : ""}</td>
                        <td>{Array.isArray(post.tag) ? post.tag.join(", ") : post.tag || "-"}</td>
                        <td>{post.author?.name || post.author || "-"}</td>
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
