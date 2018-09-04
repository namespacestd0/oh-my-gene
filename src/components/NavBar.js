import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
// import PropTypes from 'prop-types';

class NavBar extends Component {
  render() {
    const linkItems = [
      {name: 'My Collection', url: '/collection'},
      // {name: 'Members', url: '/members'},
      {name: 'About', url: '/about'}
    ];
    let links = linkItems.map((linkItem, index) => (
      <li key={index}><NavLink activeClassName="active" to={linkItem.url}>{linkItem.name}</NavLink></li>      
    ));
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link className="navbar-brand" to="/">{this.props.webSiteName}</Link>
          </div>
          <ul className="nav navbar-nav">
            <li><NavLink activeClassName="active" to="/" exact>Home</NavLink></li>
            {links}
          </ul>
          LOGIN LOGIC BELOW, NOT CURRENTLY IN USE
          {/* <ul className="nav navbar-nav navbar-right">
            <li><a href=""><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
            <li><NavLink to="/login"><span className="glyphicon glyphicon-log-in"></span> Login</NavLink></li>
          </ul> */}
        </div>
      </nav>
    );
  }
}

// NavBar.propTypes = {
// };

export default NavBar;

