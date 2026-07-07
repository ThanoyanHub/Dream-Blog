import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { postsAPI } from '../api/posts'
import { commentsAPI } from '../api/comments'
import { Heart, Calendar, User, Trash2, Send, ArrowLeft, MessageSquare } from 'lucide-react'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true)
        const response = await postsAPI.getPostById(id)
        setPost(response.data)
        const commentsResponse = await commentsAPI.getPostComments(id, 0, 100)
        setComments(commentsResponse.data.items || commentsResponse.data)
      } catch (err) {
        console.error('Error fetching post details:', err)
        setError('Failed to load post details')
      } finally {
        setLoading(false)
      }
    }

    fetchPostDetail()
  }, [id])

  const handleLikeToggle = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      if (post.is_liked) {
        await postsAPI.unlikePost(id)
        setPost({
          ...post,
          is_liked: false,
          likes_count: Math.max(0, post.likes_count - 1),
        })
      } else {
        await postsAPI.likePost(id)
        setPost({
          ...post,
          is_liked: true,
          likes_count: post.likes_count + 1,
        })
      }
    } catch (err) {
      console.error('Failed to toggle like:', err)
    }
  }



  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setCommentLoading(true)
      const response = await commentsAPI.createComment(id, { content: newComment })
      const commentData = response.data.comment
      setComments([...comments, commentData])
      setNewComment('')
    } catch (err) {
      alert('Failed to add comment')
    } finally {
      setCommentLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return
    }
    try {
      await commentsAPI.deleteComment(commentId)
      setComments(comments.filter((c) => c.id !== commentId))
    } catch (err) {
      alert('Failed to delete comment')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <p className="text-red-500 font-bold mb-4">{error || 'Post not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 text-dark">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary transition"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden p-8 mb-8">
          {/* Category */}
          {post.category && (
            <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full mb-4">
              {post.category.name}
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl font-extrabold mb-6 leading-tight">{post.title}</h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6 mb-8 text-sm text-gray-500">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <User size={16} className="text-primary" /> By{' '}
                <span className="font-semibold text-dark">{post.author.username}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={16} className="text-primary" />{' '}
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
                  post.is_liked
                    ? 'bg-red-50 text-red-500 border-red-200'
                    : 'hover:bg-background text-gray-500'
                }`}
              >
                <Heart size={18} fill={post.is_liked ? 'currentColor' : 'none'} />
                <span>{post.likes_count}</span>
              </button>

            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none text-gray-700 leading-relaxed text-lg whitespace-pre-wrap font-sans mb-8">
            {post.content}
          </div>
        </article>

        {/* Comments Section */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare size={24} className="text-primary" /> Comments ({comments.length})
          </h3>

          {/* Add Comment Form */}
          {user ? (
            <form onSubmit={handleAddComment} className="mb-8 flex gap-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on this post..."
                className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:border-primary text-dark"
                required
              />
              <button
                type="submit"
                disabled={commentLoading}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition font-semibold flex items-center gap-2"
              >
                {commentLoading ? 'Posting...' : <><Send size={16} /> Post</>}
              </button>
            </form>
          ) : (
            <p className="mb-8 text-gray-500 text-sm">
              Please{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Login
              </Link>{' '}
              to leave a comment.
            </p>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 border rounded-lg bg-background bg-opacity-20 flex justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-bold text-sm text-dark">{comment.author.username}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                </div>

                {(user?.id === comment.author_id || user?.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 hover:text-red-700 transition h-fit p-1"
                    title="Delete Comment"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}

            {comments.length === 0 && (
              <p className="text-center text-gray-500 py-6">Be the first to leave a comment!</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
