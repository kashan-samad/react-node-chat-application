import React, { Component } from 'react';
import Config from '../Config.js';

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}

function UpdateButton(props) {
  return (
    <button onClick={props.onClick}>
      Update
    </button>
  );
}

function RenderUserDetail(props) {
  console.log (props);
  return (
    <div className="UserDetail">
      <UserDetails user={props.user} />
    </div>
  );
}

function UserDetails(props) {
  return (
    <div>
      Name: <b>{props.user.name}</b>
      <br />
      Username: <i>{props.user.username}</i>
    </div>
  );
}

export default class EditUserDetail extends Component {
  constructor(props) {
    super(props);
    this.handleUpdateButtonClick = this.handleUpdateButtonClick.bind(this);
    this.state = {userData: '', name: '', username: ''};

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);

    this.handleLoadUser();
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handleLoadUser() {
    return fetch(Config.BASE_URL + 'users/' + localStorage.getItem('id'), {
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
      }
      else {
        this.setState({userData: responseJson.data});
        this.setState({name: responseJson.data.name});
        this.setState({username: responseJson.data.username});
        //console.log ('Success');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  handleUpdateButtonClick() {
    return fetch(Config.BASE_URL + 'users/' + localStorage.getItem('id'), {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth': localStorage.getItem('accessToken')
      },
      body: JSON.stringify({
        name: this.state.name,
        username: this.state.username
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
        localStorage.setItem('name', responseJson.data.name);
        localStorage.setItem('username', responseJson.data.username);
        //this.props.onUpdate({showRegister: false});
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <div>
        <h1>Edit:</h1>
        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Name" maxLength="50" value={this.state.name} onChange={this.handleNameChange} />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input type="text" placeholder="Username" maxLength="50" value={this.state.username} onChange={this.handleUsernameChange} />
        </div>
        <UpdateButton onClick={this.handleUpdateButtonClick} />
      </div>
    );
  }
}
