import React, { Component } from 'react';
import SelectGround from './SelectGround';
import moment from 'moment';
// // import {
//   getYear,
//   getMonth,
//   getDate,
//   getHours,
//   getMinutes,
//   parse,
// } from 'date-fns';
class ConfirmReservation extends Component {
  state = {
    groundSelected: false,
    selectedGroundID: '',
    userID: 'user01',
  };

  getContent() {
    let _article = [];
    let j = 0;
    if (this.state.groundSelected) {
      for (let i = 0; i < this.props.reservations.length; i++) {
        // let year,
        //   month,
        //   date,
        //   hourBegin,
        //   minuteBegin,
        //   hourEnd,
        //   minuteEnd = '';
        // var result = Date.parse(this.props.reservations[i].begin);
        let str = String(this.props.reservations[i].begin);

        console.log(str);
        // console.log(str);
        str = str.slice(0, -1);
        var dateBegin = moment(str);

        str = String(this.props.reservations[i].end);
        str = str.slice(0, -1);
        var dateEnd = moment(str);

        // year =
        // month = getMonth(dateBegin) + 1;
        // date = getDate(dateBegin);
        // hourBegin = getHours(dateBegin);
        // minuteBegin = getMinutes(dateBegin);
        // hourEnd = getHours(dateEnd);
        // minuteEnd = getMinutes(dateEnd);
        // console.log(dateBegin);

        _article.push(
          <div key={j++}>
            <hr key={j++}></hr>
            <p key={j++}>
              year: {dateBegin.year()}년 {dateBegin.month() + 1}월{' '}
              {dateBegin.date()}일
            </p>
            <p key={j++}>
              beginTime: {dateBegin.hour()}:
              {dateBegin.minute() === 0 ? '00' : '30'}
            </p>
            <p key={j++}>
              endTime: {dateEnd.hour()}:{dateEnd.minute() === 0 ? '00' : '30'}
            </p>
            <p key={j++}>
              reservation Number: {this.props.reservations[i].reservationNumber}
            </p>

            {/* <p key={j++}>{this.props.reservations[i].groundID}</p>
          <p key={j++}>{this.props.reservations[i].userID}</p>
          <p key={j++}>{this.props.reservations[i].begin}</p>
          <p key={j++}>{this.props.reservations[i].end}</p>
          <p key={j++}>{this.props.reservations[i].reservationNumber}</p> */}
          </div>
        );
      }
    }
    return _article;
  }
  render() {
    console.log('ConfirmReservation');
    return (
      <article>
        <h2>Confirm Reservaions</h2>
        <h3>Select Ground : </h3>
        <SelectGround
          grounds={this.props.grounds}
          onSelectGround={(_selectedGroundID) => {
            this.setState({
              selectedGroundID: _selectedGroundID,
              groundSelected: true,
            });
            this.props.onSubmit(_selectedGroundID, this.state.userID);
          }}
        ></SelectGround>
        {this.getContent()}
        {/* <form
          action="/confirm_process"
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            this.props.onSubmit(this.state.selectedGroundID, this.state.userID);
          }}
        >
          <p>
            <input type="submit"></input>
          </p>
        </form> */}
      </article>
    );
  }
}

export default ConfirmReservation;
