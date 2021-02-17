import React from "react";
import head_logo from '../head_logo.PNG';
import styled from "styled-components";

const Styles = styled.div`
  .landing-page {
    position: absolute;
    display: block;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(1.5);
}
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

const Home = () => (
    <Styles>
  <div className="landing-page">
    <img className="mb-3 app-logo" src={head_logo} alt="React logo" width="120" />
    <h1 className="mb-4">ctni.cloud</h1>
    <p className="lead">
      Please login to access ctni.cloud, a cloud-hosted web app for preclinical MRI labs and built by {" "}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://web.northeastern.edu/ctni/"
      >
        CTNI
      </a>
      <a href="http://localhost:3000/studies" className="login-button">Login</a>
    </p>
  </div></Styles>
);

export default Home;
