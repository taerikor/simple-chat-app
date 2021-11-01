import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

import { userObjState } from "./App";

interface AppRouterProps {
  userObj: userObjState | null;
  isLoggedIn: boolean;
}

const AppRouter: React.FunctionComponent<AppRouterProps> = ({
  userObj,
  isLoggedIn,
}): JSX.Element => {
  return (
    <Router>
      {userObj && (
        <Navigation userId={userObj.userId} userImage={userObj.userImage} />
      )}
      <Switch>
        {isLoggedIn ? (
          userObj && (
            <>
              <Route exact path="/">
                <Home userObj={userObj} />
              </Route>
              <Route exact path="/:userId">
                <Profile userObj={userObj} />
              </Route>
            </>
          )
        ) : (
          <Route exact path="/">
            <Auth />
          </Route>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
