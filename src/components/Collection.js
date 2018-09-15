import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import Panel from './Panel';
import axios from 'axios';

class Console extends Component {
  state = {
    geneItems: [], // items to render
    fetched: false,
  }
  componentDidMount() {
    // console.log('component mounted');
    // console.log(this.state);
    if (this.props.isAuthenticated)
      this.fetchData();
  }
  componentDidUpdate(prevProps) {
    // console.log('component updated');
    // console.log(this.state);
    if (this.props.isAuthenticated !== prevProps.isAuthenticated) {
      this.fetchData();
    }
  }
  fetchData = () => {
    // console.log('fetch data called')
    // console.log(this.state);
    let savedGeneIDs = [];
    // read saved ids
    axios.get('/api/items/all').then(resp => {
      for (let i = 0; i < resp.data.length; i++) {
        savedGeneIDs.push(resp.data[i].gene_id)
      }
      // read summry from mygene.info API //use batch query next time TODO
      if (savedGeneIDs.length) {
        for (let i = 0; i < savedGeneIDs.length; i++) {
          axios.get('http://mygene.info/v3/gene/' + savedGeneIDs[i].toString()).then(resp => { // calling the my gene API
            this.setState((prevState, props) => {
              let summary = 'No summary provided at this time.'; // default for items without summary
              if (resp.data.hasOwnProperty('summary')) {
                summary = resp.data['summary'] // overwrite the default no-summary text
              }
              return ({
                geneItems: prevState.geneItems.concat([{ // update internal state storage of items to render
                  heading: resp.data["_id"] + ' ' + resp.data["symbol"],
                  content: summary,
                }]),
                fetched: true
              });
            });
          })
        }
      } else {
        this.setState({
          fetched: true
        })
      }
    })
  }

  deleteItem = (id) => {
    // console.log(id);
    axios.delete('/api/items/' + id.toString()).then(() => {
      this.setState((prevState) => { // update local item render array to not show the deleted item
        return ({
          geneItems: prevState.geneItems.filter((item) => parseInt(item.heading.split(' ')[0], 10) !== id)
        })
      })
      this.forceUpdate(); // in case the state mutation is not immediately reflected
    })
  }
  render() {
    // console.log('rendered')
    let displayElement;
    if (this.props.isAuthenticated) {
      if (this.state.fetched) {
        if (this.state.geneItems.length) {
          displayElement = this.state.geneItems
            .sort((a, b) => {
              let numA = parseInt(a.heading.split(' ')[0], 10);
              let numB = parseInt(b.heading.split(' ')[0], 10);
              // console.log(numA, numB, numA>numB);
              return numA > numB
            })
            .map((item) => {
              return (
                <Panel
                  key={item.heading}
                  heading={item.heading}
                  content={item.content}
                  onDelete={this.deleteItem}
                />
              );
            })
        } else {
          displayElement = <p className='text-center'>No Saved Genes...</p>
        }
      } else {
        displayElement = <p className='text-center'>Loading...</p>
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

// Console.propTypes = {
// };

export default Console;
