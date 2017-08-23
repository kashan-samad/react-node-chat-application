import React, { Component } from 'react';
import Config from '../Config.js';
import FriendItem from './FriendItem.js';

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}

export default class FriendList extends Component {
  constructor(props) {
    super(props);
    this.state = {friendData: '', friendId: ''};

    this.handleLoadFriends();
  }

  handleLoadFriends() {
    return fetch(Config.BASE_URL + 'friends', {
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
        this.setState({friendData: responseJson.data});
        //console.log ('Success');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    let friends = null;
    if (this.state.friendData) {
      friends = this.state.friendData.map((friend) => {
        return (
          <FriendItem friend={friend} key={friend._id} selectedFriend={this.state.friendId} onUpdate={this.onUpdate.bind(this)} />
        );
      });
    }

    return (
      <div className="row sideBar">
        {renderIf(this.state.friendData, friends)}
      </div>
    );
  }
  
  onUpdate (data) {
    if (data.friendId !== 'undefined') {
      this.setState({ friendId: data.friendId });
      this.props.onUpdate({friendId: data.friendId});
      //console.log (this.state.friendId);
    }
  }
}
