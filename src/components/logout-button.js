import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
const Styles = styled.div`
  .logout-button {
    left: 77%;
    padding: 10px 15px;
    top: 10px;
    z-index: 20;
    color: #ffffff;
    position: fixed;
    font-size:18px;
    cursor: pointer;
    text-align: center;
    background-color: #0068E6;
    border-radius: 10px;
    box-shadow: 0 3px #999;
  }
  
    .logout-button:hover {
    background-color: #155cb3;
  }

  .logout-button:active {
    background-color: #155cb3;
    box-shadow: 0 5px #666;
    transform: translateY(3px);
}
`

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
      <Styles>
    <button
      className="logout-button"
      onClick={() =>
        logout({
          returnTo: window.location.origin,
        })
      }
    >
      Log Out
    </button></Styles>
  );
};

export default LogoutButton;