import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import GroundTable from './components/Table';
import Navi from './components/Navi';
import ReservationGround from './components/ReserveGround';
import ReservationSuccessStatus from './components/ReservationSuccessStatus';
import CreateGround from './components/CreateGround';
import ConfirmReservation from './components/ConfirmReservation';
import Login from './components/Login';
import SignUp from './components/SignUp';

// axios.defaults.withCredentials = true;
// let URL = 'http://3.34.50.229:8080';
let URL = 'http://127.0.0.1:8080';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // loginStatus: false,
      // fireRedirect: false,
      // pathToWant: '/',
      reservationSuccess: false,

      myData: '',
      mode: 'home',
      grounds: [
        {
          GROUNDID: '',
          Name: '',
          AvailableTimeStart: '',
          AvailableTimeEnd: '',
          TotalHole: '',
          ReservationNumber: '',
        },
      ],
      reservations: [
        {
          GroundID: '',
          UserID: '',
          Begin: '',
          End: '',
          ReservationNumber: '',
        },
      ],
      reservationResult: {
        GroundID: '',
        UserID: '',
        Begin: '',
        End: '',
      },
    };

    // this.eventSource = new EventSource('http://127.0.0.1:8080/api/events');
    // this.eventSource.onopen = (e) => {
    //   console.log(e);
    // };
    // this.eventSource.onmessage = (e) => {
    //   console.log('onmessage');
    //   console.log(e);
    // };
    // this.eventSource.addEventListener('reservation', (e) => {
    //   console.log(e);
    // });
  }

  componentDidMount() {
    // this.eventSource.onmessage = (e) =>
    //   this.updateFlightState(JSON.parse(e.data));
    axios.get(`${URL}/api/queryallground`).then((res) => {
      this.setState({ grounds: JSON.parse(res.data.response) });
    });
  }

  getContent() {
    let _article = null;
    if (this.state.mode === 'home') {
      _article = (
        <GroundTable grounds={this.state.grounds}>
          {console.log(this.state.grounds)}
        </GroundTable>
      );
    } else if (this.state.mode === 'createGround') {
      _article = (
        <CreateGround
          onSubmit={(
            _groundID,
            _groundName,
            _availableTimeStart,
            _availableTimeEnd,
            _totalHole
          ) => {
            let groundObject = {
              groundID: _groundID,
              groundName: _groundName,
              availableTimeStart: _availableTimeStart,
              availableTimeEnd: _availableTimeEnd,
              totalHole: _totalHole,
            };
            let newGrounds = Array.from(this.state.grounds);
            newGrounds.push(groundObject);
            axios.post(`${URL}/api/createGround`, groundObject).then((res) => {
              console.log(res);
              this.setState({
                grounds: newGrounds,
              });
            });
          }}
        ></CreateGround>
      );
    } else if (this.state.mode === 'reservation') {
      _article = (
        <div>
          <ReservationGround
            grounds={this.state.grounds}
            onSubmit={(_groundID, _userID, _begin, _end) => {
              let reserveObject = {
                groundID: _groundID,
                userID: _userID,
                begin: _begin,
                end: _end,
              };
              axios
                .post(`${URL}/api/reserveGround`, reserveObject)
                .then((res) => {
                  console.log(res);
                  // this.setState({ reservations: JSON.parse(res.data.response) });
                  this.setState({
                    reservationResult: reserveObject,
                    reservationSuccess: true,
                  });
                });
            }}
          ></ReservationGround>
          <ReservationSuccessStatus
            success={this.state.reservationSuccess}
            result={this.state.reservationResult}
          ></ReservationSuccessStatus>
        </div>
      );
    } else if (this.state.mode === 'confirm') {
      _article = (
        <ConfirmReservation
          reservations={this.state.reservations}
          grounds={this.state.grounds}
          onSubmit={(_groundID, _userID) => {
            axios
              .get(`${URL}/api/confirmReservation/${_groundID}/${_userID}`)
              .then((res) => {
                console.log(res);
                this.setState({ reservations: JSON.parse(res.data.response) });
              });
          }}
        ></ConfirmReservation>
      );
    }
    return _article;
  }

  // getRedirect() {
  //   if (this.state.fireRedirect) {
  //     return <Redirect to={this.state.pathToWant}></Redirect>;
  //   } else return '';
  // }

  render() {
    return (
      <div className="container">
        {this.state.myData}
        <Navi
          onChangeMode={(_mode) => {
            this.setState({ mode: _mode });
          }}
        ></Navi>
        <Router>
          {/* {this.getRedirect()} */}
          <Route exact path="/">
            {this.getContent()}
          </Route>
          <Route path="/login">
            <Login
              onSubmit={(_userID, _userPWD) => {
                let loginObject = {
                  userID: _userID,
                  userPWD: _userPWD,
                };

                axios.post(`${URL}/api/login`, loginObject).then((res) => {
                  if (res.data.response === 'success') {
                    alert('login success');
                    console.log(res);
                    // window.location = '/';
                    // this.setState({
                    //   fireRedirect: true,
                    //   pathToWant: '/',
                    // });
                  } else if (res.data.response === 'invalid') {
                    alert('invalid user info');
                    // window.location = '/login';
                    // this.setState({
                    //   fireRedirect: true,
                    //   pathToWant: '/login',
                    // });
                  }
                  console.log(res.data.response);
                });
              }}
            ></Login>
          </Route>
          <Route path="/signup">
            <SignUp
              onSubmit={(_userID, _userPWD, _userNickname) => {
                let loginObject = {
                  userID: _userID,
                  userPWD: _userPWD,
                  userNickname: _userNickname,
                };
                axios.post(`${URL}/api/signup`, loginObject).then((res) => {
                  console.log(res.data.response);
                  if (res.data.response === 'signUp') {
                    alert('sign up success');
                    window.location = '/login';
                    // this.setState({
                    //   fireRedirect: true,
                    //   pathToWant: '/login',
                    // });
                  } else {
                    alert('signup failed');
                  }
                });
              }}
            ></SignUp>
          </Route>
        </Router>
      </div>
    );
  }
}

export default App;

// source.addEventListener('message', (message) => {
//   console.log('Got', message);
// });
