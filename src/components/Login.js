import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class Login extends Component {
  render() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="text-center col-sm-3"></div>
                <div className="text-center col-sm-6">
                <h1 className="h3 mb-3 font-weight-normal">Please Login</h1>
                <form action="/action_page.php">
                <div className="form-group">
                    <label className="sr-only" htmlFor="email">Email address:</label>
                    <input type="email" className="form-control" id="email"/>
                </div>
                <div className="form-group">
                    <label className="sr-only" htmlFor="pwd">Password:</label>
                    <input type="password" className="form-control" id="pwd"/>
                </div>
                <div className="checkbox">
                    <label><input type="checkbox"/> Remember me</label>
                </div>
                <button type="submit" className="btn btn-default">Submit</button>
                </form>
                <div className="text-center col-sm-3"></div>
                </div>
            </div>
        </div>
    );
  }
}

// Login.propTypes = {
// };

export default Login;