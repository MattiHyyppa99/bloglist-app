import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = React.createRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Notification notification={notification} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            id="username"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            id="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit" id="login-button">login</button>
      </form>
    </div>
  )

  const logout = () => {
    window.localStorage.removeItem('loggedAppUser')
    setUser(null)
    blogService.setToken(null)
  }

  const showUserInfo = () => (
    <div>
      {user.name} logged in <button onClick={logout}>logout</button>
      <Notification notification={notification} />
    </div>
  )

  const showBlogs = () => (
    <div>
      <h2>blogs</h2>
      {[].concat(blogs)
        .sort((a, b) => b.likes - a.likes)
        .map(blog => <Blog key={blog.id} blog={blog} likeBlog={likeBlog} user={user.username} deleteBlog={deleteBlog} />)}
    </div>
  )

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const response = await blogService.create(blogObject)
    console.log(response)
    setBlogs(blogs.concat(response))
    setNotification({
      message: `a new blog ${response.title} by ${response.author} added`,
      type: 'success'
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const likeBlog = async (blogObject) => {
    const newBlog = {
      ...blogObject,
      likes: blogObject.likes + 1
    }
    const response = await blogService.update(blogObject.id, newBlog)
    console.log(response)
    setBlogs(blogs.map(blog => blog.id !== blogObject.id ? blog : newBlog))
  }

  const deleteBlog = async (id) => {
    const blog = blogs.find(blog => blog.id === id)
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      const response = await blogService.deleteBlog(id)
      console.log(response)
      if (response.status === 204) {
        setBlogs(blogs.filter(blog => blog.id !== id))
      }
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification({
        message: 'wrong credentials',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }
  if (user === null) {
    return (
      loginForm()
    )
  }

  return (
    <div>
      {showUserInfo()}
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {showBlogs()}
    </div>
  )
}

export default App