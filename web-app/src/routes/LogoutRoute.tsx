import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { setUser } from '../store/user/actions';
import User from '../models/user';

const redirectToHome = () => {
  return <Redirect to="/" />;
};

function LogoutRoute(props: RouteProps) {
  const { render, ...rest } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setUser(new User()));
  }, []);

  return <Route {...rest} render={redirectToHome} />;
}

export default LogoutRoute;
