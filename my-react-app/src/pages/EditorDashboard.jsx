import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Plus, Edit2, Trash2, FileText, Loader2, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../services/api';

export default function EditorDashboard() {
  const { user, loading: authLoading, logout, isAuthenticated, isEditor } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tag: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/Login');
      return;
    }
    
    if (!authLoading && !isEditor) {
      navigate('/Account');
      return;
    }
    
    if (user) {
      fetchMyPosts();
    }
  }, [user, authLoading, isAuthenticated, isEditor, navigate]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/api/post/my-posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPosts(response.data.DATA || response.data.posts || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.response?.data?.message || 'Failed to load posts');
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/post`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormData({ title: '', content: '', tag: '' });
      setShowCreateForm(false);
      fetchMyPosts();
      showNotification('Post created successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to create post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/post/${editingPost._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormData({ title: '', content: '', tag: '' });
      setEditingPost(null);
      fetchMyPosts();
      showNotification('Post updated successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to update post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchMyPosts();
      showNotification('Post deleted successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to delete post', 'error');
    }
  };

  const startEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      tag: post.tag || ''
    });
    setShowCreateForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setShowCreateForm(false);
    setFormData({ title: '', content: '', tag: '' });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return (
    <div>
      <p>Please login as editor</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
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
              <h1 className="text-2xl font-bold text-slate-900">Editor Dashboard</h1>
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
        {/* Stats Card */}
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
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {(user.name || 'E').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
                <p className="text-sm text-slate-600">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Account Type</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  Editor
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Create Post Button */}
        {!showCreateForm && !editingPost && (
          <div className="mb-6">
            <button
              onClick={() => {
                setShowCreateForm(true);
                setEditingPost(null);
                setFormData({ title: '', content: '', tag: '' });
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus size={20} />
              Create New Post
            </button>
          </div>
        )}

        {/* Create/Edit Form */}
        {(showCreateForm || editingPost) && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h3>
              <button
                onClick={cancelEdit}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter post title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows="8"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    placeholder="Write your post content here..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tag</label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Technology, Lifestyle, Travel"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={submitting}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FileText size={20} />
            My Posts ({posts.length})
          </h3>
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
              <X className="text-red-600" size={20} />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg mb-2">No posts yet</p>
              <p className="text-slate-500 text-sm">Create your first post to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <div key={post._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xl font-semibold text-slate-900 mb-2 truncate">{post.title}</h4>
                      <p className="text-slate-600 mb-3 line-clamp-3">{post.content}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        {post.tag && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {post.tag}
                          </span>
                        )}
                        <span className="text-sm text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(post)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit post"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete post"
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
      </div>
    </div>
  );
}