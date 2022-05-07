import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'


test('<BlogForm /> calls onSubmit with correct parameters', () => {
  const createBlog = jest.fn()
  const component = render(
    <BlogForm createBlog={createBlog} />
  )
  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  const expected = {
    title: 'test title',
    author: 'test author',
    url: 'test url'
  }

  fireEvent.change(title, {
    target: { value: expected.title }
  })
  fireEvent.change(author, {
    target: { value: expected.author }
  })
  fireEvent.change(url, {
    target: { value: expected.url }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual(expected)
})