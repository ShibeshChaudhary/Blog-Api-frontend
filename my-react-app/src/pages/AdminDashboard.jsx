import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, LogOut, User, Plus, Edit2, Trash2, X, Check, Loader2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../services/api';

export default function AdminDashboard() {
  const { user, loading: authLoading, logout, isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [postFormData, setPostFormData] = useState({
    title: '',
    content: '',
    tag: '',
    author: ''
  });
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/Login');
      return;
    }
    
    if (!authLoading && !isAdmin) {
      navigate('/Account');
      return;
    }
    
    if (user && isAuthenticated && isAdmin) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, isAuthenticated, isAdmin, navigate, activeTab]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      if (activeTab === 'posts') {
        const response = await axios.get(`${API_URL}/api/post`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(response.data.DATA || response.data.posts || []);
      } else {
        const response = await axios.get(`${API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.users || response.data.DATA || []);
      }
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to load data', 'error');
    }
    setLoading(false);
  };

  // POST OPERATIONS
  const handleCreatePost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/post`, postFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPostFormData({ title: '', content: '', tag: '', author: '' });
      setShowPostForm(false);
      fetchData();
      showNotification('Post created successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to create post', 'error');
    }
    setSubmitting(false);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/post/${editingPost._id}`, postFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPostFormData({ title: '', content: '', tag: '', author: '' });
      setEditingPost(null);
      fetchData();
      showNotification('Post updated successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to update post', 'error');
    }
    setSubmitting(false);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      showNotification('Post deleted successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to delete post', 'error');
    }
  };

  const startEditPost = (post) => {
    setEditingPost(post);
    setPostFormData({
      title: post.title,
      content: post.content,
      tag: post.tag || '',
      author: post.author || ''
    });
    setShowPostForm(false);
  };

  // USER OPERATIONS
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/auth/register`, userFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserFormData({ name: '', email: '', password: '', role: 'user' });
      setShowUserForm(false);
      fetchData();
      showNotification('User created successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to create user', 'error');
    }
    setSubmitting(false);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const updateData = { ...userFormData };
      if (!updateData.password) delete updateData.password; // Don't update password if empty
      
      await axios.put(`${API_URL}/api/user/${editingUser._id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserFormData({ name: '', email: '', password: '', role: 'user' });
      setEditingUser(null);
      fetchData();
      showNotification('User updated successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to update user', 'error');
    }
    setSubmitting(false);
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user._id || userId === user.id) {
      showNotification('You cannot delete your own account!', 'error');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      showNotification('User deleted successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  const startEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setUserFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      password: '',
      role: userToEdit.role
    });
    setShowUserForm(false);
  };

  const cancelForms = () => {
    setShowPostForm(false);
    setShowUserForm(false);
    setEditingPost(null);
    setEditingUser(null);
    setPostFormData({ title: '', content: '', tag: '', author: '' });
    setUserFormData({ name: '', email: '', password: '', role: 'user' });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? <Check size={20} /> : <X size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-600 mt-1">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/Account')}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <User size={18} />
                <span className="hidden sm:inline">My Account</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Posts</p>
                <p className="text-3xl font-bold text-slate-900">{posts.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-slate-900">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {(user.name || 'A').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 px-6 py-4 font-medium flex items-center justify-center gap-2 ${
                activeTab === 'posts'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText size={18} />
              Manage Posts
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-4 font-medium flex items-center justify-center gap-2 ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={18} />
              Manage Users
            </button>
          </div>
        </div>

        {/* Create Button */}
        {!showPostForm && !showUserForm && !editingPost && !editingUser && (
          <div className="mb-6">
            <button
              onClick={() => activeTab === 'posts' ? setShowPostForm(true) : setShowUserForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus size={20} />
              {activeTab === 'posts' ? 'Create New Post' : 'Create New User'}
            </button>
          </div>
        )}

        {/* POST FORM */}
        {(showPostForm || editingPost) && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h3>
              <button onClick={cancelForms} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={postFormData.title}
                    onChange={(e) => setPostFormData({ ...postFormData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Author</label>
                  <input
                    type="text"
                    value={postFormData.author}
                    onChange={(e) => setPostFormData({ ...postFormData, author: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={postFormData.content}
                  onChange={(e) => setPostFormData({ ...postFormData, content: e.target.value })}
                  rows="6"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Tag</label>
                <input
                  type="text"
                  value={postFormData.tag}
                  onChange={(e) => setPostFormData({ ...postFormData, tag: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center gap-2"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type="button"
                  onClick={cancelForms}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* USER FORM */}
        {(showUserForm || editingUser) && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingUser ? 'Edit User' : 'Create New User'}
              </h3>
              <button onClick={cancelForms} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password {!editingUser && <span className="text-red-500">*</span>}
                    {editingUser && <span className="text-slate-500 text-xs">(leave blank to keep current)</span>}
                  </label>
                  <input
                    type="password"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required={!editingUser}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="user">User</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center gap-2"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={cancelForms}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* POSTS LIST */}
        {activeTab === 'posts' && (
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">All Posts ({posts.length})</h3>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No posts available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-slate-900 mb-2">{post.title}</h4>
                        <p className="text-slate-600 mb-3 line-clamp-2">{post.content}</p>
                        <div className="flex flex-wrap items-center gap-3">
                          {post.tag && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {post.tag}
                            </span>
                          )}
                          {post.author && (
                            <span className="text-sm text-slate-500">By {post.author}</span>
                          )}
                          <span className="text-sm text-slate-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditPost(post)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* USERS LIST */}
        {activeTab === 'users' && (
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">All Users ({users.length})</h3>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : users.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No users available</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {users.map((u) => (
                  <div key={u._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {(u.name || 'U').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">{u.name}</h4>
                          <p className="text-sm text-slate-600">{u.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              u.role === 'admin' ? 'bg-red-100 text-red-700' :
                              u.role === 'editor' ? 'bg-green-100 text-green-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {u.role}
                            </span>
                            {(u._id === user._id || u.id === user.id) && (
                              <span className="text-xs text-slate-500">(You)</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditUser(u)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          disabled={u._id === user._id || u.id === user.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}