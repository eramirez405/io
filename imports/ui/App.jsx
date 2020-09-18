import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import 'bootstrap/dist/css/bootstrap.min.css';

// Routes
import PrivateRoute from './components/routes/PrivateRoute';
import AdminAndSupRoute from './components/routes/AdminAndSupRoute';
import AdminRoute from './components/routes/AdminRoute';

// Components
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Trent from './components/trent/Trent';
import UserManagement from './components/userManagement/UserManagement';
import Register from './components/auth/Register';

export const App = () => {
  const useAccount = () =>
    useTracker(() => {
      const user = Meteor.user();
      const userId = Meteor.userId();
      const loggingIn = Session.get('logging') || Meteor.loggingIn();
      return {
        user,
        userId,
        isLoggedIn: !!userId,
        loggingIn,
      };
    }, []);

  const { isLoggedIn, user, loggingIn } = useAccount();

  if (loggingIn) {
    return <div />;
  } else {
    return (
      <Router>
        <Switch>
          {isLoggedIn ? (
            <PrivateRoute
              exact
              path='/'
              component={(props) => <Dashboard user={user} {...props} />}
            />
          ) : (
            <Route exact path='/' component={() => <Login />} />
          )}
          <PrivateRoute exact path='/trent' component={Trent} />
          <AdminRoute exact path='/userManagement' component={UserManagement} />
          <AdminRoute exact path='/register' component={Register} />
        </Switch>
      </Router>
    );
  }
};
