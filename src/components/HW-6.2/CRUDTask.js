import React, { Component } from 'react'
import Note from './Note'
import './CRUDTask.css'

export default class CRUDTask extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      notes: [],
      inputValue: '',
      isSendNote: false,
    };
    this.getNotes = this.getNotes.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.animateSend = this.animateSend.bind(this);
    this.sendAnimation = null;
  }

  componentDidMount() {
    this.getNotes();
  }
  componentWillUnmount() {
    clearTimeout(this.sendAnimation);
  }

  async getNotes() {
    const request = await fetch(process.env.REACT_APP_CRUDE_NOTES);
    const result =  await request.json();
    this.setState({ notes: [...result] });
  }

  async addNote(value) {
    await fetch(process.env.REACT_APP_CRUDE_NOTES, {
      method: 'POST',
      body: JSON.stringify({ id:0, content: value }),
    })
  }
   
  async removeNote(id) {
    await fetch(`${ process.env.REACT_APP_CRUDE_NOTES }/${ id }`, {
      method: 'DELETE',
    });
    this.getNotes();
  }

  animateSend() {
    this.setState((prev) => ({ ...prev, isSendNote: true }));
    this.sendAnimation = setTimeout(() => {
      this.setState((prev) => ({ ...prev, isSendNote: false }));
    }, 1000);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.inputValue.length) {
      return;
    }
    this.addNote(this.state.inputValue);
    this.animateSend();
    this.getNotes();
    this.clearInput();
  }

  handleInput(event) {
    this.setState((prev) => ({ ...prev, inputValue: event.target.value }));
  }
  clearInput() {
    this.setState((prev) => ({ ...prev, inputValue: '' }));
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
          <textarea className="crud_task__textarea" value={ this.state.inputValue } onChange={ this.handleInput }/>
          <div className={ `crud_task__btn ${ this.state.isSendNote ? 'note_send' : '' }` } onClick={ this.handleSubmit }>&#10148;</div>
        </form>
      </div>
    )
  }
}
