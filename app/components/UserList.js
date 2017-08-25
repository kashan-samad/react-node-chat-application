import React, { Component } from 'react';
import Config from '../Config.js';
import UserItem from './UserItem.js';

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}

export default class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {newFriends: ''};
  }

  render() {
    let userList  = null;
    let users = null;
    if (this.props.newFriends) {
      userList = this.props.newFriends;
      users = userList.map((user) => {
        return (
          <UserItem user={user} key={user._id} onUpdate={this.onUpdate.bind(this)} />
        );
      });
    }

    return (
      <div className="row sideBar">
        {renderIf(this.props.newFriends, users)}
      </div>
    );
  }

  onUpdate (data) {
    if (data.newFriend !== undefined) {
    }
  }
}
