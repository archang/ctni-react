import {NavLink} from "react-router-dom";
import React from "react";


const MainNav = () => (
  <div className="navbar-nav mr-auto">
    <NavLink style={{fontSize :28, marginRight: 18}}
      to="/"
      exact
      className="nav-link"
      activeClassName="router-link-exact-active"
    >
      Home
    </NavLink>
    <NavLink style={{fontSize :28, marginRight: 18}}
      to="/profile"
      exact
      className="nav-link"
      activeClassName="router-link-exact-active"
    >
      Profile
    </NavLink>
    <NavLink style={{fontSize :28, marginRight: 18}}
      to="/external-api"
      exact
      className="nav-link"
      activeClassName="router-link-exact-active"
    >
      External API
    </NavLink>
  </div>
);

export default MainNav;
