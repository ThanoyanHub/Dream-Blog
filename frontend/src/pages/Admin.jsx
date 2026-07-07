import React, { useState, useEffect } from 'react'
import { adminAPI } from '../api/admin'
import { categoriesAPI } from '../api/categories'
import { Users, FileText, MessageSquare, Folder, Check, XCircle, Trash2, Shield, Settings } from 'lucide-react'

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [usersList, setUsersList] = useState([])
  const [postsList, setPostsList] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  const [newCatName, setNewCatName] = useState('')
  const [newCatDesc, setNewCatDesc] = useState('')
  const [catLoading, setCatLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  
  const [userPage, setUserPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [postPage, setPostPage] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setError('')
        const response = await adminAPI.getDashboard()
        setStats(response.data.stats)
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
        setError('Failed to load dashboard statistics')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardStats()
  }, [])

  useEffect(() => {
    if (activeTab === 'users') {
      const fetchUsers = async () => {
        try {
          setLoading(true)
          const skip = (userPage - 1) * 10
          const response = await adminAPI.getUsers(skip, 10)
          setUsersList(response.data.items)
          setTotalUsers(response.data.total)
        } catch (err) {
          console.error('Error fetching users:', err)
          setError('Failed to load users list')
        } finally {
          setLoading(false)
        }
      }
      fetchUsers()
    } else if (activeTab === 'posts') {
      const fetchPosts = async () => {
        try {
          setLoading(true)
          const skip = (postPage - 1) * 10
          const response = await adminAPI.getAllPosts(skip, 10)
          setPostsList(response.data.items)
          setTotalPosts(response.data.total)
        } catch (err) {
          console.error('Error fetching posts:', err)
          setError('Failed to load posts list')
        } finally {
          setLoading(false)
        }
      }
      fetchPosts()
    } else if (activeTab === 'categories') {
      const fetchCategories = async () => {
        try {
          setLoading(true)
          const response = await categoriesAPI.getCategories(0, 100)
          setCategoriesList(response.data.items)
        } catch (err) {
          console.error('Error fetching categories:', err)
          setError('Failed to load categories list')
        } finally {
          setLoading(false)
        }
      }
      fetchCategories()
    }
  }, [activeTab, userPage, postPage])

  const handleDeactivateUser = async (id) => {
    try {
      await adminAPI.deactivateUser(id)
      setUsersList(
        usersList.map((u) => (u.id === id ? { ...u, is_active: false } : u))
      )
    } catch (err) {
      alert('Failed to deactivate user')
    }
  }

  const handleActivateUser = async (id) => {
    try {
      await adminAPI.activateUser(id)
      setUsersList(
        usersList.map((u) => (u.id === id ? { ...u, is_active: true } : u))
      )
    } catch (err) {
      alert('Failed to activate user')
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? All their posts and comments will be deleted.')) {
      return
    }
    try {
      await adminAPI.deleteUser(id)
      setUsersList(usersList.filter((u) => u.id !== id))
    } catch (err) {
      alert('Failed to delete user')
    }
  }

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this post?')) {
      return
    }
    try {
      await adminAPI.deletePostAdmin(id)
      setPostsList(postsList.filter((p) => p.id !== id))
    } catch (err) {
      alert('Failed to delete post')
    }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (!newCatName.trim()) {
      alert('Category name is required')
      return
    }
    try {
      setCatLoading(true)
      const response = await categoriesAPI.createCategory({
        name: newCatName,
        description: newCatDesc || null
      })
      setCategoriesList([...categoriesList, response.data.category])
      setNewCatName('')
      setNewCatDesc('')
      alert('Category created successfully')
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create category')
    } finally {
      setCatLoading(false)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this category?')) {
      return
    }
    try {
      await categoriesAPI.deleteCategory(id)
      setCategoriesList(categoriesList.filter((c) => c.id !== id))
    } catch (err) {
      alert('Failed to delete category')
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center gap-3">
          <Settings className="text-primary w-8 h-8" />
          <h1 className="text-3xl font-bold text-dark">Admin Dashboard</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

    
        <div className="mb-8 flex border-b border-gray-300">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'overview'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-dark'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'users'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-dark'
            }`}
          >
            Users Management
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'posts'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-dark'
            }`}
          >
            Posts Management
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'categories'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-dark'
            }`}
          >
            Categories Management
          </button>
        </div>

        {/* Tab Contents */}
        {loading && activeTab === 'overview' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-32 shadow-md" />
            ))}
          </div>
        ) : (
          <>
            {activeTab === 'overview' && stats && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary bg-opacity-10 text-primary rounded-lg flex items-center justify-center">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Total Users</p>
                      <h3 className="text-2xl font-bold text-dark">{stats.total_users}</h3>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary bg-opacity-10 text-secondary rounded-lg flex items-center justify-center">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Total Posts</p>
                      <h3 className="text-2xl font-bold text-dark">{stats.total_posts}</h3>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Comments</p>
                      <h3 className="text-2xl font-bold text-dark">{stats.total_comments}</h3>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                      <Folder size={24} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Categories</p>
                      <h3 className="text-2xl font-bold text-dark">{stats.total_categories}</h3>
                    </div>
                  </div>
                </div>

                {/* Additional Stats Overview */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold text-dark mb-4">Post Distribution</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="p-4 bg-background rounded-lg text-center">
                      <p className="text-gray-500 text-xs uppercase font-semibold">Published</p>
                      <p className="text-3xl font-bold text-green-700 mt-2">{stats.published_posts}</p>
                    </div>
                    <div className="p-4 bg-background rounded-lg text-center">
                      <p className="text-gray-500 text-xs uppercase font-semibold">Drafts</p>
                      <p className="text-3xl font-bold text-yellow-700 mt-2">{stats.draft_posts}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-gray-500 text-sm uppercase">
                      <th className="pb-3 font-semibold">Username</th>
                      <th className="pb-3 font-semibold">Email</th>
                      <th className="pb-3 font-semibold">Role</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u.id} className="border-b last:border-0 hover:bg-background hover:bg-opacity-20 transition text-sm">
                        <td className="py-4 font-bold text-dark">{u.username}</td>
                        <td className="py-4 text-gray-600">{u.email}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                            u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            <Shield size={12} /> {u.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 text-right flex justify-end gap-2">
                          {u.is_active ? (
                            <button
                              onClick={() => handleDeactivateUser(u.id)}
                              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition text-xs font-semibold flex items-center gap-1"
                            >
                              <XCircle size={14} /> Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateUser(u.id)}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition text-xs font-semibold flex items-center gap-1"
                            >
                              <Check size={14} /> Activate
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalUsers > 10 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <button
                      onClick={() => setUserPage(Math.max(1, userPage - 1))}
                      disabled={userPage === 1}
                      className="px-4 py-2 border rounded hover:bg-background transition text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {userPage} of {Math.ceil(totalUsers / 10)}
                    </span>
                    <button
                      onClick={() => setUserPage(Math.min(Math.ceil(totalUsers / 10), userPage + 1))}
                      disabled={userPage === Math.ceil(totalUsers / 10)}
                      className="px-4 py-2 border rounded hover:bg-background transition text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-gray-500 text-sm uppercase">
                      <th className="pb-3 font-semibold">Title</th>
                      <th className="pb-3 font-semibold">Author</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postsList.map((p) => (
                      <tr key={p.id} className="border-b last:border-0 hover:bg-background hover:bg-opacity-20 transition text-sm">
                        <td className="py-4 font-bold text-dark max-w-xs truncate">{p.title}</td>
                        <td className="py-4 text-gray-600">{p.author}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                            p.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDeletePost(p.id)}
                            className="p-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
                            title="Delete Post"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPosts > 10 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <button
                      onClick={() => setPostPage(Math.max(1, postPage - 1))}
                      disabled={postPage === 1}
                      className="px-4 py-2 border rounded hover:bg-background transition text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {postPage} of {Math.ceil(totalPosts / 10)}
                    </span>
                    <button
                      onClick={() => setPostPage(Math.min(Math.ceil(totalPosts / 10), postPage + 1))}
                      disabled={postPage === Math.ceil(totalPosts / 10)}
                      className="px-4 py-2 border rounded hover:bg-background transition text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-dark">
                {/* Add Category Form */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6 h-fit">
                  <h3 className="text-xl font-bold mb-4">Add New Category</h3>
                  <form onSubmit={handleCreateCategory} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category Name</label>
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="e.g. Science"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-dark"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        rows="4"
                        value={newCatDesc}
                        onChange={(e) => setNewCatDesc(e.target.value)}
                        placeholder="A brief explanation of this category..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm text-dark"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={catLoading}
                      className="w-full py-2 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
                    >
                      {catLoading ? 'Creating...' : 'Create Category'}
                    </button>
                  </form>
                </div>

                {/* Categories List */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
                  <h3 className="text-xl font-bold mb-6">Existing Categories ({categoriesList.length})</h3>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b text-gray-500 text-sm uppercase">
                        <th className="pb-3 font-semibold">Name</th>
                        <th className="pb-3 font-semibold">Slug</th>
                        <th className="pb-3 font-semibold">Description</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoriesList.map((cat) => (
                        <tr key={cat.id} className="border-b last:border-0 hover:bg-background hover:bg-opacity-20 transition text-sm">
                          <td className="py-4 font-bold text-dark">{cat.name}</td>
                          <td className="py-4 text-gray-600">{cat.slug}</td>
                          <td className="py-4 text-gray-500 max-w-xs truncate" title={cat.description}>
                            {cat.description || '-'}
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
                              title="Delete Category"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {categoriesList.length === 0 && (
                    <p className="text-center py-8 text-gray-500">No categories found.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
