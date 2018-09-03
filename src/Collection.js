import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import Panel from './Panel';
import axios from 'axios';

class Console extends Component {
  state = {
    interestList: [1017,1018],
    geneItems: []
  }
  componentDidMount() {
    for (let i=0; i< this.state.interestList.length; i++) {
      // console.log(this.state.geneItems);
      axios.get('http://mygene.info/v3/gene/'+ this.state.interestList[i].toString()).then(resp=>{
        this.setState((prevState, props) => {
          return ({geneItems: prevState.geneItems.concat([{
            heading: this.state.interestList[i].toString(),
            content: resp.data['summary']
          }])});
        }); 
      })
    }
  }
  render() {
    return (
      <div className='container'>
        <h1 className="h3 text-center">My Gene Collection</h1>
        <br />
        {this.state.geneItems
          .sort((a, b) => a.heading > b.heading)
          .map((item) => {
            return(
              <Panel
                key={item.heading}
                heading={item.heading}
                content={item.content}
              />
            );})
        }
      </div>
    );
  }
}

// Console.propTypes = {
// };

export default Console;
