import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { postsAPI } from '../api/posts'
import { User, Mail, Calendar, FileText, Trash2, Shield, Edit } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { user } = useAuth()
  const [myPosts, setMyPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true)
        const response = await postsAPI.getMyPosts(0, 50)
        setMyPosts(response.data.items)
      } catch (err) {
        console.error('Error fetching my posts:', err)
        setError('Failed to load your posts')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchMyPosts()
    }
  }, [user])

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }
    try {
      await postsAPI.deletePost(id)
      setMyPosts(myPosts.filter((post) => post.id !== id))
    } catch (err) {
      alert('Failed to delete post')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="flex flex-col items-center mb-6 text-center">
                <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mb-4 text-3xl font-bold">
                  {user.username.substring(0, 2).toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold text-dark">{user.full_name || user.username}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Shield size={14} className="text-secondary" />
                  <span className="capitalize">{user.role}</span>
                </p>
              </div>

              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <User size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-gray-500">Username</p>
                    <p className="font-medium text-dark">{user.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Mail size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="font-medium text-dark">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-gray-500">Member Since</p>
                    <p className="font-medium text-dark">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {user.bio && (
                <div className="border-t mt-6 pt-6">
                  <h4 className="text-sm font-semibold text-dark mb-2">About Me</h4>
                  <p className="text-gray-600 text-sm italic">{user.bio}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8 min-h-[500px]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-dark flex items-center gap-2">
                  <FileText size={24} className="text-primary" /> My Posts ({myPosts.length})
                </h3>
                <Link
                  to="/create-post"
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition font-semibold"
                >
                  Write Post
                </Link>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-background rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : myPosts.length > 0 ? (
                <div className="space-y-4">
                  {myPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 border rounded-lg hover:shadow-md transition flex justify-between items-center bg-white"
                    >
                      <div>
                        <h4 className="font-bold text-dark text-lg hover:text-primary mb-1">
                          <Link to={`/post/${post.id}`}>{post.title}</Link>
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span
                            className={`px-2 py-0.5 rounded font-semibold capitalize ${
                              post.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {post.status}
                          </span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/post/${post.id}/edit`}
                          className="p-2 text-primary hover:bg-background rounded-lg transition"
                          title="Edit Post"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete Post"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-lg">You haven't written any posts yet.</p>
                  <Link
                    to="/create-post"
                    className="mt-4 inline-block text-primary font-semibold hover:underline"
                  >
                    Create your first post now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
