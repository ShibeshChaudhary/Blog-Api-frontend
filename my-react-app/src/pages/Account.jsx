import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Mail, Calendar, Shield, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user, loading: authLoading, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/Login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  // No user data
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">No user data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Account</h1>
              <p className="text-sm text-slate-600 mt-1">Welcome back, {user.name}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {(user.name || 'U').substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{user.name}</h2>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700 capitalize">
                  {user.role}
                </span>
                {user.createdAt && (
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Calendar size={14} />
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <User size={20} />
            Account Information
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <User size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">Full Name</p>
                <p className="text-base font-semibold text-slate-900">{user.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">Email Address</p>
                <p className="text-base font-semibold text-slate-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <Shield size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">Account Role</p>
                <p className="text-base font-semibold text-slate-900 capitalize">{user.role}</p>
              </div>
            </div>

            {user.createdAt && (
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                  <Calendar size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-600 mb-1">Member Since</p>
                  <p className="text-base font-semibold text-slate-900">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Settings size={20} />
            Quick Actions
          </h3>
          
          <div className="space-y-3">
            <button
              onClick={() => alert('Profile editing feature coming soon!')}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <User size={18} className="text-slate-600" />
                <span className="font-medium text-slate-900">Edit Profile</span>
              </div>
              <span className="text-slate-400">→</span>
            </button>

            <button
              onClick={() => alert('Password change feature coming soon!')}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-slate-600" />
                <span className="font-medium text-slate-900">Change Password</span>
              </div>
              <span className="text-slate-400">→</span>
            </button>

            <button
              onClick={() => alert('Email preferences feature coming soon!')}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-slate-600" />
                <span className="font-medium text-slate-900">Email Preferences</span>
              </div>
              <span className="text-slate-400">→</span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 mt-6">
          <h3 className="text-xl font-semibold text-red-900 mb-4">Danger Zone</h3>
          <p className="text-sm text-slate-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                alert('Account deletion feature coming soon!');
              }
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}