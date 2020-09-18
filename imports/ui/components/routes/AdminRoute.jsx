import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';

const AdminRoute = ({ component: Component, ...rest }) => {
  const useAccount = () =>
    useTracker(() => {
      const userId = Meteor.userId();
      return {
        isLoggedIn: !!userId,
        userId,
      };
    }, []);

  const { isLoggedIn, userId } = useAccount();

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn && Roles.userIsInRole(userId, 'admin') ? (
          <Component {...props} />
        ) : (
          <Redirect to='/' />
        )
      }
    />
  );
};

export default AdminRoute;
