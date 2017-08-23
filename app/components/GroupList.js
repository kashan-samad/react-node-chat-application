import React, { Component } from 'react';
import Config from '../Config.js';

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}

function RenderGroups(props) {
  return (
    <div className="Groups">
      <GroupListing groups={props.groups} />
    </div>
  );
}

function GroupListing(props) {
  var groups = props.groups.map(function(group) {
    return (
      <li key={group._id}>{group.title}</li>
    );
  });
  return (
    <ul>
      {groups}
    </ul>
  );
}

export default class GroupList extends Component {
  constructor(props) {
    super(props);
    this.state = {groupData: ''};

    this.handleLoadGroups();
  }

  handleLoadGroups() {
    return fetch(Config.BASE_URL + 'groups', {
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
        this.setState({groupData: responseJson.data});
        //console.log ('Success');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <div>
        Groups
        {renderIf(this.state.groupData, <RenderGroups groups={this.state.groupData} />)}
      </div>
    );
  }
}
