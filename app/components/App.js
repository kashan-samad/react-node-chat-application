import React, { Component } from 'react';
import RegisterForm from './RegisterForm.js';
import LoginForm from './LoginForm.js';
import Layout from './Layout.js';

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    var userObj = {id: localStorage.getItem('id'), name: localStorage.getItem('name'), username: localStorage.getItem('username'), accessToken: localStorage.getItem('accessToken')};
    var isLoggedIn = userObj.id ? true : false;
    this.state = {isLoggedIn: isLoggedIn, showRegister: false, name: ''};
  }

  render() {
    return (
      <div>
        {renderIf(!this.state.isLoggedIn && !this.state.showRegister, <LoginForm onUpdate={this.onUpdate.bind(this)} />)}
        {renderIf(!this.state.isLoggedIn && this.state.showRegister, <RegisterForm onUpdate={this.onUpdate.bind(this)} />)}
        {renderIf(this.state.isLoggedIn, <Layout onUpdate={this.onUpdate.bind(this)} />)}
      </div>
    );
  }

  onUpdate (data) {
    if (data.isLoggedIn !== 'undefined') {
      this.setState({ isLoggedIn: data.isLoggedIn });
    }
    if (data.showRegister !== 'undefined') {
      this.setState({ showRegister: data.showRegister });
    }
  }
}
