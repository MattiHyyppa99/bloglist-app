require('dotenv').config()

let PORT = process.env.PORT || 3001
let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

let SECRET_KEY = process.env.SECRET_KEY

const IN_PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
  IN_PRODUCTION,
  SECRET_KEY,
  PORT,
  MONGODB_URI
}