import React, { Component } from 'react';
import { withRouter } from 'react-router'
import JSONFormatter from 'json-formatter-js'
import axios from 'axios';

class View extends Component {
  constructor() {
    super();
    this.state = {
      404: false,
      // gene info
      geneSummary: null,
      geneOtherInfo: {},
      // user info
      added: false,
      indexed: false,
      // warning messages
      info: false,
      warning: false,
      success: false,
    }
    this.myDiv = React.createRef();
  }
  handleRemoveFromIndex = (event) => {
    event.preventDefault();
    if (this.props.isAuthenticated) {
      axios.delete('/api/search/' + this.state.geneOtherInfo._id)
        .then((resp) => {
          this.setState({
            info: false,
            warning: false,
            success: true,
            indexed: false
          })
        })
    } else {
      // login needed alert
      this.setState({
        info: false,
        warning: true,
        success: false,
      })
    }
  }
  handleIndex = (event) => {
    event.preventDefault();
    if (this.props.isAuthenticated) {
      if (this.state.added) {
        axios.put('/api/search/' + this.state.geneOtherInfo._id, {
          summary: this.state.geneSummary, 
          name:this.state.geneOtherInfo.symbol})
          .then((resp) => {
            // console.log(resp)
            this.setState({
              info: false,
              warning: false,
              success: true,
              indexed: true
            })
          })
      } else {
        this.setState({
          info: true,
          warning: false,
          success: false,
        })
      }
    } else {
      // login needed alert
      this.setState({
        info: false,
        warning: true,
        success: false,
      })
    }
  }
  handleAdd = (event) => {
    event.preventDefault();
    // request backend INSERT query
    axios.post('/api/gene/user/' + this.state.geneOtherInfo._id)
      .then((response) => {
        // success
        this.setState({ warning: false, info: false, success: true, added: true });
      })
      .catch((error) => {
        // unauthorized
        if (error.response.status === 401)
          this.setState({ warning: true, info: false, success: false });
        else // already exists
          this.setState({ warning: false, info: false, success: true });
      });
  };
  componentDidMount() {
    axios.get('http://mygene.info/v3/gene/' + this.props.match.params.id).then(resp => {
      const { summary, ...everythingelse } = resp.data;
      const formatter = new JSONFormatter(everythingelse, 1, {
        hoverPreviewEnabled: true,
        hoverPreviewArrayCount: 100,
        hoverPreviewFieldCount: 2,
        theme: '',
        animateOpen: true,
        animateClose: true,
        useToJSON: true
      });
      this.setState({
        geneSummary: summary ? summary : "No Summary Provided.",
        geneOtherInfo: everythingelse,
        404: false
      }, () => {
        this.myDiv.current.appendChild(formatter.render());
        axios.get('/api/gene/user/' + this.state.geneOtherInfo._id).then(resp => {
          this.setState({
            added: resp.data,
            indexed: resp.data ? resp.data[0].indexed : false
          })
        }).catch(err => {
          // console.log(err)
        })
      })
    }).catch(error => {
      this.setState({
        404: true
      })
    })
  }

  render() {
    return this.state[404] ? (
      <div className="jumbotron">
        <h2 className='text-capitalize'>N/A
          <br /><small>Does not exist.</small></h2>
        <button type="button" className="btn btn-primary disabled">Add to My Collection</button>
        <h4 className=''>Click 'Home' on navigation bar to try another one.</h4>
      </div>) : (
        <div>
          <div className="jumbotron" style={{ marginBottom: '18px' }}>
            <h2 className='text-capitalize'>{this.state.geneOtherInfo.name}
              <br /><small>{this.state.geneSummary ? (this.state.geneOtherInfo._id + ' ' + this.state.geneOtherInfo.symbol) : 'Loading...'}</small></h2>
            <button type="button" onClick={this.handleAdd} className={"btn btn-primary" + (this.state.added ? " disabled" : "")}>{this.state.added ? 'Added to Collection' : 'Add to Collection'}</button>{' '}
            <button type="button" onClick={this.handleIndex} className={"btn btn-primary" + (this.state.indexed ? " disabled" : "")}>{this.state.indexed ? 'Indexed Publicly' : 'Index Publicly'}</button>
            <button type="button" onClick={this.handleRemoveFromIndex} className={"btn btn-link" + (this.state.indexed ? "" : " hidden")}>Remove from Index</button>
            <h4 className=''>{this.state.geneSummary}</h4>
          </div>
          {this.state.warning && <div className="alert alert-warning text-center">
            <strong>Warning!</strong> Login Needed. Click the link on the top right corner to log in.
          </div>}
          {this.state.info && <div className="alert alert-info text-center">
            <strong>Info!</strong> Please add the itme to collection before indexing.
        </div>}
          {this.state.success && <div className="alert alert-success text-center">
            <strong>Success!</strong> Successfully performed the request.
        </div>}
          <div className="panel panel-default">
            <div className="panel-heading">Visualized Raw Data</div>
            <div className="panel-body" ref={this.myDiv}></div>
          </div>
        </div>
      );
  }
}

export default withRouter(View);