import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Folder, ArrowRight } from 'lucide-react'
import { categoriesAPI } from '../api/categories'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await categoriesAPI.getCategories(0, 100)
        setCategories(response.data.items)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-dark mb-4">Browse by Category</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore posts and articles grouped by interest area and topics
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md mx-auto text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-48 animate-pulse shadow-md" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 bg-primary bg-opacity-10 text-primary rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Folder size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {category.description || 'No description available for this category.'}
                  </p>
                </div>
                <Link
                  to={`/posts?category=${category.id}`}
                  className="inline-flex items-center gap-2 text-secondary hover:text-opacity-80 font-bold transition-all text-sm group-hover:translate-x-1 duration-300"
                >
                  Explore Posts <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No categories found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
