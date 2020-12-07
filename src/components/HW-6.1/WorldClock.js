import { nanoid } from 'nanoid';
import React, { Component } from 'react'
import Clock from './Clock';
import './WorldClock.css'

export default class WorldClock extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      list: [
        { name: "Moscow", offset: '+3', id: nanoid() },
        { name: "New York", offset: '-5', id: nanoid() },
        { name: "London", offset: '0', id: nanoid() },
        { name: "Tokio", offset: '+9', id: nanoid() }
      ],
      nameInputValue: '',
      offsetInputValue: '',
    };
    this.removeClock = this.removeClock.bind(this);
    this.handleInputs = this.handleInputs.bind(this);
    this.addClock = this.addClock.bind(this);
    this.clearInputs = this.clearInputs.bind(this);
  }

  addClock(event) {
    event.preventDefault();
    if (!this.state.nameInputValue || !this.state.offsetInputValue) {
      return;
    }

    this.setState((prev) => ({ ...prev, list: [...prev.list, { name:this.state.nameInputValue, offset: this.state.offsetInputValue, id: nanoid() }] }));
    this.clearInputs();
  }

  removeClock(id) {
    this.setState((prev) => ({ ...prev, list: this.state.list.filter((clock) => clock.id !== id) }));
  }

  handleInputs(event) {
    this.setState((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  clearInputs() {
    this.setState((prev) => ({ ...prev, nameInputValue: '', offsetInputValue: '' }));
  }

  render() {
    return (
      <div className="world_clock">
        <div className="world_clock__inputs_wrapper">
          <label>
            <h5 className="world_clock__input_heading">Название</h5>
            <input className="world_clock__input" value={ this.state.nameInputValue } name="nameInputValue" onChange={ this.handleInputs }/>
          </label>
          <label>
            <h5 className="world_clock__input_heading">Временная зона</h5>
            <input className="world_clock__input" value={ this.state.offsetInputValue } name="offsetInputValue" onChange={ this.handleInputs }/>
          </label>
          <a className="world_clock__add_btn" onClick={ this.addClock } href="/">Добавить</a>
        </div>
        <div className="world_clock__list">
          { this.state.list.map((clock) => <Clock { ...clock } key={ clock.id } onRemove={ this.removeClock } />) }
        </div>
      </div>
    )
  }
}
