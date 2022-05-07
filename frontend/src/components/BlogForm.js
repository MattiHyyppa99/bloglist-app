import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const addBlog = event => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({
      title: '',
      author: '',
      url: ''
    })
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          title
          <input
            type="text"
            id="title"
            value={newBlog.title}
            onChange={ ({ target }) => setNewBlog({
              ...newBlog,
              title: target.value
            }) }
          />
        </div>
        <div>
          author
          <input
            type="text"
            id="author"
            value={newBlog.author}
            onChange={ ({ target }) => setNewBlog({
              ...newBlog,
              author: target.value
            }) }
          />
        </div>
        <div>
          url
          <input
            type="text"
            id="url"
            value={newBlog.url}
            onChange={ ({ target }) => setNewBlog({
              ...newBlog,
              url: target.value
            }) }
          />
        </div>
        <button type="submit" id="submit-button">create</button>
      </form>
    </div>
  )
}

export default BlogForm
