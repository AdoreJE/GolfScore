import React, { Component } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

class ShowDatePicker extends Component {
  state = {
    beginDate: new Date(),
    endDate: '',
    disabledDate: [
      {
        date1: new Date('09/25/2020'),
      },
    ],
  };

  handleChangeBegin = (date) => {
    this.setState({
      beginDate: date,
      endDate: date,
    });
  };

  handleChangeEnd = (date) => {
    this.setState({
      endDate: date,
    });
  };

  isWeekday = (date) => {
    const day = Date.getDay(date);
    return day !== 0 && day !== 6;
  };
  render() {
    return (
      <div>
        <DatePicker
          selected={this.state.beginDate}
          // onChange={this.handleChange}
          onChange={this.handleChangeBegin}
          minDate={new Date()}
          // maxDate={addMonths(new Date(), 6)}
          showDisabledMonthNavigation
          showTimeSelect
          filterDate={this.isWeekday}
          dateFormat="yyyy-MM-dd, hh:mm aa"
          excludeTimes={[new Date('2020-09-25T09:00')]}
          inline
          // excludeDates={[new Date('09/25/2020'), new Date('09/26/2020')]}
        />
        <DatePicker
          selected={this.state.endDate}
          // onChange={this.handleChange}
          onChange={this.handleChangeEnd}
          minDate={this.state.beginDate}
          maxDate={this.state.beginDate}
          showDisabledMonthNavigation
          showTimeSelect
          dateFormat="yyyy-MM-dd, hh:mm aa"
          inline
          // excludeDates={[new Date('09/25/2020'), new Date('09/26/2020')]}
        />
        <input
          type="button"
          value="button"
          onClick={(e) => {
            e.preventDefault();
            // console.log(e);

            this.props.setDate(this.state.beginDate, this.state.endDate);
          }}
        ></input>
      </div>
    );
  }
}
export default ShowDatePicker;
