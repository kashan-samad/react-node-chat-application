import React, { Component } from 'react';
import Config from '../Config.js';

export default class FriendItem extends Component {
  constructor(props) {
    super(props);
    this.state = {friendId: ''};
    this.handleFriendLinkClick = this.handleFriendLinkClick.bind(this);
    this.handleAcceptFriendClick = this.handleAcceptFriendClick.bind(this);

    this.state = {isLoggedIn: false};
  }

  handleFriendLinkClick(data) {
    //this.setState({friendId: data._id});
    this.props.onUpdate({friendId: data._id});
  }

  handleAcceptFriendClick() {
    return fetch(Config.BASE_URL + 'friends/confirm/' + this.props.friend._id, {
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
        this.setState({errorMessage: responseJson.data.message});
      }
      else {
        console.log (responseJson);
        this.props.friend.friendStatus = 'accept';
        this.props.onUpdate({friendAccepted: this.props.friend});
        //this.props.onUpdate({newFriends: responseJson.data});
        //console.log ('Success');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    var defaultImage = '';
    var youSpan = (localStorage.getItem('id') === this.props.friend._id) ? <span> (You)</span> : '';
    var selectedItem = (this.props.friend._id === this.props.selectedFriend) ? 'active' : '';
    var imageUri = this.props.friend.imageUri || defaultImage;
    var acceptSpan = this.props.friend.friendStatus.toString() === 'request' ? <button className="btn btn-success" onClick={this.handleAcceptFriendClick}>Accept</button> : '';
    var pendingSpan = this.props.friend.friendStatus.toString() === 'pending' ? <label className="text-danger">Pending</label> : '';
    var friendSpan = this.props.friend.friendStatus.toString() === 'accept' ? <a onClick={() => { this.handleFriendLinkClick(this.props.friend)}}>
              <div className="col-sm-8 col-xs-8 sideBar-name">
                <span className="name-meta">{this.props.friend.name}</span>
                {youSpan}
              </div>
            </a> : <div className="col-sm-8 col-xs-8 sideBar-name">
                <span className="name-meta">{this.props.friend.name}</span>
                {youSpan}
              </div>;
    var pendingFriend = this.props.friend.friendStatus.toString() === 'accept' ? '' : 'pendingFriend';

    return (
      <div className={"row sideBar-body " + selectedItem + pendingFriend} key={this.props.friend._id}>
        <div className="col-sm-3 col-xs-3 sideBar-avatar">
          <div className="avatar-icon">
            <img src={imageUri} />
          </div>
        </div>
        <div className="col-sm-9 col-xs-9 sideBar-main">
          <div className="row">
            {friendSpan}
            <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
              {acceptSpan}
              {pendingSpan}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
