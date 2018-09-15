import React, { Component } from 'react';
const axios = require('axios');
// import PropTypes from 'prop-types';

class ContactSheet extends Component {
  constructor() {
    super();
    this.state = {
      searchBox: "",
      members: []
    };
  }
  onFieldChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  componentDidMount = () => {
    axios.get('/auth/all').then(resp => {
      this.setState({
        members: resp.data
      });
    }).catch(error => {
      console.log(error);
    })
  }
  contentSearch = (item) => {
    if (item.username && item.username.S.toLowerCase().includes(this.state.searchBox.toLowerCase()))
      return true;
    if (item.name && item.name.S.toLowerCase().includes(this.state.searchBox.toLowerCase()))
      return true;
    if (item.email && item.email.S.toLowerCase().includes(this.state.searchBox.toLowerCase()))
      return true;
    return false;
  }
  render() {
    return (
      <div>
        <h2>Contact Sheet</h2>
        <p>Type something in the input field to search the table for username, name or emails:</p>
        <input className="form-control" id="searchBox" type="text" placeholder="Search.." value={this.state.searchBox} onChange={this.onFieldChange} />
        <br />
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody id="myTable">
            {this.state.members
              .filter(item => this.contentSearch(item))
              .sort((a, b) => {
                return a.username.S > b.username.S
              })
              .map(item => (
                <tr key={item.username.S}>
                  <td>{item.username.S}</td>
                  <td>{item.name ? item.name.S : "N/A"}</td>
                  <td>{item.email ? item.email.S : "N/A"}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <p>Note information is only available after login.</p>
      </div>
    );
  }
}

// ContactSheet.propTypes = {
// };

export default ContactSheet;