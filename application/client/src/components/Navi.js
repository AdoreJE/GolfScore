import React, { Component } from 'react';
// import '../App.css';
export class Navi extends Component {
  render() {
    return (
      // <Navbar bg="dark" variant="dark">
      //   <Navbar.Brand href="/">Golf Ground</Navbar.Brand>
      //   <Nav className="mr-auto">
      //     <Nav.Link href="/search">Search</Nav.Link>
      //     <Nav.Link href="/reservation">Resrevation</Nav.Link>
      //     <Nav.Link href="/confirm">Confirm</Nav.Link>
      //   </Nav>
      // </Navbar>
      <ul className="navbar">
        <input
          className="navbar__button"
          type="button"
          value="Home"
          onClick={(e) => {
            e.preventDefault();
            this.props.onChangeMode('home');
          }}
        ></input>
        <input
          className="navbar__button"
          type="button"
          value="CreateGround"
          onClick={(e) => {
            e.preventDefault();
            this.props.onChangeMode('createGround');
          }}
        ></input>
        <input
          className="navbar__button"
          type="button"
          value="Reservation"
          onClick={(e) => {
            e.preventDefault();
            this.props.onChangeMode('reservation');
          }}
        ></input>
        <input
          className="navbar__button"
          type="button"
          value="ConfirmReservation"
          onClick={(e) => {
            e.preventDefault();
            this.props.onChangeMode('confirm');
          }}
        ></input>
      </ul>
    );
  }
}

export default Navi;
