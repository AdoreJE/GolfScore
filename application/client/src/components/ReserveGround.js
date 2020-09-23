import React, { Component } from 'react';
// import ShowDatePicker from './ShowDatePicker';
import SelectGround from './SelectGround';
import ShowDatePickerFunction from './ShowDatePickerFunction';
class ReserveGround extends Component {
  state = {
    groundSelected: false,
    timeSelected: false,
    begin: '',
    end: '',
    selectedGroundID: '',
    userID: 'user01',
  };

  getStringFromDate = (t) => {
    const year = t.getFullYear();
    const month = t.getUTCMonth() + 1;
    const date = t.getUTCDate();
    const hours = t.getHours();
    const minutes = t.getMinutes();
    return `${year}-${month
      .toString()
      .padStart(2, '0')}-${date
      .toString()
      .padStart(2, '0')}T${hours
      .toString()
      .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00Z`;
  };
  selectDate() {
    let _article = '';
    if (this.state.groundSelected) {
      _article = (
        <ShowDatePickerFunction
          setDate={(_beginDate, _endDate) => {
            let beginDate = this.getStringFromDate(_beginDate);
            let endDate = this.getStringFromDate(_endDate);
            console.log(_beginDate);
            console.log(_endDate);
            this.setState({
              begin: beginDate,
              end: endDate,
              timeSelected: true,
            });
          }}
        ></ShowDatePickerFunction>
      );
    }
    return _article;
  }
  render() {
    console.log('ReserveGround');
    var aa = new Date('2020-09-25T09:00');
    console.log(aa);
    let _submitButton = '';
    if (this.state.timeSelected) {
      _submitButton = (
        <p>
          <input type="submit"></input>
        </p>
      );
    }

    return (
      <article>
        <h2>Reserve Ground</h2>
        <h3>Select Ground : </h3>
        <SelectGround
          grounds={this.props.grounds}
          onSelectGround={(_selectedGroundID) => {
            this.setState({
              selectedGroundID: _selectedGroundID,
              groundSelected: true,
            });
          }}
        ></SelectGround>
        <form
          action="/reserve_process"
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            this.props.onSubmit(
              this.state.selectedGroundID,
              this.state.userID,
              this.state.begin,
              this.state.end
            );
          }}
        >
          {/* <ShowDatePicker
            setDate={(_beginDate, _endDate) => {
              let beginDate = this.getStringFromDate(_beginDate);
              let endDate = this.getStringFromDate(_endDate);
              console.log(beginDate);
              console.log(endDate);
              this.setState({
                begin: beginDate,
                end: endDate,
                timeSelected: true,
              });
            }}
          ></ShowDatePicker> */}

          {/* <ShowCalendar></ShowCalendar> */}
          {this.selectDate()}
          {_submitButton}
        </form>
      </article>
    );
  }
}
export default ReserveGround;

// var a = new Date();
// a.getUTCDate();
// a.getUTCMonth;
// a.getY;
// // Custom time class name
// () => {
//   const [startDate, setStartDate] = useState(new Date());

//   let handleColor = (time) => {
//     return time.getHours() > 12 ? 'text-success' : 'text-error';
//   };

//   return (
//     <DatePicker
//       showTimeSelect
//       selected={startDate}
//       onChange={(date) => setStartDate(date)}
//       timeClassName={handleColor}
//     />
//   );
// };

// //Date Range with disabled navigation shown
// () => {
//   const [startDate, setStartDate] = useState(null);
//   return (
//     <DatePicker
//       selected={startDate}
//       onChange={(date) => setStartDate(date)}
//       minDate={new Date()}
//       maxDate={addMonths(new Date(), 5)}
//       showDisabledMonthNavigation
//     />
//   );
// };

// //Include Times
// () => {
//   const [startDate, setStartDate] = useState(
//     setHours(setMinutes(new Date(), 30), 16)
//   );
//   return (
//     <DatePicker
//       selected={startDate}
//       onChange={(date) => setStartDate(date)}
//       showTimeSelect
//       includeTimes={[
//         setHours(setMinutes(new Date(), 0), 17),
//         setHours(setMinutes(new Date(), 30), 18),
//         setHours(setMinutes(new Date(), 30), 19),
//         setHours(setMinutes(new Date(), 30), 17),
//       ]}
//       dateFormat="MMMM d, yyyy h:mm aa"
//     />
//   );
// };

// // Inject Specific Times

// () => {
//   const [startDate, setStartDate] = useState(
//     setHours(setMinutes(new Date(), 30), 16)
//   );
//   return (
//     <DatePicker
//       selected={startDate}
//       onChange={(date) => setStartDate(date)}
//       showTimeSelect
//       timeFormat="HH:mm"
//       injectTimes={[
//         setHours(setMinutes(new Date(), 1), 0),
//         setHours(setMinutes(new Date(), 5), 12),
//         setHours(setMinutes(new Date(), 59), 23),
//       ]}
//       dateFormat="yyyy-MM-dd, h:mm aa "
//     />
//   );
// };

// // Min Date
// () => {
//   const [startDate, setStartDate] = useState(null);
//   return (
//     <DatePicker
//       selected={startDate}
//       onChange={(date) => setStartDate(date)}
//       minDate={subDays(new Date(), 5)}
//       placeholderText="Select a date after 5 days ago"
//     />
//   );
// };

// // Max date
// () => {
//   const [startDate, setStartDate] = useState(new Date());
//   return (
//     <DatePicker
//       selected={startDate}
//       onChange={(date) => setStartDate(date)}
//       maxDate={addDays(new Date(), 5)}
//       placeholderText="Select a date before 5 days in the future"
//     />
//   );
// };

// // ㅊㅚ종
// () => {
//   const [startDate, setStartDate] = useState(
//     setHours(setMinutes(new Date(), 30), 16)
//   );;
//   return (
//     <DatePicker
//       selected={startDate}
//       onChange={date => setStartDate(date)}
//       minDate={new Date()}
//       maxDate={addMonths(new Date(), 6)}
//       showDisabledMonthNavigation
//       showTimeSelect
//       dateFormat="yyyy-MM-dd, h:mm aa"
//     />
//   );
// };
