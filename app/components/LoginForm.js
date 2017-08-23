import React, { Component } from 'react';
import Config from '../Config.js';

function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function RegisterLink(props) {
  return (
    <a onClick={props.onClick} href="#">
      Register
    </a>
  );
}

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {isLoggedIn: false, username: 'kashan.samad', password: '123'};

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
    this.handleRegisterLinkClick = this.handleRegisterLinkClick.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleRegisterLinkClick() {
    this.props.onUpdate({showRegister: true});
  }

  handleLoginButtonClick() {
    return fetch(Config.BASE_URL + 'users/login', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
        this.setState({isLoggedIn: true});
        localStorage.setItem('id', responseJson.data._id);
        localStorage.setItem('name', responseJson.data.name);
        localStorage.setItem('username', responseJson.data.username);
        localStorage.setItem('accessToken', responseJson.data.accessToken);
        localStorage.setItem('imageUri', responseJson.data.imageUri);
        this.props.onUpdate({isLoggedIn: this.state.isLoggedIn});
        //console.log ('Success');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <div className="container app">
        <div className="row app-one">
          <div className="col-sm-4 side">
            <h1>Login:</h1>
            <div className="form-group">
              <label>Username</label>
              <input type="text" placeholder="Username" maxLength="50" value={this.state.username} onChange={this.handleUsernameChange} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Password" maxLength="50" value={this.state.password} onChange={this.handlePasswordChange} />
            </div>
            <LoginButton onClick={this.handleLoginButtonClick} />
            <br />
            <RegisterLink onClick={this.handleRegisterLinkClick} />
          </div>
        </div>
      </div>
    );
  }
}
