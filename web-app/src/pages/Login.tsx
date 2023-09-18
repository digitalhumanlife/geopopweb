import qs from 'query-string';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Button } from 'primereact/button';
import { RouteComponentProps } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Checkbox } from 'primereact/checkbox';

import TextInput from '../components/TextInput';
import AccountService from '../services/Account';
import { setUser } from '../store/user/actions';
import IDPasswordRecovery from '../components/IDPasswordRecovery';

import './Login.scss';

import KakaoIcon from '../statics/images/v3/icon/kakao.svg';

import { decrypt } from '../utilities/pass';
import { LoginSchema } from '../schema/login';

function Login(props: RouteComponentProps) {
  const query = qs.parse(props.location.search);
  const [isRememberMe, setRememberMe] = useState<boolean>(false);
  const [isShowRecovery, setShowRecovery] = useState<boolean>(false);
  const [recoveryType, setRecoveryType] = useState<string>('id');
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();

  const showIdRecovery = () => {
    document.getElementsByTagName('body')[0].classList.add('dialog-show');
    setRecoveryType('id');
    setShowRecovery(true);
  };

  const showPasswordRecovery = () => {
    document.getElementsByTagName('body')[0].classList.add('dialog-show');
    setRecoveryType('password');
    setShowRecovery(true);
  };

  const handleIDPasswordRecoveryHide = () => {
    setShowRecovery(false);
    document.getElementsByTagName('body')[0].classList.remove('dialog-show');
  };

  const submitHandler = async (values: any, { setSubmitting }: any) => {
    try {
      const data = await AccountService.login({
        ...values,
      });
      if (data.success) {
        setSubmitting(false);
        if (isRememberMe) dispatch(setUser(data.data, isRememberMe));
        else dispatch(setUser(data.data, isRememberMe));
      } else {
        setSubmitting(false);
        setErrorMsg('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error: any) {
      setSubmitting(false);
      if (error.response.data === 'Bad credentials') {
        setErrorMsg('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setErrorMsg(error.response.data);
      }
    }
  };

  const onClickKakaoLogin = () => {
    const REST_API_KEY = process.env.REACT_APP_KAKAO_API_KEY;
    const REDIRECT_URI = process.env.REACT_APP_KAKAO_LOGIN_REDIRECT_URI;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    window.location.href = KAKAO_AUTH_URL;
  };

  useEffect(() => {
    window.addEventListener('storage', () => {
      const niceData = localStorage.getItem('nicePass');

      if (niceData) {
        setRecoveryType('password');

        setShowRecovery(true);
        setRecoveryType('password');
      }
    });

    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, []);

  useEffect(() => {
    const { enc_data, token_version_id, integrity_value } = query;

    if (enc_data && token_version_id && integrity_value) {
      try {
        setRecoveryType('password');
        decrypt({
          enc_data: `${enc_data}`,
          token_version_id: `${token_version_id}`,
          integrity_value: `${integrity_value}`,
        });

        setShowRecovery(true);
        setRecoveryType('password');
      } catch (err) {
        console.log(err);
        window.location.href = '/login';
      }
      return;
    }
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="login-container">
      <h1 className="text-center">로그인</h1>
      <div>
        <Formik initialValues={{ email: '', password: '' }} onSubmit={submitHandler} validationSchema={LoginSchema}>
          {({ isSubmitting }) => (
            <Form className="form-group">
              <div className="input-text">
                <label htmlFor="loginID">아이디</label>
                <Field className="form-control" id="loginID" type="text" name="email" component={TextInput} />
              </div>
              <div className="input-text">
                <label htmlFor="loginPW">비밀번호</label>
                <Field className="form-control" id="loginPW" type="password" name="password" component={TextInput} />
              </div>

              {errorMsg && <div className="text-error">{errorMsg}</div>}
              <div>
                <div className="remember-me-group">
                  <Checkbox inputId="cb1" checked={isRememberMe} onChange={() => setRememberMe(!isRememberMe)} />
                  <label htmlFor="cb1" className="p-checkbox-label">
                    자동 로그인
                  </label>
                </div>
                <div className="login-btns">
                  {isSubmitting && <i className="pi pi-spin pi-spinner" />}
                  <Button type="submit" disabled={isSubmitting} label="로그인" className="signin-btn" />
                </div>
                <div className="text-field">
                  <span>또는</span>
                </div>
                <div className="social-buttons">
                  <button type="button" onClick={onClickKakaoLogin} className="signin-social signin-kakao">
                    <img src={KakaoIcon} alt="" />
                    <span>카카오톡 로그인</span>
                  </button>
                </div>
                <div className="forgot-password-row">
                  <div>
                    <span onClick={showIdRecovery}>아이디 찾기</span>
                    <span> | </span>
                    <span onClick={showPasswordRecovery}>비밀번호 찾기</span>
                    <span> | </span>
                    <span
                      onClick={() => {
                        window.location.href = '/register-terms';
                      }}
                    >
                      회원가입
                    </span>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <IDPasswordRecovery
        visible={isShowRecovery}
        type={recoveryType}
        onHide={handleIDPasswordRecoveryHide}
        {...props}
      />
    </div>
  );
}

export default Login;
