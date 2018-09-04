import React, { Component } from 'react';

class About extends Component {
  render() {
    return (
      <div classNameName="container">
        <h1 className="h3 text-center">About this Project</h1>
        <br />
        <p>This project has utilized the following technologies.</p>
        <ul class="list-group">
          <li class="list-group-item list-group-item-info">Front End: React</li>
          <li class="list-group-item">Bootstrap 3</li>
          <li class="list-group-item">React Router</li>
          <li class="list-group-item list-group-item-success">Back End: Express</li>
          <li class="list-group-item">AWS RDS PostgreSQL</li>
          <li class="list-group-item">Sequelize</li>
          <li class="list-group-item">Axios</li>
        </ul>
      </div>
    );
  }
}

export default About;
