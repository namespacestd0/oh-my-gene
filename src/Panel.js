import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Panel extends Component {
  render() {
    return (
        <div className="panel panel-default">
            <div className="panel-heading">{this.props.heading}</div>
            <div className="panel-body">{this.props.content}</div>
        </div>
    );
  }
}

Panel.propTypes = {
    heading: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};

export default Panel;