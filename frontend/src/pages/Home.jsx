import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Pen, Users, Zap } from 'lucide-react'
import { postsAPI } from '../api/posts'
import PostCard from '../components/PostCard'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postsAPI.getPosts(0, 6)
        setPosts(response.data.items)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div>
    
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to Dream Blog</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Share your stories, inspire the world, and connect with readers everywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/posts"
              className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-opacity-90 transition inline-flex items-center justify-center gap-2"
            >
              Explore Posts <ArrowRight size={20} />
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-dark">Why Choose Dream Blog?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-background rounded-lg text-center hover:shadow-lg transition">
              <Pen className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark mb-2">Easy Publishing</h3>
              <p className="text-gray-600">
                Write and publish your stories with our intuitive editor and beautiful templates.
              </p>
            </div>
            <div className="p-8 bg-background rounded-lg text-center hover:shadow-lg transition">
              <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark mb-2">Community</h3>
              <p className="text-gray-600">
                Connect with readers, get feedback, and build your audience.
              </p>
            </div>
            <div className="p-8 bg-background rounded-lg text-center hover:shadow-lg transition">
              <Zap className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark mb-2">Fast & Reliable</h3>
              <p className="text-gray-600">
                Lightning-fast performance and 99.9% uptime for your content.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-dark">Recent Posts</h2>
            <Link
              to="/posts"
              className="text-primary font-semibold hover:text-secondary transition flex items-center gap-2"
            >
              View All <ArrowRight size={20} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg h-96 animate-pulse" />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No posts yet. Be the first to write!</p>
              <Link
                to="/create-post"
                className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
              >
                Write First Post
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Share Your Story?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of writers and start publishing today.
          </p>
          <Link
            to="/register"
            className="px-8 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-opacity-90 transition inline-block"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  )
}
