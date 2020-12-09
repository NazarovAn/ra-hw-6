import React, { Component, createRef } from 'react'
import Message from './Message'
import './Chat.css'
import { nanoid } from 'nanoid';
import { getRandomName, getRandomColor } from './utils' 

export default class Chat extends Component {
  constructor(props) {
    super(props);    
    this.state={
      messages: [],
      inputValue: '',
      userId: '',
      userName: '',
      userColor: '',
      users: [],
    }
    this.refreshInterval = null;
    this.messagesListEnd = createRef();
    this.postMessages = this.postMessages.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getLastMessageId = this.getLastMessageId.bind(this);
    this.startRefresh = this.startRefresh.bind(this);
    this.stopRefresh = this.stopRefresh.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.setUser = this.setUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  async checkNewUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user) {
      this.setState((prev) => ({ ...prev, userId: user.userId, userName: user.userName, userColor: user.userColor }))
      return
    }
    const newUserId = nanoid();
    const newUserName = getRandomName();
    const newUserColor = getRandomColor();
    this.setState((prev) => ({ ...prev, userId: newUserId, userName:newUserName, userColor:newUserColor  }));
    localStorage.setItem('user', JSON.stringify({ userId: newUserId, userName: newUserName, userColor:newUserColor }));
  }

  // Тут мой вариант решения, как сделать ожидание комфортным для пользователя - отобразить список пользователей, подключенных к чату.
  async getUsers() {
    const req = await fetch('http://localhost:7777/users');
    const resp = await req.json();
    this.setState((prev) => ({ ...prev, users: [...resp] }));
  }
  async setUser() {
    fetch('http://localhost:7777/users', {
      method: 'POST',
      body: JSON.stringify({ userName: this.state.userName, userColor: this.state.userColor, userId: this.state.userId })
    })
  }
  async removeUser() {
    fetch(`http://localhost:7777/users`, {
      method: 'POST',
      body: JSON.stringify({ userName: this.state.userName, remove: true })
    })
  }

  getLastMessageId() {
    return this.state.messages.length ? this.state.messages[this.state.messages.length - 1].id : 0;
  }

  startRefresh() {
    this.refreshInterval = setInterval(() => {
      this.getMessages(this.getLastMessageId());
      this.getUsers();
    }, 5000);
  }

  stopRefresh() {
    clearInterval(this.refreshInterval);
  }


  async getMessages(id) {
    const req = await fetch(`http://localhost:7777/messages?from=${ id }`);
    const resp = await req.json();
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, ...resp] }));
  }

  async postMessages() {
    fetch('http://localhost:7777/messages', {
      method: 'POST',
      body: JSON.stringify({
        id: 0,
        userId: this.state.userId,
        content: this.state.inputValue,
      })
    });
  }


  handleInput(event) {
    this.setState((prev) => ({ ...prev, inputValue: event.target.value }));
  }

  clearInput() {
    this.setState((prev) => ({ ...prev, inputValue: '' }));
  }


  async handleSubmit(event) {
    event.preventDefault();
    if (this.state.inputValue === '') {
      return;
    }
    await this.postMessages();
    await this.getMessages(this.getLastMessageId());
    this.clearInput();
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.messagesListEnd.current.scrollIntoView();
  }

  submitListner = (evt) => {
    if (evt.key === 'Enter') {
      this.handleSubmit(evt);
    }
  }

  async componentDidMount() {
    await this.checkNewUser();
    await this.setUser();
    await this.getUsers();
    await this.getMessages(this.getLastMessageId());
    this.startRefresh();
    this.scrollToBottom();

    document.addEventListener('keydown', this.submitListner);
  }

  componentWillUnmount() {
    this.stopRefresh();
    this.removeUser();

    document.removeEventListener('keydown', this.submitListner);
  }

  assembleMessageProps(message) {
    const messageUser = this.state.users.find((user) => message.userId === user.userId);
    const newProps = {
      content: message.content,
      user: message.userId === this.state.userId ? true : false,
      color: messageUser ? messageUser.userColor : '#000',
    }

    return newProps;
  }

  render() {
    return (
      <div className="chat">
        <div className="chat__users__wrapper">
          <div className="chat__current_user" style={ {padding: '10px'} }>
            Ваше имя в чате: 
            <span style={{ color: this.state.userColor }}>
              { this.state.userName }
            </span>
          </div>
          <ul className="chat__users">
            {
              this.state.users.map((user) => {
                return (
                  <li className="chat__users_name" key={ user.userName } style={{ color: user.userColor }} >
                    { user.userName }
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div className="chat__messages_list_wrapper">
          <ul className="chat__messages_list">
            { 
              this.state.messages.map((message) => {
                const newProps = this.assembleMessageProps(message);
                return <Message { ...newProps } key={ message.id } />
              })
            }
          </ul>
          <div className="chat__messages_list_end" ref={ this.messagesListEnd }/>
          <div className="chat__input_wrapper" style={{ position:'sticky', bottom: '20px' }}>
            <input className="chat__input" value={ this.state.inputValue } onChange={ this.handleInput } />
            <a className="chat__submit" href="/" onClick={ this.handleSubmit }>&#10148;</a>
          </div>
        </div>
      </div>
    )
  }
}
