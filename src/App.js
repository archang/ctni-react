import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";


import {Home, Studies} from "./components";
import ProtectedRoute from "./auth/protected-route";
import UploadFiles from "./components/storage";

const App = () => {
  return (
    <div id="app" className="d-flex flex-column h-100">
      <div className="container flex-grow-1">
        <div className="mt-5">
          {/*<BrowserRouter>*/}
            <Switch>
            <Route path="/" exact component={Home} />
            <Route path='/studies' component={Studies} />
            <Route path="/storage" component={UploadFiles} />
          </Switch>
          {/*</BrowserRouter>*/}
        </div>
      </div>
    </div>
  );
};

export default App;
