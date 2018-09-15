import React, { Component } from 'react';
import { Redirect } from 'react-router'
import axios from 'axios';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      confirm_password: "",
      name: "",
      email: "",
      username_error: false,
      password_error: false
    };
  }
  onFieldChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  constructRequest() {
    let request = {
      username: this.state.username,
      password: this.state.password,
    }
    if (this.state.email)
      request.email = this.state.email;
    if (this.state.name)
      request.name = this.state.name;
    return request;
  }
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.password === this.state.confirm_password) {
      axios.post('/auth/signup', this.constructRequest()).then((resp)=>{
        // console.log(resp);
        this.props.loginHandler(this.state.username);
      }).catch((error)=>{
        console.log(error);
        this.setState({
          username_error: true,
          password_error: false
        })
      });
    } else {
      this.setState({
        password_error: true
      })
    }
  }
  render() {
    return (
      this.props.isAuthenticated ? (
        <Redirect to='/'/>
      ) : (
      <div>
        <h2>Sign Up</h2>
        <p>Get your own collection and find out the contact info for other researchers.</p>
        <form onSubmit={this.handleSubmit}>
          <div className={"form-group" + (this.state.username_error? ' has-error' : '') }>
            <label htmlFor="email">Username:</label>
            <input type="text" className="form-control" id="username" value={this.state.username} onChange={this.onFieldChange}/>
          </div>
          <div className={"form-group"}>
            <label htmlFor="name">Name: (Optional)</label>
            <input type="text" className="form-control" id="name" value={this.state.name} onChange={this.onFieldChange}/>
          </div>
          <div className={"form-group"}>
            <label htmlFor="email">Email: (Optional)</label>
            <input type="text" className="form-control" id="email" value={this.state.email} onChange={this.onFieldChange}/>
          </div>
          <div className={"form-group" + (this.state.password_error? ' has-warning' : '') }>
            <label htmlFor="password">Password:</label>
            <input type="password" className="form-control" id="password" value={this.state.password} onChange={this.onFieldChange}/>
          </div>
          <div className={"form-group" + (this.state.password_error? ' has-warning' : '') }>
            <label htmlFor="confirm_password">Confirm Password:</label>
            <input type="password" className="form-control" id="confirm_password" value={this.state.confirm_password} onChange={this.onFieldChange}/>
          </div>
          {/* <div className="checkbox">
            <label><input type="checkbox" /> Remember me</label>
          </div> */}
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
      </div>
      )
    );
  }
}

export default Signup;