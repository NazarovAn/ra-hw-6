import React, { Component } from 'react'
import './Clock.css'

export default class Clock extends Component {
  constructor(props) {
    super(props);
    this.hoursHand = React.createRef();
    this.minutesHand = React.createRef();
    this.secondsHand = React.createRef();
  }

  componentDidMount() {
    this.setClock();
  }

  setClock() {
    const date = new Date();
    const hours = date.getHours() + (date.getTimezoneOffset() / 60) + parseInt(this.props.offset, 10);
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    console.log(this.hoursHand.current);
    
    this.hoursHand.current.style.transform = `rotate(${ ( hours * 30 ) + ( minutes / 2 ) }deg)`;    
    this.minutesHand.current.style.transform = `rotate(${ minutes * 6 }deg)`;
    this.secondsHand.current.style.transform = `rotate(${ seconds * 6 }deg)`;

    this.minutesTimeout = setTimeout(() => {
      this.minutesHand.current.style.transform = `rotate(${ minutes * 6 + 6 }deg)`;
      this.minutesHand.current.style.animation = 'rotate 3600s infinite steps(60)';
    }, (60 - seconds) * 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.minutesTimeout);
  }

  render() {
    return (
      <div className="clock">
        <div className="clock__name">{ this.props.name }</div>
        <div className="clock__remove" onClick={ () => this.props.onRemove(this.props.id) }>&#10008;</div>
        <div className="clock__wrapper">
          <div className="clock__center"/>
          <div className="clock__hours_container" ref={ this.hoursHand }>
            <div className="clock__hours"/>
          </div>
          <div className="clock__minutes_container" ref={ this.minutesHand }>
            <div className="clock__minutes"/>
          </div>
          <div className="clock__seconds_container" ref={ this.secondsHand }>
            <div className="clock__seconds"/>
          </div>
        </div>
      </div>
    )
  }
}
