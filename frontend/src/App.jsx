import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './routes/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Posts from './pages/Posts'
import CreatePost from './pages/CreatePost'
import Profile from './pages/Profile'
import Categories from './pages/Categories'
import Admin from './pages/Admin'
import PostDetail from './pages/PostDetail'
import EditPost from './pages/EditPost'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/post/:id/edit" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}
