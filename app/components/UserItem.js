import React, { Component } from 'react';
import Config from '../Config.js';

export default class UserItem extends Component {
  constructor(props) {
    super(props);
    this.state = {userId: ''};

    this.handleAddFriendClick = this.handleAddFriendClick.bind(this);
  }

  handleAddFriendClick() {
    return fetch(Config.BASE_URL + 'friends/request/' + this.props.user._id, {
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
        this.props.user.friendStatus = 'request';
        this.props.onUpdate({newFriend: true});
        //console.log ('Success');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    var defaultImage = '';
    var youSpan = (localStorage.getItem('id') === this.props.user._id) ? <span> (You)</span> : '';
    var selectedItem = (this.props.user._id === this.props.selectedUser) ? 'active' : '';
    var imageUri = this.props.user.imageUri || defaultImage;
    var addSpan = <button className="btn btn-success" onClick={this.handleAddFriendClick}>Add</button>;
    var addUser = this.props.user.friendStatus && this.props.user.friendStatus.toString() === 'request' ? '' : addSpan;

    return (
      <div className={"row sideBar-body " + selectedItem} key={this.props.user._id}>
        <div className="col-sm-3 col-xs-3 sideBar-avatar">
          <div className="avatar-icon">
            <img src={imageUri} />
          </div>
        </div>
        <div className="col-sm-9 col-xs-9 sideBar-main">
          <div className="row">
            <div className="col-sm-8 col-xs-8 sideBar-name">
              <span className="name-meta">{this.props.user.name}</span>
              {youSpan}
            </div>
            <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
              {addUser}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
