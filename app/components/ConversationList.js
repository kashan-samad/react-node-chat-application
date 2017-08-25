import React, { Component } from 'react';
import ReactDOM from 'react-dom';

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}

function RenderConversationReceiverItem(props) {
  var timestamp = parseInt(props.conversation.createdAt);
  var date = new Date(timestamp);
  var dateFormat = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
  return (
    <div className="row message-body" key={props.conversation._id}>
      <div className="col-sm-12 message-main-receiver">
        <div className="receiver">
          <div className="message-text">
          {props.conversation.text}
          </div>
          <span className="message-time pull-right">
            {dateFormat}
          </span>
        </div>
      </div>
    </div>
  );
}

function RenderConversationSenderItem(props) {
  var timestamp = parseInt(props.conversation.createdAt);
  var date = new Date(timestamp);
  var dateFormat = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
  return (
    <div className="row message-body" key={props.conversation._id}>
      <div className="col-sm-12 message-main-sender">
        <div className="sender">
          <div className="message-text">
          {props.conversation.text}
          </div>
          <span className="message-time pull-right">
            {dateFormat}
          </span>
        </div>
      </div>
    </div>
  );
}

function RenderConversations(props) {
  var count = 0;
  var conversations = props.conversations.map(function(conversation, idx) {
    //console.log (idx);
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

function RenderConversation(props) {
  if (props.conversation.createdBy.toString() !== localStorage.getItem('id').toString()) {
    return (
      <RenderConversationReceiverItem conversation={props.conversation} key={props.conversation._id} />
    );
  }
  else {
    return (
      <RenderConversationSenderItem conversation={props.conversation} key={props.conversation._id} />
    );
  }
}

function RenderEmptyDiv() {
  return (
    <div ref={(el) => { this.messagesContainer = el; }} className="emptyDiv"></div>
  );
}

export default class ConversationList extends Component {
  constructor(props) {
    super(props);
    this.state = {messages: ''};
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this.messagesContainer);
    //console.log (node);
    if (node) {
      node.scrollIntoView();
    }
  }

  render() {
    return (
      <div className="row message" id="oo">
        {renderIf(this.props.messages, <RenderConversations conversations={this.props.messages} />)}

        <div ref={(el) => { this.messagesContainer = el; }} className="emptyDiv"></div>
      </div>
    );    
  }}
