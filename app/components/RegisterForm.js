import React, { Component } from 'react';
import Config from '../Config.js';

function RegisterButton(props) {
  return (
    <button onClick={props.onClick}>
      Register
    </button>
  );
}

function LoginLink(props) {
  return (
    <a onClick={props.onClick} href="#">
      Login
    </a>
  );
}

export default class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.handleRegisterButtonClick = this.handleRegisterButtonClick.bind(this);
    this.handleLoginLinkClick = this.handleLoginLinkClick.bind(this);
    this.state = {isLoggedIn: false, name: 'Kashan Samad', username: 'kashan.samad', password: '123'};

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleLoginLinkClick() {
    this.props.onUpdate({showRegister: false});
  }

  handleRegisterButtonClick() {
    return fetch(Config.BASE_URL + 'users/register', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name,
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.error) {
        console.log (responseJson.data.developerMessage);
        console.log (responseJson);
      }
      else {
        //console.log ('Success');
        this.props.onUpdate({showRegister: false});
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <div>
        <h1>Register:</h1>
        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Name" maxLength="50" value={this.state.name} onChange={this.handleNameChange} />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input type="text" placeholder="Username" maxLength="50" value={this.state.username} onChange={this.handleUsernameChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Password" maxLength="50" value={this.state.password} onChange={this.handlePasswordChange} />
        </div>
        <RegisterButton onClick={this.handleRegisterButtonClick} />
        <br />
        <LoginLink onClick={this.handleLoginLinkClick} />
      </div>
    );
  }
}
