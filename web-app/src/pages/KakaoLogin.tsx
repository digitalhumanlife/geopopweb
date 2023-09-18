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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getToken = async () => {
    const code = query.get('code');
    const REST_API_KEY = process.env.REACT_APP_KAKAO_API_KEY;
    const REDIRECT_URI = process.env.REACT_APP_KAKAO_LOGIN_REDIRECT_URI;
    const CLIENT_SECRET = process.env.REACT_APP_KAKAO_CLIENT_SECRET;

    try {
      const res = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        {
          // grant_type: 'authorization_code',
          // client_id: REST_API_KEY,
          // // redirect_uri: REDIRECT_URI,
          // code: code,
          // client_secret: CLIENT_SECRET,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            grant_type: 'authorization_code',
            client_id: REST_API_KEY,
            redirect_uri: REDIRECT_URI,
            code: code,
            client_secret: CLIENT_SECRET,
          },
        },
      );

      if (res.status === 200) {
        const { access_token } = res.data;
        getUserInfo(access_token);
      }

      // window.Kakao.init(REST_API_KEY);

      // window.Kakao.Auth.setAccessToken(res.data.access_token);
    } catch (err) {
      console.log(err);
    }
  };

  const getUserInfo = async (access: string) => {
    const API_URL = 'https://kapi.kakao.com/v2/user/me';

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (response.status === 200) {
      const { email } = response.data.kakao_account;

      const sso = await Account.SSO(email);

      if (sso.success) {
        const { data } = sso;
        dispatch(setUser(data));
        props.history.push('/');
      } else {
        props.history.push('/register-terms', { ssoType: 'kakao', data: response.data.kakao_account });
      }

      // localStorage.setItem('kakao', JSON.stringify(response.data));
      // const { kakao_account: { email } } = response.data;

      // const { email } = response.data.response;
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return null;
};

export default KakaoLogin;
