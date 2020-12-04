import React, { Component, createRef } from 'react'
import Note from './Note'
import './CRUDTask.css'

export default class CRUDTask extends Component {
  constructor(props) {
    super(props);
    this.state = { notes: [] };
    this.input = createRef();
    this.sendButton = createRef();
    this.getNotes = this.getNotes.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.clearInput = this.clearInput.bind(this);
  }

  componentDidMount() {
    this.getNotes();
  }

  async getNotes() {
    const request = await fetch('http://localhost:7777/notes');
    const result =  await request.json();
    this.setState({ notes: [...result] });
  }

  async addNote(value) {
    await fetch('http://localhost:7777/notes', {
      method: 'POST',
      body: JSON.stringify({ id:0, content: value }),
    })
  }
   
  async removeNote(id) {
    await fetch(`http://localhost:7777/notes/${ id }`, {
      method: 'DELETE',
    });
    this.getNotes();
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.input.current.value.length) {
      return;
    }
    this.addNote(this.input.current.value);
    this.getNotes();
    this.clearInput();
    this.sendButton.current.classList.add('note_send');
    setTimeout(() => {
      this.sendButton.current.classList.remove('note_send');  
    }, 1000)
  }

  clearInput() {
    this.input.current.value = '';
  }

  handleRefresh(event) {
    this.getNotes();
    event.target.classList.add('refresh_animation');
    setTimeout(() => event.target.classList.remove('refresh_animation'), 1000);
  }

  render() {
    return (
      <div className="crud_task__wrapper">
        <div className="crud_task__refresh" onClick={ this.handleRefresh } />
        <ul className="crud_task_notes_list">
          { this.state.notes.map((note) => {
            return (
              <Note
                key={ note.id }
                id={ note.id }
                content={ note.content }
                remove={ this.removeNote }
              />
            )
          })}
        </ul>
        <form className="crud_task__form">
          <div className="crud_task__form_header">New Note</div>
          <textarea className="crud_task__textarea" ref={ this.input } />
          <div className="crud_task__btn" ref={ this.sendButton } onClick={ this.handleSubmit }>&#10148;</div>
        </form>
      </div>
    )
  }
}
