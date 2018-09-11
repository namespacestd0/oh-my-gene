import React, { Component } from 'react';
import { Redirect } from 'react-router'
import axios from 'axios';
// import PropTypes from 'prop-types';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      passworderror: false,
      usernameerror: false
    };
  }
  onFieldChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    axios.post('/auth/login', {
      username: this.state.username,
      password: this.state.password
    }).then((resp)=>{
      // console.log(resp);
      this.props.loginHandler(this.state.username);
    }).catch((error)=>{
      // console.log(error);
      this.setState({
        passworderror: true,
        usernameerror: true
      })
      this.forceUpdate();
    });
  }
  render() {
    return (
      this.props.isAuthenticated ? (
        <Redirect to='/'/>
      ) : (
      <div className="container-fluid">
        <br />
        <img src='gene.png'
          alt="Gene Icon"
          style={{
            width: '20%',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto'
          }} />
        <div className="row">
          <div className="col-sm-3"></div>
          <div className="col-sm-6">
            <h1 className="h3 mb-3 font-weight-normal text-center ">Please Login</h1>
            <form onSubmit={this.handleSubmit}>
              <div className={"form-group" + (this.state.usernameerror? ' has-error' : '') }>
                <label htmlFor="username">Username:</label>
                <input type="text" className="form-control" id="username" 
                  value={this.state.username} onChange={this.onFieldChange} />
              </div>
              <div className={"form-group" + (this.state.passworderror? ' has-error' : '') }>
                <label htmlFor="password">Password:</label>
                <input type="password" className="form-control" id="password"  
                  value={this.state.password} onChange={this.onFieldChange} />
              </div>
              {/* <div className="checkbox">
                <label><input type="checkbox" /> Remember me</label>
              </div> */}
              <button type="submit" className="btn btn-default center-block">Submit</button>
            </form>
            <div className="col-sm-3"></div>
          </div>
        </div>
      </div>
      )
    );
  }
}

// Login.propTypes = {
// };

export default Login;