import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Panel extends Component {
  render() {
    // INDIVIDUAL GENE INFO BOX IN MY COLLECTION TAB
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          {this.props.heading}
          <span className="pull-right">
            <a className="text-muted" onClick={() => {
              this.props.onDelete(parseInt(this.props.heading.split(' ')[0], 10))
            }}><span className="glyphicon glyphicon-remove"></span></a>
          </span>
        </div>
        <div className="panel-body">{this.props.content}</div>
        <div className="panel-footer"><Link to={"/view/" + this.props.heading.split(' ')[0]}>Details</Link></div>
      </div>
    );
  }
}

Panel.propTypes = {
  heading: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default Panel;