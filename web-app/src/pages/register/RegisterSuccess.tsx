import { Button } from 'primereact/button';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import './RegisterSuccess.scss';
import RegisterSuccessIcon from '../../statics/images/v3/icon/check.svg';

export default function RegisterSuccess(props: RouteComponentProps) {
  const handleHomeClick = () => {
    props.history.push('/');
  };

  const handleLoginClick = () => {
    props.history.push('/login');
  };

  return (
    <div className="register-success-wrapper">
      <div className="register-success-content">
        <div className="success-icon">
          <img width={100} src={RegisterSuccessIcon} alt="" />
        </div>
        <h1 className="font-black">회원가입 완료</h1>
        <div className="content">
          로그인 후 편리하고 안전하게 {isMobile && <br />}서비스를 이용해보세요.
          <br />
          {isMobile && <br />}
          회원정보 확인 및 수정은 {isMobile && <br />}
          <mark>마이페이지 / 회원정보</mark> 에서 가능합니다.
        </div>
        <div className="submit-wrapper">
          <Button className="font-medium btn-1" label="메인으로" onClick={handleHomeClick} />
          <Button className="font-medium btn-2" label="로그인" onClick={handleLoginClick} />
        </div>
      </div>
    </div>
  );
}
