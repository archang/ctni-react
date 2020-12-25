import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

const Styles = styled.div`
  .login-button {
    padding: 10px 15px;
    z-index: 20;
    color: #ffffff;
    font-size:32px;
    cursor: pointer;
    text-align: center;
    background-color: #0068E6;
    border-radius: 10px;
    box-shadow: 0 3px #999;
    position: absolute;
    display: block;
    left: 50%;
    top: 70%;
    transform: translate(-50%, -50%);
  }
  
    .login-button:hover {
    background-color: #155cb3;
  }

  .login-button:active {
    background-color: #155cb3;
    box-shadow: 0 5px #666;
    // transform: translateY(.5px);
}
`

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
      <Styles>
    <button
      className="login-button"
      onClick={() => loginWithRedirect({
  screen_hint: "signup",

})}
    >
      Log In
    </button></Styles>
  );
};

export default LoginButton;