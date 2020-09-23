import React, { Component } from 'react';

class Login extends Component {
  render() {
    return (
      <article>
        <form
          action="/login"
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            this.props.onSubmit(e.target.userID.value, e.target.userPWD.value);
          }}
        >
          아이디 : <input type="text" name="userID" />
          <br />
          비밀번호 :<input type="password" name="userPWD" />
          <br />
          <input type="submit" />
        </form>
      </article>
    );
  }
}
export default Login;
