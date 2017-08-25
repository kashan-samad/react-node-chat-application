import React, { Component } from 'react';
import Config from '../Config.js';

function RegisterButton(props) {
  return (
    <button className="btn btn-primary" onClick={props.onClick}>
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
    this.state = {isLoggedIn: false, name: '', username: '', password: '', errorMessage: ''};

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRegisterButtonClick = this.handleRegisterButtonClick.bind(this);
    this.handleLoginLinkClick = this.handleLoginLinkClick.bind(this);
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
        this.setState({errorMessage: responseJson.data.message});
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
    var errorMessage = this.state.errorMessage ? <p className="alert-danger">{this.state.errorMessage}</p> : '';
    return (
      <div className="container app">
        <div className="row app-one">
          <div className="col-md-3">
            <h1>Register</h1>
            {errorMessage}
            <label>Name</label>
            <input type="text" placeholder="Name" maxLength="50" value={this.state.name} onChange={this.handleNameChange} />
            <br />
            <label>Username</label>
            <input type="text" placeholder="Username" maxLength="50" value={this.state.username} onChange={this.handleUsernameChange} />
            <br />
            <label>Password</label>
            <input type="password" placeholder="Password" maxLength="50" value={this.state.password} onChange={this.handlePasswordChange} />
            <RegisterButton onClick={this.handleRegisterButtonClick} />
            <br />
            <LoginLink onClick={this.handleLoginLinkClick} />
          </div>
        </div>
      </div>
    );
  }
}
