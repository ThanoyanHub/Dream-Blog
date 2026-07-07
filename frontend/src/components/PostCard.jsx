import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle } from 'lucide-react'

export default function PostCard({ post }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      {/* Content */}
      <div className="p-6">
        {/* Category Badge */}
        {post.category && (
          <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full mb-3">
            {post.category.name}
          </span>
        )}

        {/* Title */}
        <Link to={`/post/${post.id}`}>
          <h3 className="text-xl font-bold text-dark hover:text-primary transition mb-2 line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {post.excerpt || post.content.substring(0, 150) + '...'}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b">
          <div className="flex items-center gap-4">
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>

        {/* Author & Actions */}
        <div className="flex items-center justify-between">
          <Link
            to={`/author/${post.author.id}`}
            className="flex items-center gap-2 hover:opacity-70 transition"
          >
            {post.author.avatar_url && (
              <img
                src={post.author.avatar_url}
                alt={post.author.username}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm font-medium text-dark">{post.author.username}</span>
          </Link>

          <Link
            to={`/post/${post.id}`}
            className="px-4 py-2 text-primary font-semibold hover:bg-background rounded transition"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  )
}
