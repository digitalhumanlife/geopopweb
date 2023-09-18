import { ThunkResult } from '..';
import User from '../../models/user';
import { SET_USER } from './types';
import { getUserStorage, setAxiosHeaders, setUserStorage } from './utils';

export function initUserFromStorage(): ThunkResult<void> {
  return (dispatch) => {
    const user = getUserStorage();
    if (user) {
      if (user.token) {
        setAxiosHeaders(user.token);
      }
      dispatch(setUser(user));
    }
  };
}

export function setUser(user: any, type?: boolean): ThunkResult<void> {
  const newUser = new User(user);
  return (dispatch) => {
    setUserStorage(newUser, type);
    setAxiosHeaders(newUser.token);

    dispatch({
      type: SET_USER,
      payload: newUser,
    });
  };
}
