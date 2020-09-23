import React, { Component } from 'react';

class SelectGround extends Component {
  getGrounds() {
    let _article = [];
    let i = 0;

    for (i = 0; i < this.props.grounds.length; i++) {
      _article.push(
        <input
          key={this.props.grounds[i].groundID}
          type="button"
          value={this.props.grounds[i].groundName}
          name={this.props.grounds[i].groundID}
          onClick={(e) => {
            e.preventDefault();

            this.props.onSelectGround(e.target.name);
          }}
        ></input>
      );
    }
    // this.props.grounds.map((res) => {
    //   _article = <input type="button" value={res.groundName}></input>;
    //   return _article;
    // });
    return _article;
  }
  render() {
    console.log('SelectGround');

    return <article>{this.getGrounds()}</article>;
  }
}

export default SelectGround;
