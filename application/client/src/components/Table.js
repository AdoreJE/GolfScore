import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { Table } from 'react-bootstrap';

export class GroundTable extends Component {
  render() {
    return (
      <table className="groundTable">
        <thead>
          <tr>
            {/* <th className="obj">Ground ID</th> */}
            <th className="title">Ground Name</th>
            <th className="title">Begin Time</th>
            <th className="title">End Time</th>
            <th className="title">Total Hole</th>
          </tr>
        </thead>
        <tbody>
          {this.props.grounds.map((res) => (
            <tr key={res.groundID + 1}>
              <td className="obj">{res.groundName}</td>
              <td className="com">{res.availableTimeStart}</td>
              <td className="com">{res.availableTimeEnd}</td>
              <td className="date">{res.totalHole}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default GroundTable;
