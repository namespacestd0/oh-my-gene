import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Panel from './Panel';

const mockHeading = '1017';
const mockContent = 'This gene encodes a member of a family of serine/threonine protein kinases that participate in cell cycle regulation. The encoded protein is the catalytic subunit of the cyclin-dependent protein kinase complex, which regulates progression through the cell cycle. Activity of this protein is especially critical during the G1 to S phase transition. This protein associates with and regulated by other subunits of the complex including cyclin A or E, CDK inhibitor p21Cip1 (CDKN1A), and p27Kip1 (CDKN1B). Alternative splicing results in multiple transcript variants. [provided by RefSeq, Mar 2014].';

class Console extends Component {
  render() {
    return (
        <div className='container'>
            <h1 className="h3 text-center">My Gene Collection</h1>
            <br/>
            <Panel
                heading = {mockHeading}
                content = {mockContent}
            />            
            <Panel
                heading = {mockHeading}
                content = {mockContent}
            />
            <Panel
                heading = {mockHeading}
                content = {mockContent}
            />
        </div>
    );
  }
}

Console.propTypes = {
};

export default Console;
