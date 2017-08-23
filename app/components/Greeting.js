import React, { Component } from 'react';

export default class Greeting extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var imageUri = localStorage.getItem('imageUri') || 'http://shurl.esy.es/y';

    return (
      <div className="row heading">
        <div className="col-sm-2 col-md-1 col-xs-3 heading-avatar">
            <div className="heading-avatar-icon">
              <img src={imageUri} />
            </div>
        </div>
        <div className="col-sm-8 col-xs-7 heading-name">
            <a className="heading-name-meta">{localStorage.getItem('name')}
            </a>
            <span className="heading-online">Online</span>
        </div>
        <div className="col-sm-1 col-xs-1  heading-dot pull-right">
            <i className="fa fa-ellipsis-v fa-2x  pull-right" aria-hidden="true"></i>
        </div>
      </div>
    );
  }
}
