import React, { Component } from 'react';
import Config from '../Config.js';

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}

function RenderConversationReceiverItem(props) {
  return (
    <div className="row message-body" key={props.conversation._id}>
      <div className="col-sm-12 message-main-receiver">
        <div className="receiver">
          <div className="message-text">
          {props.conversation.text}
          </div>
          <span className="message-time pull-right">
            Sun
          </span>
        </div>
      </div>
    </div>
  );
}

function RenderConversationSenderItem(props) {
  return (
    <div className="row message-body" key={props.conversation._id}>
      <div className="col-sm-12 message-main-sender">
        <div className="sender">
          <div className="message-text">
          {props.conversation.text}
          </div>
          <span className="message-time pull-right">
            Sun
          </span>
        </div>
      </div>
    </div>
  );
}

function RenderConversations(props) {
  var conversations = props.conversations.map(function(conversation) {
    if (conversation.createdBy.toString() !== localStorage.getItem('id').toString()) {
      return (
        <RenderConversationReceiverItem conversation={conversation} key={conversation._id} />
      );
    }
    else {
      return (
        <RenderConversationSenderItem conversation={conversation} key={conversation._id} />
      );
    }
  });
  return (
    <ul>
      {conversations}
    </ul>
  );
}

export default class ConversationList extends Component {
  constructor(props) {
    super(props);
    this.state = {friendId: '', conversationData: ''};

    this.handleLoadConcersations();
  }

  handleLoadConcersations(friendId) {
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
        this.setState({conversationData: responseJson.data});
        this.setState({friendId: friendId});
        //console.log ('Success');
        //this.props.onUpdate({showRegister: false});
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    if (this.props.friendId !== this.state.friendId) {
      this.handleLoadConcersations(this.props.friendId);
    }
    return (
      <div className="row message" id="conversation">
        {renderIf(this.state.conversationData, <RenderConversations conversations={this.state.conversationData} />)}
      </div>
    );
  }
}

            