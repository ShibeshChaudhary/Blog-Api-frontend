import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./AdminDashboard.css"; 

function AdminDashboard() {
  const [activeTab] = useState("users");
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
 
  useEffect(() => {
    console.log("Posts state updated:", {
      postsCount: posts.length,
      postsLoading,
      postsError,
      posts: posts
    });
  }, [posts, postsLoading, postsError]);
 
  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
    console.log("Posts available when tab changed:", posts.length);
    if (activeTab === "posts") {
      console.log("Posts tab is active. Posts data:", posts);
    }
  }, [activeTab, posts.length]);

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
 
      const usersData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.DATA)
        ? response.data.DATA
        : Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data?.users)
        ? response.data.users
        : [];
      
      console.log("Users response:", response.data); 
      console.log("Parsed users:", usersData);  
      setUsers(usersData);
    } catch (err) {
      console.error("Fetch users error:", err);
      console.error("Error response:", err.response?.data);
      const errorMessage = err.response?.data?.msg || err.response?.data?.message || err.message || "Failed to load users";
      setUsersError(`Error: ${errorMessage}${err.response?.status ? ` (Status: ${err.response.status})` : ''}`);
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
        : Array.isArray(response.data?.DATA)
        ? response.data.DATA
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      
      console.log("Posts response:", response.data); 
      console.log("Parsed posts:", postsData);  
      console.log("Posts count:", postsData.length);  
      setPosts(postsData);
      
      if (postsData.length === 0) {
        console.warn("No posts found in response. Response structure:", response.data);
      }
    } catch (err) {
      console.error("Fetch posts error:", err);
      console.error("Error response:", err.response?.data);
      const errorMessage = err.response?.data?.msg || err.response?.data?.message || err.message || "Failed to load posts";
      setPostsError(`Error: ${errorMessage}${err.response?.status ? ` (Status: ${err.response.status})` : ''}`);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
 
    if (id === user?.id || id === user?._id) {
      setUsersError("Cannot delete yourself");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUsersError("No authentication token found");
        return;
      } 
      const deleteUrl = `http://localhost:3000/api/auth/users/${id}`;
      console.log("Attempting to delete user:", id);
      console.log("Delete URL:", deleteUrl);
      
      const response = await axios.delete(deleteUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Delete response:", response.data);
      setUsersError(null);
      fetchUsers();  
    } catch (err) {
      console.error("Delete user error:", err);
      console.error("Error details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        url: err.config?.url
      });
      
      let errorMessage = "Failed to delete user";
      if (err.response?.status === 404) {
        errorMessage = `User not found (404). Checked route: /api/auth/users/:id`;
      } else if (err.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setUsersError(errorMessage);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPostsError("No authentication token found");
        return;
      }

      console.log("Attempting to delete post:", id);
      const response = await axios.delete(`http://localhost:3000/api/post/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Delete post response:", response.data);
      setPostsError(null);
      fetchPosts();  
    } catch (err) {
      console.error("Delete post error:", err);
      console.error("Error details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        url: err.config?.url
      });
      
      let errorMessage = "Failed to delete post";
      if (err.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setPostsError(errorMessage);
    }
  };
 
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
      <main className="dashboard-content">
  <div className="users-section">
    <h2>All Users ({users.length})</h2>

    {usersError && (
      <div style={{ color: "red" }}>{usersError}</div>
    )}

    {usersLoading ? (
      <p>Loading users...</p>
    ) : users.length === 0 ? (
      <p>No users found</p>
    ) : (
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id || u.id}>
              <td>{u._id || u.id}</td>
              <td>{getUserDisplayName(u)}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleDeleteUser(u._id || u.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>

  <hr style={{ margin: "50px 0" }} />
  <div className="posts-section">
    <h2>All Posts ({posts.length})</h2>

    {postsError && <div style={{ color: "red" }}>{postsError}</div>}

    {postsLoading ? (
      <p>Loading posts...</p>
    ) : posts.length === 0 ? (
      <p>No posts found</p>
    ) : (
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
            <th>Tag</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p._id || p.id}>
              <td>{p._id || p.id}</td>
              <td>{p.title}</td>
              <td>{p.content?.slice(0, 50)}...</td>
              <td>{p.tag || "-"}</td>
              <td>
                <button onClick={() => handleDeletePost(p._id || p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>

</main>

    </div>
  );
}

export default AdminDashboard;
