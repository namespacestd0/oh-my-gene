import React, { Component } from 'react';

class About extends Component {
  render() {
    return (
      <div className="container">
        <h1 className="h3 text-center">About this Project</h1>
        <br />
        <p>This project has utilized the following technologies.</p>
        <ul className="list-group">
          <li className="list-group-item list-group-item-info">Front End: React</li>
          <li className="list-group-item">Bootstrap 3</li>
          <li className="list-group-item">React Router</li>
          <li className="list-group-item">ReactiveSearch</li>
          <li className="list-group-item list-group-item-success">Back End: Express</li>
          <li className="list-group-item">AWS RDS PostgreSQL</li>
          <li className="list-group-item">AWS DynamoDB</li>
          <li className="list-group-item">AWS ElasticSearch</li>
          <li className="list-group-item">Sequelize</li>
          <li className="list-group-item">Passport</li>
          <li className="list-group-item">Axios</li>
          <li className="list-group-item">Nginx</li>
        </ul>
      </div>
    );
  }
}

export default About;
