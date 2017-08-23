import React, { Component } from 'react';
import LogoutLink from './LogoutLink.js';
import FriendList from './FriendList.js';
import Greeting from './Greeting.js';
import SearchBox from './SearchBox.js';
import ConversationList from './ConversationList.js';
import ReplyBox from './ReplyBox.js';

export default class Laayout extends Component {
  constructor(props) {
    super(props);
    var userObj = {id: localStorage.getItem('id'), name: localStorage.getItem('name'), username: localStorage.getItem('username'), accessToken: localStorage.getItem('accessToken')};
    var isLoggedIn = userObj.id ? true : false;
    this.state = {isLoggedIn: isLoggedIn, friendId: ''};
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
            <div className="side-two">
              <div className="row newMessage-heading">
                <div className="row newMessage-main">
                  <div className="col-sm-2 col-xs-2 newMessage-back">
                    <i className="fa fa-arrow-left" aria-hidden="true"></i>
                  </div>
                  <div className="col-sm-10 col-xs-10 newMessage-title">
                    New Chat
                  </div>
                </div>
              </div>
              <div className="row composeBox">
                <div className="col-sm-12 composeBox-inner">
                  <div className="form-group has-feedback">
                    <input id="composeText" type="text" className="form-control" name="searchText" placeholder="Search People" />
                    <span className="glyphicon glyphicon-search form-control-feedback"></span>
                  </div>
                </div>
              </div>
              <div className="row compose-sideBar">
                <div className="row sideBar-body">
                  <div className="col-sm-3 col-xs-3 sideBar-avatar">
                    <div className="avatar-icon">
                      <img src="http://shurl.esy.es/y" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-8 conversation">
            <Greeting />
            <ConversationList friendId={this.state.friendId} />
            <ReplyBox friendId={this.state.friendId} onUpdate={this.onUpdate.bind(this)} />
          </div>
        </div>
      </div>
    );
  }

  onUpdate (data) {
    if (data.isLoggedIn !== 'undefined') {
      this.setState({ isLoggedIn: data.isLoggedIn });
    }
    if (data.friendId !== 'undefined') {
      this.setState({ friendId: data.friendId });
    }
    if (data.newConversation !== 'undefined') {
      console.log ('---------------');
      //this.setState({ friendId: data.friendId });
    }
  }
}
