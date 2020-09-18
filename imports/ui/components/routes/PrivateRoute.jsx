import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const useAccount = () =>
    useTracker(() => {
      const userId = Meteor.userId();
      return {
        isLoggedIn: !!userId,
      };
    }, []);

  const { isLoggedIn } = useAccount();

  return (
    <Route
      {...rest}
      render={(props) =>
        !isLoggedIn ? <Redirect to='/' /> : <Component {...props} />
      }
    />
  );
};

export default PrivateRoute;
