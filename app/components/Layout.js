import React, { Component } from 'react';
import LogoutLink from './LogoutLink.js';
import UserDetail from './UserDetail.js';
import EditUserDetail from './EditUserDetail.js';
import FriendList from './FriendList.js';
import Greeting from './Greeting.js';
import SearchBox from './SearchBox.js';
import ConversationList from './ConversationList.js';
import ReplyBox from './ReplyBox.js';

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
    this.state = {isLoggedIn: isLoggedIn, showEdit: false, friendId: '', newConversation: ''};
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
              <SearchBox />
              <FriendList onUpdate={this.onUpdate.bind(this)} />
            </div>
          </div>
          <div className="col-sm-8 conversation">
            <Greeting onUpdate={this.onUpdate.bind(this)} />
            {renderIf(this.state.isLoggedIn && !this.state.friendId && !this.state.showEdit, <UserDetail onUpdate={this.onUpdate.bind(this)} />)}
            {renderIf(this.state.isLoggedIn && !this.state.friendId && this.state.showEdit, <EditUserDetail onUpdate={this.onUpdate.bind(this)} />)}
            {renderIf(this.state.isLoggedIn && this.state.friendId, <ConversationList friendId={this.state.friendId} newConversation={this.state.newConversation} />)}
            {renderIf(this.state.isLoggedIn && this.state.friendId, <ReplyBox friendId={this.state.friendId} onUpdate={this.onUpdate.bind(this)} />)}
          </div>
        </div>
      </div>
    );
  }

  onUpdate (data) {
    if (data.isLoggedIn !== undefined) {
      this.setState({ isLoggedIn: data.isLoggedIn });
      this.props.onUpdate({isLoggedIn: data.isLoggedIn});
    }
    if (data.friendId !== undefined) {
      this.setState({ friendId: data.friendId });
    }
    if (data.newConversation !== undefined) {
      this.setState({ newConversation: data.newConversation });
    }
    if (data.showEdit !== undefined) {
      this.setState({ showEdit: data.showEdit });
    }
  }
}
