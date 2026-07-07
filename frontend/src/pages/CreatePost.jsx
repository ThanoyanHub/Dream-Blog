import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { postsAPI } from '../api/posts'
import { categoriesAPI } from '../api/categories'

export default function CreatePost() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      status: 'draft',
      category_id: ''
    }
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getCategories(0, 100)
        setCategories(response.data.items)
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    fetchCategories()
  }, [])

  const onSubmit = async (data) => {
    try {
      setError('')
      setLoading(true)
      
      const payload = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        category_id: data.category_id ? parseInt(data.category_id, 10) : null,
        status: data.status,
      }
      
      await postsAPI.createPost(payload)
      navigate('/posts')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Create New Post</h1>
        <p className="text-gray-600 mb-8">Share your thoughts and stories with the world</p>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Title</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              placeholder="Give your post a catchy title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Category</label>
              <select
                {...register('category_id')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">Select a category (optional)</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Status</label>
              <select
                {...register('status')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="draft">Draft</option>
                <option value="published">Publish</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Excerpt</label>
            <input
              type="text"
              {...register('excerpt')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              placeholder="A brief summary of your post (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Content</label>
            <textarea
              rows="12"
              {...register('content', { required: 'Content is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
              placeholder="Write your markdown or text content here..."
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
          </div>

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 text-dark rounded-lg hover:bg-background transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 font-semibold"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
