import React from 'react'

export default function Note(props) {
  return (
    <li className="crud_task__note">
      <span className="crud_task__note_text">{ props.content }</span>
      <div className="crud_task__note_remove" onClick={ () => props.remove(props.id) } />
    </li>
  )
}
