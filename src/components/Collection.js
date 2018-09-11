import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import Panel from './Panel';
import axios from 'axios';

class Console extends Component {
  state = {
    geneItems: [] // items to render
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
    let savedGeneIDs = []; // intermediate data structure to add query results one by one
    axios.get('/api/items/all').then(resp => { // read from back end all of the saved records
      for (let i = 0; i < resp.data.length; i++) { // add all ids individually
        savedGeneIDs.push(resp.data[i].gene_id) // push to intermediate storage array
      }
      // console.log(savedGeneIDs);
      for (let i = 0; i < savedGeneIDs.length; i++) {  // read summary from mygene api individually
        // console.log('success')
        axios.get('http://mygene.info/v3/gene/' + savedGeneIDs[i].toString()).then(resp => { // calling the my gene API
          this.setState((prevState, props) => {
            let summary = 'No detail provided at this time.'; // default for items without summary
            if (resp.data.hasOwnProperty('summary')) {
              summary = resp.data['summary'] // overwrite the default no-summary text
            }
            return ({
              geneItems: prevState.geneItems.concat([{ // update internal state storage of items to render
                heading: resp.data["_id"] + ' ' + resp.data["symbol"],
                content: summary
              }])
            });
          });
        })
      }
    })
  }

  deleteItem = (id) => {
    // console.log(id);
    axios.delete('/api/items/'+id.toString()).then(() => {
      this.setState((prevState) => { // update local item render array to not show the deleted item
        return ({
          geneItems: prevState.geneItems.filter((item) => parseInt(item.heading.split(' ')[0], 10) !== id)
        })
      })
      this.forceUpdate(); // in case the state mutation is not immediately reflected
    })
  }
  render() {
    return (
      <div className='container'>
        <h1 className="h3 text-center">My Gene Collection</h1>
        <br />
        {this.props.isAuthenticated ? (this.state.geneItems.length ? this.state.geneItems
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
          }) : <p className='text-center'>No saved gene items.</p>
        ) : (<p className='text-center'>Please login to continue.</p>)
        }
      </div>
    );
  }
}

// Console.propTypes = {
// };

export default Console;
