import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import Panel from './Panel';
import axios from 'axios';

class Console extends Component {
  state = {
    geneItems: []
  }
  componentDidMount() {
    let savedGeneIDs = [];
    axios.get('/api').then(resp=>{
      for (let i=0; i< resp.data.length; i++) {
        savedGeneIDs.push(resp.data[i].gene_id)
      }
      // console.log(savedGeneIDs);
      for (let i=0; i< savedGeneIDs.length; i++) {
        // console.log('success')
        axios.get('http://mygene.info/v3/gene/'+ savedGeneIDs[i].toString()).then(resp=>{
          this.setState((prevState, props) => {
            let summary = 'No detail provided at this time.';
            if (resp.data.hasOwnProperty('summary')) {
              summary = resp.data['summary']
            }
            return ({geneItems: prevState.geneItems.concat([{
              heading: resp.data["_id"] + ' ' + resp.data["symbol"],
              content: summary
            }])});
          }); 
        })
      }
    })  
    // console.log(savedGeneIDs.length);
  }
  deleteItem = (id) => {
    // console.log(id);
    axios.post('/api', {
      action: 'delete',
      gene_id: id
    }).then(()=>{
      this.setState((prevState)=>{
        return({
          geneItems: prevState.geneItems.filter((item)=>parseInt(item.heading.split(' ')[0],10)!==id)
        })
      })
      this.forceUpdate();
    })
  }
  render() {
    return (
      <div className='container'>
        <h1 className="h3 text-center">My Gene Collection</h1>
        <br />
        {this.state.geneItems.length ? this.state.geneItems
          .sort((a, b) => {
            let numA = parseInt(a.heading.split(' ')[0], 10);
            let numB = parseInt(b.heading.split(' ')[0], 10);
            // console.log(numA, numB, numA>numB);
            return  numA>numB })
          .map((item) => {
            return(
              <Panel
                key={item.heading}
                heading={item.heading}
                content={item.content}
                onDelete={this.deleteItem}
              />
            );}):<p className='text-center'>No saved gene items.</p>
        }
      </div>
    );
  }
}

// Console.propTypes = {
// };

export default Console;
