import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Panel extends Component {
  render() {
    // INDIVIDUAL GENE INFO BOX IN MY COLLECTION TAB
    return (
        <div className="panel panel-default">
            <div className="panel-heading">
                {this.props.heading}
                <span className="pull-right">
                    <a onClick={()=>{
                        this.props.onDelete(parseInt(this.props.heading.split(' ')[0], 10))}}>Delete</a></span>
                </div>
            <div className="panel-body">{this.props.content}</div>
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