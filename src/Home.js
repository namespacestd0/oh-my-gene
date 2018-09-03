import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class Home extends Component {
  render() {
    return (
        <div className="jumbotron text-center">
        <h1>Ohh My-Gene</h1> 
        <p>Your Own Gene Collections</p> 
        <form className="form-inline">
            <div className="input-group">
            <input type="email" className="form-control" size="50" placeholder="Search Gene by ID" required/>
            <div className="input-group-btn">
                <button type="button" className="btn btn-danger">Search</button>
            </div>
            </div>
        </form>
        </div>
    );
  }
}

// Home.propTypes = {
// };

export default Home;