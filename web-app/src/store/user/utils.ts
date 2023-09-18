import axios from 'axios';

import { config } from '../../config';
import CONSTANTS from '../../constants/constant';
import User from '../../models/user';

axios.defaults.baseURL = config.p2pServerUrl;
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (!window.location.href.includes('/logout')) {
        window.location.href = '/logout';
      } else {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  },
);

export const setAxiosHeaders = (token: string) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const getUserStorage = () => {
  if (localStorage.getItem(CONSTANTS.STORAGE_KEY.GC_USER)) {
    const daibiUser = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE_KEY.GC_USER) || '{}');
    return daibiUser.user;
  }

  if (sessionStorage.getItem(CONSTANTS.STORAGE_KEY.GC_USER)) {
    const daibiUser = JSON.parse(sessionStorage.getItem(CONSTANTS.STORAGE_KEY.GC_USER) || '{}');
    return daibiUser.user;
  }

  return undefined;
};

export const setUserStorage = (newUser: User, type?: boolean) => {
  if (newUser.token) {
    const userStorage = {
      user: newUser,
    };

    type
      ? localStorage.setItem(CONSTANTS.STORAGE_KEY.GC_USER, JSON.stringify(userStorage))
      : sessionStorage.setItem(CONSTANTS.STORAGE_KEY.GC_USER, JSON.stringify(userStorage));
  } else {
    localStorage.removeItem(CONSTANTS.STORAGE_KEY.GC_USER);
    sessionStorage.removeItem(CONSTANTS.STORAGE_KEY.GC_USER);
  }
};
