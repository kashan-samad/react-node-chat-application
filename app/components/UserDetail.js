import React, { Component } from 'react';
import Config from '../Config.js';

export default class UserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {userData: ''};

    this.handleLoadUser();
  }

  handleUserEditClick(data) {
    this.props.onUpdate({showEdit: true});
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
      <div className="row message">
        <ul>
          <br />
          <h3>Details</h3>
          <br />
          <div>
            <div className="row message-body">
              Name: <b>{this.state.userData.name}</b>
              <br /><br />
              Username: <i>{this.state.userData.username}</i>
            </div>
            <br />
            <button className="btn btn-primary" onClick={() => { this.handleUserEditClick()}}>Edit</button>
          </div>
        </ul>
      </div>
    );
  }
}
