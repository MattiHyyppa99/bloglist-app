const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const userObjects = helper.initialUsers.map(user => new User(user))
  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
})

describe('/api/users', () => {
  test('cannot POST a user with a password that is too short', async () => {
    const newUser = {
      username: 'abc',
      name: 'something',
      password: '12',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password was shorter than 3 letters')
        
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(helper.initialUsers.length)
  })

  test('cannot POST a user with a non-unique username', async () => {
    const existingUsername = await helper.initialUsers[0].username
    const newUser = {
      username: existingUsername,
      name: 'something',
      password: '123',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toContain('`username` to be unique')
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(helper.initialUsers.length)
  })
})


afterAll(() => {
  mongoose.connection.close()
})
