import React, { Component } from 'react';
import axios from 'axios';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';

class Home extends Component {
  constructor(){
    super()
    this.state = {
      id_input: '',
      users: 0,
      genes: 0,
      records: 0
    }
  }
  componentDidMount() {
    axios.get('/api/gene/statistics').then(resp=>{
      // console.log(resp.data)
      this.setState(resp.data);
    })
  }

  render() {
    return (
      <div>
        <div className="jumbotron text-center">
          <h1>Ohh My-Gene</h1>
          <p>Your Own Gene Collections</p>
          <form className="form-inline" onSubmit={this.handleSubmit}>
            <div className="input-group">
              <input type="text"
                value={this.state.id_input}
                onChange={(event) => this.setState({ id_input: event.target.value })}
                className="form-control"
                size="50"
                placeholder="Search Gene by ID" required />
              <div className="input-group-btn">
                <Link to={"/view/"+this.state.id_input} className="btn btn-danger">Look Up</Link>
              </div>
            </div>
          </form>
        </div>
        <div className='text-center'>
        <h3>Statistics</h3>
        <h5>Live Tracking of Site-wide Usage</h5>
        </div>
        <br />
        <div className="row">
          <div className="col-sm-4">
            <div className="panel panel-success">
              <div className="panel-body text-center"><h1><CountUp end={this.state.users}/></h1></div>
              <div className="panel-footer text-right">Users*</div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="panel panel-success">
              <div className="panel-body text-center"><h1><CountUp end={this.state.genes}/></h1></div>
              <div className="panel-footer text-right">Genes</div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="panel panel-success">
              <div className="panel-body text-center"><h1><CountUp end={this.state.records}/></h1></div>
              <div className="panel-footer text-right">Records</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;