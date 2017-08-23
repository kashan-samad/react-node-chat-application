import React, { Component } from 'react';
import Config from '../Config.js';

function LogoutButton(props) {
  return (
    <div className="col-sm-3 col-xs-3 heading-avatar">
      <div className="heading-avatar-icon">
        <button onClick={props.onClick}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default class LogoutLink extends Component {
  constructor(props) {
    super(props);
    this.handleLogoutButtonClick = this.handleLogoutButtonClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLogoutButtonClick() {
    return fetch(Config.BASE_URL + 'users/logout', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth': localStorage.getItem('accessToken')
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.error) {
        console.log (responseJson.data.developerMessage);
        console.log (responseJson);
        localStorage.removeItem('id');
        localStorage.removeItem('name');
        localStorage.removeItem('username');
        localStorage.removeItem('accessToken');
        this.props.onUpdate({isLoggedIn: this.state.isLoggedIn});
      }
      else {
        this.setState({isLoggedIn: false});
        localStorage.removeItem('id');
        localStorage.removeItem('name');
        localStorage.removeItem('username');
        localStorage.removeItem('accessToken');
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
      <div>
        <LogoutButton onClick={this.handleLogoutButtonClick} />
      </div>
    );
  }
}
