import React, { Component } from 'react';

class CreateGround extends Component {
  state = {
    timeSelected: false,
    begin: '',
    end: '',
  };

  render() {
    console.log('CreateGround');

    return (
      <article>
        <h2>CreateGround</h2>

        <form
          action="/create_process"
          method="post"
          onSubmit={function (e) {
            e.preventDefault();
            this.props.onSubmit(
              e.target.groundID.value,
              e.target.groundName.value,
              e.target.availableTimeStart.value,
              e.target.availableTimeEnd.value,
              e.target.totalHole.value
            );
          }.bind(this)}
        >
          <p>
            <input type="text" name="groundID" placeholder="groundID"></input>
          </p>
          <p>
            <input
              type="text"
              name="groundName"
              placeholder="groundName"
            ></input>
          </p>
          <p>
            <input
              type="text"
              name="availableTimeStart"
              placeholder="availableTimeStart"
            ></input>
          </p>
          <p>
            <input
              type="text"
              name="availableTimeEnd"
              placeholder="availableTimeEnd"
            ></input>
          </p>
          <p>
            <input type="text" name="totalHole" placeholder="totalHole"></input>
          </p>
          <p>
            <input type="submit" value="submit"></input>
          </p>
        </form>
      </article>
    );
  }
}
export default CreateGround;
