import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router'
import JSONFormatter from 'json-formatter-js'

class View extends Component {
  constructor() {
    super();
    this.state = {
      geneSummary: null,
      geneOtherInfo: {},
      404: false,
      // warning messages
      info: false,
      warning: false,
      warning_text: '',
      success: false,
    }
    this.myDiv = React.createRef();
  }
  handleAdd = (event) => {
    event.preventDefault();
    // parse input
    let gene_id_num = parseInt(this.props.match.params.id, 10);
    // request backend INSERT query
    axios.post('/api/items/' + gene_id_num.toString())
      .then((response) => {
        // success
        this.setState({ warning: false, info: false, success: true });
      })
      .catch((error) => {
        // unauthorized
        if (error.response.status === 401)
          this.setState({ warning: true, success: false, warning_text: 'Login Needed. Click the link on the top right corner to log in.' });
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
        geneSummary: summary,
        geneOtherInfo: everythingelse,
        404: false
      })
      this.myDiv.current.appendChild(formatter.render());
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
            <button type="button" onClick={this.handleAdd} className="btn btn-primary">Add to My Collection</button>
            <h4 className=''>{this.state.geneSummary}</h4>
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
          <div className="panel panel-default">
            <div className="panel-heading">Visualized Raw Data</div>
            <div className="panel-body" ref={this.myDiv}></div>
          </div>
        </div>
      );
  }
}

export default withRouter(View);