import React from 'react'

export default function Message(props) {
  return (
    <li className={ `chat__message_wrapper ${ props.user ? 'align_right' : '' }` } style={{ color: props.color }}>
      { props.content }
    </li>
  )
}
