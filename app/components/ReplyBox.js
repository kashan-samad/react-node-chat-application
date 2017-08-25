import React, { Component } from 'react';
import Config from '../Config.js';

export default class ReplyBox extends Component {
  constructor(props) {
    super(props);
    this.state = {comments: '', friendId: ''};

    this.handleFriendIdChange = this.handleFriendIdChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSubmitButtonClick = this.handleSubmitButtonClick.bind(this);
  }

  handleFriendIdChange(event) {
    this.setState({friendId: event.target.value});
  }

  handleCommentChange(event) {
    this.setState({comments: event.target.value});
  }

  handleSubmitButtonClick() {
    return fetch(Config.BASE_URL + 'messages/' + this.props.friendId, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth': localStorage.getItem('accessToken')
      },
      body: JSON.stringify({
        text: this.state.comments
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.error) {
        console.log (responseJson.data.developerMessage);
        console.log (responseJson);
      }
      else {
        this.setState({comments: ''});
        this.props.onUpdate({newConversation: responseJson.data, friendId: this.props.friendId});
        //console.log ('Success');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    var submitButton = this.state.comments ? <button className="btn btn-primary" onClick={this.handleSubmitButtonClick}>Submit</button> : <button className="btn btn-primary" onClick={this.handleSubmitButtonClick} disabled>Submit</button>;
    var textComments = this.state.comments ? this.state.comments : '';
    return (
      <div className="row reply">
        <div className="col-sm-1 col-xs-1 reply-emojis">
          <i className="fa fa-smile-o fa-2x"></i>
        </div>
        <div className="col-sm-8 col-xs-8 reply-main">
          <textarea className="form-control" rows="1" id="comment"  value={this.state.comments} onChange={this.handleCommentChange} />
        </div>
        <div className="col-sm-2 col-xs-2 reply-recording">
          {submitButton}
        </div>
    </div>
    );
  }
}
