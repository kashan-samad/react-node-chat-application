import React, { Component } from 'react';

export default class FriendItem extends Component {
  constructor(props) {
    super(props);
    this.state = {friendId: ''};
    this.handleFriendLinkClick = this.handleFriendLinkClick.bind(this);

    this.state = {isLoggedIn: false};
  }

  handleFriendLinkClick(data) {
    //this.setState({friendId: data._id});
    this.props.onUpdate({friendId: data._id});
  }

  render() {
    var youSpan = (localStorage.getItem('id') === this.props.friend._id) ? <span> (You)</span> : '';
    var selectedItem = (this.props.friend._id === this.props.selectedFriend) ? 'active' : '';
    var imageUri = this.props.friend.imageUri || 'http://shurl.esy.es/y';

    return (
      <div className={"row sideBar-body " + selectedItem} key={this.props.friend._id}>
        <div className="col-sm-3 col-xs-3 sideBar-avatar">
          <div className="avatar-icon">
            <img src={imageUri} />
          </div>
        </div>
        <div className="col-sm-9 col-xs-9 sideBar-main">
          <div className="row">
            <div className="col-sm-8 col-xs-8 sideBar-name">
              <a onClick={() => { this.handleFriendLinkClick(this.props.friend)}}>
                <span className="name-meta">{this.props.friend.name}</span>
              </a>
              {youSpan}
            </div>
            <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
              <span className="time-meta pull-right">{this.props.friend._id}
            </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
