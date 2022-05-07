import { v4 as uuidv4 } from 'uuid';

const testUser = {
  name: 'Test user',
  username: uuidv4(),
  password: 'secret'
}

describe('Blog app', function() {
  before(function() {
    cy.request('POST', 'http://localhost:3001/api/users/', testUser)
  })

  beforeEach(function() {
    cy.visit('http://localhost:3001')
  })

  it('Login from is shown', function() {
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#login-button').should('be.visible')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type(testUser.username)
      cy.get('#password').type(testUser.password)
      cy.get('#login-button').click()

      cy.contains('Test user logged in')
    })
    it('fails with wrong credentials', function() {
      cy.get('#username').type(testUser.username)
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong credential')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.login({ username: testUser.username, password: testUser.password })
      })

      it('A blog can be created', function() {
        cy.contains('new blog').click()
        // Fill in the form
        cy.get('#title').type('Fullstack')
        cy.get('#author').type('some author')
        cy.get('#url').type('http://localhost:3001')
        cy.get('#submit-button').click()
        // Check that the new blog is visible
        cy.wait(5000)
        cy.contains('view').click()
        cy.get('.blog-entry').as('blogEntry')
        cy.get('@blogEntry').contains('Fullstack').should('be.visible')
        cy.get('@blogEntry').contains('some author').should('be.visible')
        cy.get('@blogEntry').contains('http://localhost:3001').should('be.visible')
      })

      describe('and the blog can be liked', function() {
        beforeEach(function() {
          cy.createBlog({
            title: 'Fullstack',
            author: 'some author',
            url: 'http://localhost:3001'
          })
        })

        it('A blog can be liked', function() {
          cy.contains('view').click()
          cy.get('.blog-entry').contains('like').click()
          cy.contains('likes 1')
        })
      })
    })
  })
})