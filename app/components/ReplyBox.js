import React, { Component } from 'react';
import Config from '../Config.js';

export default class ReplyBox extends Component {
  constructor(props) {
    super(props);
    this.state = {text: '', friendId: ''};

    this.handleFriendIdChange = this.handleFriendIdChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmitButtonClick = this.handleSubmitButtonClick.bind(this);
  }

  handleFriendIdChange(event) {
    this.setState({friendId: event.target.value});
  }

  handleTextChange(event) {
    this.setState({text: event.target.value});
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
        text: this.state.text
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.error) {
        console.log (responseJson.data.developerMessage);
        console.log (responseJson);
      }
      else {
        console.log (responseJson);
        this.setState({text: ''});
        console.log (this.state.text);
        this.props.onUpdate({newConversation: true});
        //console.log ('Success');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    console.log (!this.props.friendId);
    var submitButton = this.props.friendId ? <button onClick={this.handleSubmitButtonClick}>Submit</button> : '';
    return (
      <div className="row reply">
        <div className="col-sm-1 col-xs-1 reply-emojis">
          <i className="fa fa-smile-o fa-2x"></i>
        </div>
        <div className="col-sm-8 col-xs-8 reply-main">
          <textarea className="form-control" rows="1" id="comment" onChange={this.handleTextChange}>{this.props.text}</textarea>
        </div>
        <div className="col-sm-2 col-xs-2 reply-recording">
          {submitButton}
        </div>
    </div>
    );
  }
}
