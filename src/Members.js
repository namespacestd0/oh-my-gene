import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class ContactSheet extends Component {
  render() {
    return (
        <div>
        <h2>Filterable Table</h2>
        <p>Type something in the input field to search the table for first names, last names or emails:</p>  
        <input className="form-control" id="myInput" type="text" placeholder="Search.."/>
        <br/>
        <table className="table table-bordered table-striped">
            <thead>
            <tr>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Email</th>
            </tr>
            </thead>
            <tbody id="myTable">
            <tr>
                <td>John</td>
                <td>Doe</td>
                <td>john@example.com</td>
            </tr>
            <tr>
                <td>Mary</td>
                <td>Moe</td>
                <td>mary@mail.com</td>
            </tr>
            <tr>
                <td>July</td>
                <td>Dooley</td>
                <td>july@greatstuff.com</td>
            </tr>
            <tr>
                <td>Anja</td>
                <td>Ravendale</td>
                <td>a_r@test.com</td>
            </tr>
            </tbody>
        </table>
        
        <p>Note that we start the search in tbody, to prevent filtering the table headers.</p>
        </div>
    );
  }
}

// ContactSheet.propTypes = {
// };

export default ContactSheet;