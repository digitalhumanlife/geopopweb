import React from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom';
import { useUser } from '../store/hooks/hooks';

interface Props extends RouteProps {
  admin?: boolean;
}

const redirectToLogin = (comProps: RouteComponentProps) => {
  return (
    <Redirect
      to={{
        pathname: '/login',
        state: { from: comProps.location },
      }}
    />
  );
};

function PrivateRoute(props: Props) {
  const { render, admin, ...rest } = props;
  const user = useUser();

  const renderRedirect = () => {
    if (user.token) {
      return render;
    } else {
      return redirectToLogin;
    }
  };

  return <Route {...rest} render={renderRedirect()} />;
}

export default PrivateRoute;
