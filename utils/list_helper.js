const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const likesReducer = (sum, item) => (
    sum + item['likes']
  )
  return blogs.reduce(likesReducer, 0)
}

const favoriteBlog = (blogs) => {
  const maxReducer = (max, curr) => {
    return curr.likes > max.likes ? curr : max
  }
  if (blogs.length === 0) {
    return {}
  }
  const favBlog = blogs.reduce(maxReducer)
  return {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  let authorsAndBlogCount = new Map()
  blogs.forEach(blog => {
    if (authorsAndBlogCount.has(blog.author)) {
      authorsAndBlogCount.set(blog.author, authorsAndBlogCount.get(blog.author) + 1)
    }
    else {
      authorsAndBlogCount.set(blog.author, 1)
    }
  })
  const [author, blogCount] = Array.from(authorsAndBlogCount).reduce((most, curr) => curr[1] > most[1] ? curr : most)
  return {
    author: author, 
    blogs: blogCount
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  let authorsAndLikes = new Map()
  blogs.forEach(blog => {
    if (authorsAndLikes.has(blog.author)) {
      authorsAndLikes.set(blog.author, authorsAndLikes.get(blog.author) + blog.likes)
    }
    else {
      authorsAndLikes.set(blog.author, blog.likes)
    }
  })
  const [author, likes] = Array.from(authorsAndLikes).reduce((most, curr) => curr[1] > most[1] ? curr : most)
  return {author, likes}
}

module.exports = {
  mostLikes,
  mostBlogs,
  totalLikes,
  favoriteBlog,
  dummy
}