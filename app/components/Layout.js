import React, { Component } from 'react';
import LogoutLink from './LogoutLink.js';
import UserDetail from './UserDetail.js';
import EditUserDetail from './EditUserDetail.js';
import FriendList from './FriendList.js';
import UserList from './UserList.js';
import Greeting from './Greeting.js';
import SearchBox from './SearchBox.js';
import ConversationList from './ConversationList.js';
import ReplyBox from './ReplyBox.js';
import Config from '../Config.js';

import io from 'socket.io-client';

var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', function(){});
socket.on('disconnect', function(){});

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}

export default class Laayout extends Component {
  constructor(props) {
    super(props);
    var userObj = {id: localStorage.getItem('id'), name: localStorage.getItem('name'), username: localStorage.getItem('username'), accessToken: localStorage.getItem('accessToken')};
    var isLoggedIn = userObj.id ? true : false;
    this.state = {isLoggedIn: isLoggedIn, showEdit: false, friendId: '', newConversation: '', messages: '', friendSearch: '', newFriends: ''};
    socket.on('message', (data) => {
      if (data.sendTo.toString() === localStorage.getItem('id')) {
        this.updateConversation(data);
        console.log (this.state.newConversation);
        console.log (data.sendTo);
      }
    });
  }

  updateConversation(data) {
    console.log (data);
    var messages = this.state.messages;
    messages.push(data);
    this.setState({
      newConversation: data,
      messages: messages
    });
  }

  render() {
    return (
      <div className="container app">
        <div className="row app-one">
          <div className="col-sm-4 side">
            <div className="side-one">
              <div className="row heading">
                <LogoutLink onUpdate={this.onUpdate.bind(this)} />
                <div className="col-sm-1 col-xs-1  heading-dot  pull-right">
                  <i className="fa fa-ellipsis-v fa-2x  pull-right" aria-hidden="true"></i>
                </div>
                <div className="col-sm-2 col-xs-2 heading-compose  pull-right">
                  <i className="fa fa-comments fa-2x  pull-right" aria-hidden="true"></i>
                </div>
              </div>
              <SearchBox onUpdate={this.onUpdate.bind(this)} />
              {renderIf(this.state.friendSearch && this.state.newFriends, <UserList newFriends={this.state.newFriends} onUpdate={this.onUpdate.bind(this)} />)}
              {renderIf(!this.state.friendSearch, <FriendList onUpdate={this.onUpdate.bind(this)} />)}
            </div>
          </div>
          <div className="col-sm-8 conversation">
            <Greeting onUpdate={this.onUpdate.bind(this)} />
            {renderIf(this.state.isLoggedIn && !this.state.friendId && !this.state.showEdit, <UserDetail onUpdate={this.onUpdate.bind(this)} />)}
            {renderIf(this.state.isLoggedIn && !this.state.friendId && this.state.showEdit, <EditUserDetail onUpdate={this.onUpdate.bind(this)} />)}
            {renderIf(this.state.isLoggedIn && this.state.friendId, <ConversationList messages={this.state.messages} newConversation={this.state.newConversation} />)}
            {renderIf(this.state.isLoggedIn && this.state.friendId, <ReplyBox friendId={this.state.friendId} onUpdate={this.onUpdate.bind(this)} />)}
          </div>
        </div>
      </div>
    );
  }

  handleLoadConversations(friendId) {
    return fetch(Config.BASE_URL + 'messages/' + friendId, {
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
        this.setState({friendId: friendId});
        this.setState({messages: responseJson.data});
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  onUpdate (data) {
    if (data.isLoggedIn !== undefined) {
      this.setState({ isLoggedIn: data.isLoggedIn });
      this.props.onUpdate({isLoggedIn: data.isLoggedIn});
    }
    if (data.friendId !== undefined) {
      this.handleLoadConversations(data.friendId);
      //this.setState({ friendId: data.friendId });
    }
    if (data.newConversation !== undefined) {
      data.newConversation.sendTo = this.state.friendId;
      socket.emit('message', data.newConversation);
      this.setState({ newConversation: data.newConversation });
    }
    if (data.showEdit !== undefined) {
      this.setState({ showEdit: data.showEdit });
    }
    if (data.friendSearch !== undefined) {
      this.setState({ friendSearch: data.friendSearch });
    }
    if (data.newFriends !== undefined) {
      this.setState({ newFriends: data.newFriends });
    }
  }
}
