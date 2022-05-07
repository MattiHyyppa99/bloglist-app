const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Add users
  const user = helper.initialUsers[0]
  await api.post('/api/users').send(user)
  const res = await api
    .post('/api/login')
    .send(user)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  token = 'bearer '.concat(res.body.token)

  // Add blogs
  await Blog.insertMany(helper.initialBlogs)
})


test('GET /api/blogs returns correct number of blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('id is defined', async () => {
  const response = await api.get('/api/blogs')
  const responseBody = response.body
  responseBody.forEach(blog => {
    expect(blog.id).toBeDefined
  })
})

test('POST /api/blogs fails without token', async () => {
  const newBlog = {
    title: 'Fullstack rules',
    author: 'Noname',
    url: 'https://fullstackrules.com',
    likes: 2,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
})

test('POST /api/blogs succeeds with correct token', async () => {
  const newBlog = {
    title: 'Fullstack rules',
    author: 'Noname',
    url: 'https://fullstackrules.com',
    likes: 2,
  }
  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(newBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  expect(titles).toContain(newBlog.title)

})

test('POST /api/blogs should have default likes === 0', async () => {
  const newBlog = {
    title: 'Fullstack rules',
    author: 'Noname',
    url: 'https://fullstackrules.com'
  }
  const response = await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(newBlog)
  
  expect(response.body.likes).toBe(0)
})

test('POST /api/blogs without title or url should give 400', async () => {
  const newBlog = {
    author: 'Noname'
  }
  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(newBlog)
    .expect(400)
})


afterAll(() => {
  mongoose.connection.close()
})
