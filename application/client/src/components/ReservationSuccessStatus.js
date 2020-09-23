import React, { Component } from 'react';

class ReservationSuccessStatus extends Component {
  getContent() {
    var _article = '';

    if (this.props.success) {
      console.log('print reservation status');
      console.log(this.props.result);
      var _groundID,
        _userID,
        _begin,
        _end = '';

      _groundID = this.props.result.groundID;
      _userID = this.props.result.userID;
      _begin = this.props.result.begin;
      _end = this.props.result.end;
      _article = `예약 결과 조회
      groundID : ${_groundID}
      userID: ${_userID}
      beginTime: ${_begin}
      endTime: ${_end}`;

      alert(_article);
    }
  }
  render() {
    return <article>{this.getContent()}</article>;
  }
}
export default ReservationSuccessStatus;
