import React, { Component } from 'react';
import axios from 'axios';
// import PropTypes from 'prop-types';

class Home extends Component {
  state = { // home page search result state
    gene_id_input: '',
    info: false,
    warning: false,
    warning_text: '',
    success: false,
  }
  handleSubmit = (event) => {
    event.preventDefault();
    // parse input
    let gene_id_num = parseInt(this.state.gene_id_input, 10);
    // only accept number input
    if (gene_id_num) {
      // request backend INSERT query
      axios.post('/api', {
        action: 'add',
        gene_id: gene_id_num
      })
      .then((response) => {
        // console.log(response);
        // show corresponding message box for different results
        if (response.data==='Already exists.') {
          this.setState({warning: false, info: true, success: false});
        } else if (response.data==='Gene id does not exist.') {
          this.setState({warning: true, info: false, success: false, warning_text: response.data});
        } else {
          this.setState({warning: false, info: false, success: true});
        }
      })
      .catch((error) => {
        this.setState({warning: true, success: false, warning_text: error});
      });
    } else {
      // input is not valid
      this.setState({warning: true, success: false, warning_text:'Gene id should be a non-zero numeric value.'});
    }
  };

  render() {
    return (
      <div>
        <div className="jumbotron text-center"   style={{marginBottom: '10px'}}>
          <h1>Ohh My-Gene</h1>
          <p>Your Own Gene Collections</p>
          <form className="form-inline" onSubmit={this.handleSubmit}>
            <div className="input-group">
              <input type="text"
                value={this.state.gene_id_input}
                onChange={(event) => this.setState({ gene_id_input: event.target.value })}
                className="form-control"
                size="50"
                placeholder="Search Gene by ID" required />
              <div className="input-group-btn">
                <button type="submit" className="btn btn-danger">Search and Add</button>
              </div>
            </div>
          </form>
        </div>
        {this.state.warning && <div className="alert alert-warning text-center">
          <strong>Warning!</strong> {this.state.warning_text}
        </div>}     
        {this.state.info && <div className="alert alert-info text-center">
          <strong>Info!</strong> The gene id you are looking for is already in your collection.
        </div>}   
        {this.state.success && <div className="alert alert-success text-center">
          <strong>Success!</strong> Successfully found the gene you are looking for. Added to my collection.
        </div>}
      </div>
    );
  }
}

// Home.propTypes = {
// };

export default Home;