import axios from 'axios';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, useLocation } from 'react-router-dom';
import Account from '../services/Account';
import { setUser } from '../store/user/actions';

const KakaoLogin = (props: RouteComponentProps) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const getToken = async () => {
    const code = query.get('code');
    const state = query.get('state');
    const CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
    const CLIENT_SECRET = process.env.REACT_APP_NAVER_CLIENT_SECRET;
    const REDIRECT_URI = process.env.REACT_APP_NAVER_LOGIN_REDIRECT_URI;

    const API_URL = `/nid/oauth2.0/token`;

    const response = await axios.get(API_URL, {
      params: {
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: code,
        state: state,
      },
      headers: {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET,
      },
    });

    if (response.status === 200) {
      const { access_token, refresh_token } = response.data;
      getUserInfo(access_token, refresh_token);
    }
  };

  const getUserInfo = async (access: string, refresh: string) => {
    const API_URL = `/openapi-naver/v1/nid/me`;

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (response.status === 200) {
      const { email } = response.data.response;
      const sso = await Account.SSO(email);

      if (sso.success) {
        const { data } = sso;
        dispatch(setUser(data));
        props.history.push('/');
      } else {
        props.history.push('/register-terms', { ssoType: 'naver', data: response.data.response });
      }
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return null;
};

export default KakaoLogin;
