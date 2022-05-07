import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  let mockHandler

  beforeEach(() => {
    const blog = {
      likes: 10,
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      user: {
        username: 'another user',
        name: 'another user',
        id: '5f49036c0a086539d8a32f36'
      },
      id: '5f49038d0a086539d8a32f37'
    }
    const user = '5f49036c0a086539d8a32f36'

    mockHandler = jest.fn()
    component = render(
      <Blog blog={blog} likeBlog={mockHandler} deleteBlog={mockHandler} user={user} />
    )
  })

  test('title and author always visible', () => {
    expect(component.container.querySelector('.info')).toBeDefined()
  })

  test('url and likes are not visible as default', () => {
    const div = component.container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('url and likes are visible when \'view\' button clicked', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('clicking \'like\' button twice adds two likes', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})