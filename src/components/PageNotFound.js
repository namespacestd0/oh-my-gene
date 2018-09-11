import React, { Component } from 'react';

class PageNotFound extends Component {
  render() {

    return (
        <div className="container">
        <br/>
        <img src='gene.png' 
            alt="404 Graphic" 
            style={{width:'30%', 
                display:'block', 
                marginLeft:'auto', 
                marginRight:'auto'}}/>
        <div className="text-center">
          <h1>Page Not Found</h1>
          <p className="lead">Click on any tab in the navigation bar to return.
          <br/>This page is not yet constructed.</p>
        </div>
      </div>
    );
  }
}

export default PageNotFound;