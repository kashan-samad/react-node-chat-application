import React, { Component } from 'react';
import Config from '../Config.js';

export default class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    if (event.target.value.length > 0) {
      this.props.onUpdate({friendSearch: true});
      this.friendSearch(event.target.value);
    }
    else {
      this.props.onUpdate({friendSearch: false});
    }
  }

  handleSearchButtonClick(e) {
    e.preventDefault();
    this.friendSearch(this.state.value);
  }
  
  friendSearch(value) {
    return fetch(Config.BASE_URL + 'users/find', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth': localStorage.getItem('accessToken')
      },
      body: JSON.stringify({
        username: value
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.error) {
        console.log (responseJson.data.developerMessage);
        console.log (responseJson);
        this.setState({errorMessage: responseJson.data.message});
      }
      else {
        //console.log (responseJson);
        this.props.onUpdate({newFriends: responseJson.data});
        //console.log ('Success');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    if (this.props.newFriend) {
      this.state.value = '';
    }
    return (
      <div className="row searchBox">
        <div className="col-sm-12 searchBox-inner">
          <div className="form-group has-feedback">
            <form onSubmit={this.handleSearchButtonClick}>
              <input type="text" className="form-control" value={this.state.value} onChange={this.handleChange} />
              <span className="glyphicon glyphicon-search form-control-feedback"></span>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
