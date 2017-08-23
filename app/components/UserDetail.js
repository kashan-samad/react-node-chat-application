import React, { Component } from 'react';
import Config from '../Config.js';

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
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

export default class UserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {userData: ''};

    this.handleLoadUser();
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
        Details
        {renderIf(this.state.userData, <RenderUserDetail user={this.state.userData} />)}
      </div>
    );
  }
}
