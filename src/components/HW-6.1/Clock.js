import React, { Component } from 'react'
import './Clock.css'

export default class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      now: Date.now()
    }
    this.updateInterval = null;
  }
  
  getStyles() {
    const date = new Date(this.state.now);
    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hours = date.getHours() + (date.getTimezoneOffset() / 60) + parseInt(this.props.offset, 10);
    return {
      seconds: { transform: `rotate(${ seconds * 6 }deg)` },
      minutes: { transform: `rotate(${ minutes * 6 }deg)` },
      hours: { transform: `rotate(${ ( hours * 30 ) + ( minutes / 2 ) }deg)` }
    };
  }

  updateTime() {
    this.setState((prev) => ({ ...prev, now: Date.now() }));
  }

  componentDidMount() {
    this.updateInterval = setInterval(() => this.updateTime(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  render() {
    return (
      <div className="clock">
        <div className="clock__name">{ this.props.name }</div>
        <div className="clock__remove" onClick={ () => this.props.onRemove(this.props.id) }>&#10008;</div>
        <div className="clock__wrapper">
          <div className="clock__center"/>
          <div className="clock__hours_container" style={ this.getStyles().hours }>
            <div className="clock__hours"/>
          </div>
          <div className="clock__minutes_container" style={ this.getStyles().minutes }>
            <div className="clock__minutes"/>
          </div>
          <div className="clock__seconds_container" style={ this.getStyles().seconds }>
            <div className="clock__seconds"/>
          </div>
        </div>
      </div>
    )
  }
}
