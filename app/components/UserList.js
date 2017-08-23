import React, { Component } from 'react';
import Config from '../Config.js';

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}

function RenderUsers(props) {
  return (
    <div className="Users">
      <UserListing users={props.users} />
    </div>
  );
}

function AddUserLink(props) {
  return (
    <a onClick={props.onClick} href="#">
      Add
    </a>
  );
}

function ConfirmUserLink(props) {
  return (
    <a onClick={props.onClick} href="#">
      Confirm
    </a>
  );
}

function DeleteUserLink(props) {
  return (
    <a onClick={props.onClick} href="#">
      Delete
    </a>
  );
}

function UserListing(props) {
  var users = props.users.map(function(user) {
    return (
      <li key={user._id}>{user.name} 
        <AddUserLink user={user} onClick={handleAddUserLinkClick.bind(this, user._id)} />
        &nbsp;
        <ConfirmUserLink user={user} onClick={handleConfirmUserLinkClick.bind(this, user._id)} />
        &nbsp;
        <DeleteUserLink user={user} onClick={handleDeleteUserLinkClick.bind(this, user._id)} />
      </li>
    );
  });
  return (
    <ul>
      {users}
    </ul>
  );
}

function handleAddUserLinkClick(id) {
  console.log (id);
  return fetch(Config.BASE_URL + 'friends/request/' + id, {
    method: 'get',
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
      //console.log ('Success');
    }
  })
  .catch((error) => {
    console.error(error);
  });  
}

function handleConfirmUserLinkClick(id) {
  console.log (id);
  return fetch(Config.BASE_URL + 'friends/confirm/' + id, {
    method: 'get',
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
      //console.log ('Success');
    }
  })
  .catch((error) => {
    console.error(error);
  });  
}

function handleDeleteUserLinkClick(id) {
  console.log (id);
  return fetch(Config.BASE_URL + 'friends/delete/' + id, {
    method: 'get',
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
      //console.log ('Success');
    }
  })
  .catch((error) => {
    console.error(error);
  });  
}

function UserInfo1(props) {
  console.log ('here');
  return (
    <div className="UserInfo">
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}

export default class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {userData: ''};

    this.handleLoadUsers();
  }

  handleLoadUsers() {
    return fetch(Config.BASE_URL + 'users', {
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
        Users
        {renderIf(this.state.userData, <RenderUsers users={this.state.userData} />)}
      </div>
    );
  }
}
