import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./views";


const App = () => {
  return (
    <div id="app" className="d-flex flex-column h-100">
      <div className="container flex-grow-1">
        <div className="mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            {/*<Route path="/profile" component={Profile} />*/}
            {/*<Route path="/external-api" component={ExternalApi} />*/}
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default App;
