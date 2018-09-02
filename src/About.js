import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Panel from './Panel';

class About extends Component {
  render() {
    return (
        <div className="container">
        <div className="jumbotron">
            <h1>Bootstrap Tutorial</h1> 
            <p>Bootstrap is the most popular HTML, CSS, and JS framework for developing
            responsive, mobile-first projects on the web.</p> 
        </div>
        <p>This is some text.</p> 
        <p>This is another text.</p> 
        </div>
    );
  }
}

About.propTypes = {
};

export default About;
