import React from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom';

import { useUser } from '../store/hooks/hooks';
import Login from '../pages/Login';

function LoginRoute(props: RouteProps) {
  const { render, ...rest } = props;
  const user = useUser();

  const renderLogin = (comProps: RouteComponentProps) => {
    if (user.token) {
      comProps.history.push('/');
    } else {
      return render ? render(comProps) : <Login {...comProps} />;
    }
  };

  return <Route {...rest} render={renderLogin} />;
}

export default LoginRoute;
