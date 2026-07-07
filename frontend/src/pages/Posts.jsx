import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { postsAPI } from '../api/posts'
import { categoriesAPI } from '../api/categories'
import PostCard from '../components/PostCard'
import { useSearchParams } from 'react-router-dom'

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(parseInt(categoryParam, 10))
    }
  }, [categoryParam])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getCategories(0, 100)
        setCategories(response.data.items)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const skip = (page - 1) * 12
        let response

        if (searchQuery) {
          response = await postsAPI.searchPosts(searchQuery, skip, 12)
        } else {
          response = await postsAPI.getPosts(skip, 12, selectedCategory)
        }

        setPosts(response.data.items)
        setTotalPages(response.data.total_pages)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [page, searchQuery, selectedCategory])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-dark mb-4">All Posts</h1>
          <p className="text-gray-600 text-lg">Discover stories from our community</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full px-6 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary pl-12"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>
        </form>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedCategory(null)
                setPage(1)
              }}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                selectedCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-white text-dark hover:bg-background'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setPage(1)
                }}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-dark hover:bg-background'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white rounded-lg hover:bg-background transition disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded-lg transition ${
                      page === i + 1
                        ? 'bg-primary text-white'
                        : 'bg-white hover:bg-background'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white rounded-lg hover:bg-background transition disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No posts found</p>
          </div>
        )}
      </div>
    </div>
  )
}
