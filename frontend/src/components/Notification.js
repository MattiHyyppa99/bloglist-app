import React from 'react'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return (
    <div className={notification.type}>
      <h3>{notification.message}</h3>
    </div>
  )
}

export default Notification