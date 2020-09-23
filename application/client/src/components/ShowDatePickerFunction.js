import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import {
  setHours,
  setMinutes,
  getYear,
  getMonth,
  getDate,
  getHours,
  getMinutes,
  getSeconds,
  getMilliseconds,
  addMonths,
  format,
} from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

function ShowDatePickerFunction(props) {
  const [startDate, setStartDate] = useState(new Date());

  const [endDate, setEndDate] = useState();
  const [startSelected, setStartSelected] = useState(false);
  const [endSelected, setEndSelected] = useState(false);

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const handleChangeBegin = (date) => {
    console.log('1');
    console.log(getMilliseconds(date));
    if (getSeconds(date) === 0) {
      setStartSelected(true);
    }

    setStartDate(date);
    setEndDate(date);
  };

  const handleChangeEnd = (date) => {
    console.log('2');
    setEndDate(date);
    setEndSelected(true);
  };

  const showAvailableTime = (date) => {
    let lists = [];
    let hourVariable = 0;

    for (hourVariable = 0; hourVariable < getHours(date); hourVariable++) {
      lists.push(setHours(setMinutes(date, 0), hourVariable));
      lists.push(setHours(setMinutes(date, 30), hourVariable));
    }
    if (getMinutes(date) === 30) {
      lists.push(setHours(setMinutes(date, 0), getHours(date)));
    }
    // console.log(lists);
    return lists;
  };

  // const handleOnBlur = (value) => {
  //   console.log('123');
  //   const date = new Date(value);
  //   if (isValid(date)) {
  //     console.log('date: %s', format(date, 'dd/MM/yyyy'));
  //   } else {
  //     console.log('value: %s', date);
  //   }
  // };
  const showEndDatePicker = () => {
    let _article = '';
    if (startSelected) {
      _article = (
        <DatePicker
          className="datePickerTime"
          selected={endDate}
          onChange={handleChangeEnd}
          // showDisabledMonthNavigation
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          timeCaption="Time"
          dateFormat="hh:mm aa"
          inline
          excludeTimes={showAvailableTime(startDate)}
        />
      );
    }
    return _article;
  };
  const showResults = (_startDate, _endDate) => {
    // console.log(_startDate.toString());
    let i = 0;
    let _article = [];

    if (endSelected) {
      _article.push(
        <div key={i++}>
          <p>
            예약날짜 : <span key={i++}>{getYear(_startDate)} 년 </span>
            <span key={i++}>{getMonth(_startDate)} 월 </span>
            <span key={i++}>{getDate(_startDate)} 일 </span>
          </p>
          <p>
            예약시간 : <span key={i++}>{format(_startDate, 'hh:mm aa')}</span> ~{' '}
            <span key={i++}>{format(_endDate, 'hh:mm aa')}</span>
          </p>
          <input
            key={i++}
            type="button"
            value="시간선택"
            onClick={(e) => {
              e.preventDefault();
              props.setDate(startDate, endDate);
            }}
          ></input>
        </div>
      );
    }
    return _article;
  };
  return (
    <div>
      <div className="datePickerContainer">
        <DatePicker
          className="datePickerTime"
          selected={startDate}
          onChange={handleChangeBegin}
          filterDate={isWeekday}
          minDate={new Date()}
          showTimeSelect
          maxDate={addMonths(new Date(), 6)}
          showDisabledMonthNavigation
          dateFormat="yyyy-MM-dd, hh:mm aa"
          // excludeTimes={[new Date('2020-09-25T09:00')]}
          inline
        />
        {showEndDatePicker()}
      </div>
      {showResults(startDate, endDate)}
    </div>
  );
}
export default ShowDatePickerFunction;
