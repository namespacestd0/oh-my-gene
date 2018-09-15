import React, { Component } from 'react';
import { withRouter } from 'react-router'
import JSONFormatter from 'json-formatter-js'
import axios from 'axios';

// status: loading -> 404
//         loaded  -> authentication -> failed
//                                   -> pass     ->  added/indexed


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
  handleIndex = (event) => {
    event.preventDefault();
    // console.log(this.state.geneOtherInfo._id)
    if (this.props.isAuthenticated) {
      axios.put('/api/search/' + this.state.geneOtherInfo._id, this.state.geneSummary)
      .then((resp) => {
        console.log(resp)
        this.setState({      
          info: false,
          warning: false,
          success: true,})        
      }).catch((err) => {
        console.log(err)
      })
    } else {
      this.setState({      
        info: false,
        warning: true,
        success: false,})
    }
  }
  handleAdd = (event) => {
    event.preventDefault();
    // parse input
    // let gene_id_num = parseInt(this.props.match.params.id, 10); REMOVE
    // request backend INSERT query
    axios.post('/api/items/' + this.state.geneOtherInfo._id)
      .then((response) => {
        // success
        this.setState({ warning: false, info: false, success: true });
      })
      .catch((error) => {
        // unauthorized
        if (error.response.status === 401)
          this.setState({ warning: true, info: false, success: false});
        else // already exists
          this.setState({ warning: false, info: true, success: false });
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
        geneSummary: summary?summary:"No Summary Provided.",
        geneOtherInfo: everythingelse,
        404: false
      },() => {
        this.myDiv.current.appendChild(formatter.render());
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
            <button type="button" onClick={this.handleAdd} className={"btn btn-primary" + (this.state.added?" disabled":"")}>{this.state.added?'Added to Collection':'Add to Collection'}</button>{' '}
            <button type="button" onClick={this.handleIndex} className={"btn btn-primary" + (this.state.indexed?" disabled":"")}>{this.state.indexed?'Indexed Publicly':'Index Publicly'}</button>
            <h4 className=''>{this.state.geneSummary}</h4>
          </div>
          {this.state.warning && <div className="alert alert-warning text-center">
            <strong>Warning!</strong> Login Needed. Click the link on the top right corner to log in.
          </div>}
          {this.state.info && <div className="alert alert-info text-center">
            <strong>Info!</strong> Duplicated request. No action is taken.
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