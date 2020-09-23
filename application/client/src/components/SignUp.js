import React, { Component } from 'react';

class SignUp extends Component {
  render() {
    return (
      <article>
        <form
          action="/signup"
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            this.props.onSubmit(
              e.target.userID.value,
              e.target.userPWD.value,
              e.target.userNickname.value
            );
          }}
        >
          아이디 : <input type="text" name="userID" />
          <br />
          비밀번호 : <input type="password" name="userPWD" />
          <br />
          닉네임 : <input type="text" name="userNickname" />
          <br />
          <input type="submit" />
        </form>
      </article>
    );
  }
}
export default SignUp;
