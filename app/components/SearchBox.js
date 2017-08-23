import React, { Component } from 'react';

export default class SearchBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row searchBox">
        <div className="col-sm-12 searchBox-inner">
          <div className="form-group has-feedback">
            <input id="searchText" type="text" className="form-control" name="searchText" placeholder="Search" />
            <span className="glyphicon glyphicon-search form-control-feedback"></span>
          </div>
        </div>
      </div>
    );
  }
}
