import React, { useContext } from "react";
import { withRouter } from "react-router";
import { AuthContext } from "./AuthProvider";

const SignUp = ({ history }) => {
  const { signup } = useContext(AuthContext);
  // AuthContextからsignup関数を受け取る
  const handleSubmit = event => {
    event.preventDefault();
    const { userName, email, password } = event.target.elements;
    signup(userName.value, email.value, password.value, history);
  };

  return (
    <div>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          UserName
          <input name="userName" type="text" placeholder="UserName" />
        </label>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default withRouter(SignUp);