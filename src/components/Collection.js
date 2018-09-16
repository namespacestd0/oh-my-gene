import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Panel from './Panel';
import axios from 'axios';
import Qs from 'qs'

class Console extends Component {
  state = {
    geneItems: [], // items to render
    fetched: false,
  }
  componentDidMount() {
    if (this.props.isAuthenticated)
      this.fetchData();
  }
  componentDidUpdate(prevProps) {
    if (this.props.isAuthenticated !== prevProps.isAuthenticated) {
      this.fetchData();
    }
  }
  fetchData = () => {
    let savedGeneIDs = [];
    // read saved ids
    axios.get('/api/gene/user/all').then(resp => {
      for (let i = 0; i < resp.data.length; i++) {
        savedGeneIDs.push(resp.data[i].gene_id)
      }
      if (savedGeneIDs.length) {
        axios.request({
          url: 'http://mygene.info/v3/gene',
          method: 'POST',
          params: {
            fields: 'name,summary,symbol'
          },
          data: Qs.stringify({
            ids: savedGeneIDs.join()
          }),
        }).then(resp => {
          let newItems = []
          resp.data.forEach(function (element) {
            let summary = 'No summary provided at this time.'
            if (element.hasOwnProperty('summary')) {
              summary = element['summary']
            }
            newItems.push({
              id: parseInt(element["_id"], 10),
              heading: element["_id"] + ' ' + element["symbol"],
              content: summary,
            })
          })
          this.setState({
            geneItems: newItems,
            fetched: true
          })
        })
      } else {
        // no saved items
        this.setState({
          fetched: true
        })
      }
    }).catch(err => {
      // handle session lost
      if(err.response.status===401) {
        this.props.loggedoutNotifier()
      } else {
        console.log(err)
      }
    })
  }

  deleteItem = (id) => {
    axios.delete('/api/gene/user/' + id.toString()).then(() => {
      this.setState((prevState) => { // update local item render array to not show the deleted item
        return ({
          geneItems: prevState.geneItems.filter((item) => parseInt(item.heading.split(' ')[0], 10) !== id)
        })
      })
    })
  }
  render() {
    let displayElement;
    if (this.props.isAuthenticated) {
      if (this.state.fetched) {
        if (this.state.geneItems.length) {
          displayElement = this.state.geneItems
            .sort((a, b) => {
              return a.id > b.id
            })
            .map((item) => {
              return (
                <Panel key={item.id} heading={item.heading} content={item.content} onDelete={this.deleteItem} />
              );
            })
        } else {
          displayElement = <p className='text-center'>No Saved Genes...</p>
        }
      } else {
        displayElement = <p className='text-center'>Loading from Server...</p>
      }
    } else {
      displayElement = <p className='text-center'>Please login to continue.</p>;
    }
    return (
      <div className='container'>
        <h1 className="h3 text-center">My Gene Collection</h1>
        <br />
        {displayElement}
      </div>
    );
  }
}

Console.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default Console;
