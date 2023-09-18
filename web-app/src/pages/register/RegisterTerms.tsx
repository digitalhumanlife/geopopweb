import classnames from 'classnames';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { isMobile, isBrowser } from 'react-device-detect';

import Doc1 from '../../statics/docs/doc1.txt';
import Doc2 from '../../statics/docs/doc2.txt';
import Doc3 from '../../statics/docs/doc3.txt';
import './RegisterTerms.scss';

export default function RegisterTerms(props: RouteComponentProps) {
  const [curType, setType] = useState<string>('normal'); // tobe naver, kakao, normal
  const [ssoData, setSsoData] = useState<any>({});
  const [isAcceptTerm, setAcceptTerm] = useState<boolean>(false);
  const [isAcceptBuyer, setAcceptBuyer] = useState<boolean>(false);
  const [isAcceptPrivacy, setAcceptPrivacy] = useState<boolean>(false);
  const [isAcceptPromotional, setAcceptPromotional] = useState<boolean>(false);
  const [isFullConsent, setFullConsent] = useState<boolean>(false);
  const [cb1Error, setCb1Error] = useState<boolean>(false);
  const [cb2Error, setCb2Error] = useState<boolean>(false);
  const [cb3Error, setCb3Error] = useState<boolean>(false);
  const [doc1, setDoc1] = useState<string>('');
  const [doc2, setDoc2] = useState<string>('');
  const [doc3, setDoc3] = useState<string>('');
  const [agreeError, setAgreeError] = useState<string>('');

  const handleFullConsentChange = (e: { checked: boolean }) => {
    if (e.checked) {
      setAcceptTerm(true);
      setAcceptBuyer(true);
      setAcceptPrivacy(true);
      setAcceptPromotional(true);
      setCb1Error(false);
      setCb2Error(false);
      setCb3Error(false);
    }
    if (!e.checked) {
      setAcceptTerm(false);
      setAcceptBuyer(false);
      setAcceptPrivacy(false);
      setAcceptPromotional(false);
      setCb1Error(true);
      setCb2Error(true);
      setCb3Error(true);
    }

    setFullConsent(e.checked);
  };

  const handleSubmitClick = ({ type }: { type?: string }) => {
    setCb1Error(false);
    setCb2Error(false);
    setCb3Error(false);

    if (!isAcceptPrivacy) {
      document.querySelector('.cb3')?.scrollIntoView({ behavior: 'smooth' });
      setCb3Error(true);
      setAgreeError('본 약관은 필수 동의 사항입니다.');
    }

    if (!isAcceptBuyer) {
      document.querySelector('.cb2')?.scrollIntoView({ behavior: 'smooth' });
      setCb2Error(true);
      setAgreeError('본 약관은 필수 동의 사항입니다.');
    }

    if (!isAcceptTerm) {
      setCb1Error(true);
      document.querySelector('.cb1')?.scrollIntoView({ behavior: 'smooth' });
      setAgreeError('본 약관은 필수 동의 사항입니다.');
    }

    if (isAcceptTerm && isAcceptBuyer && isAcceptPrivacy) {
      // if (type === 'normal') {
      //   props.history.push('/register-information');
      // } else {
      //   props.history.push('/register-information', { ssoType: type, data: ssoData });
      // }
      if (type === 'normal') {
        props.history.push('/register-individual');
      } else if (type === 'corporate') {
        if (curType === 'kakao') {
          props.history.push('/register-corporate', { ssoType: curType, data: ssoData });
        } else {
          props.history.push('/register-corporate');
        }
      } else {
        props.history.push('/register-individual', { ssoType: type, data: ssoData });
      }
    }
  };

  useEffect(() => {
    fetch(Doc1)
      .then((r) => r.text())
      .then((text) => {
        setDoc1(text);
      });
    fetch(Doc2)
      .then((r) => r.text())
      .then((text) => {
        setDoc2(text);
      });
    fetch(Doc3)
      .then((r) => r.text())
      .then((text) => {
        setDoc3(text);
      });
  }, []);

  useEffect(() => {
    if ((props.location.state as any)?.ssoType) {
      setType((props.location.state as any).ssoType);
      setSsoData((props.location.state as any).data);
    }
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="register-term-wrapper">
      <div className="common-header">
        <h1>
          회원가입
          {isBrowser && <span className="second-title">손쉬운 부동산의 시작, 지금 시작해 보세요</span>}{' '}
        </h1>
      </div>
      {isMobile && (
        <span className="second-title">
          손쉬운 부동산의 시작,
          <br />
          지금 시작해 보세요
        </span>
      )}
      <div className="register-term-content">
        <div className="input-check full-conset-cb-wrapper">
          <Checkbox className="cb5" inputId="cb5" onChange={handleFullConsentChange} checked={isFullConsent} />
          <label htmlFor="cb5" className="p-checkbox-label font-bold">
            전체동의
          </label>
        </div>
        <div className="input-check term-cb-wrapper">
          <Checkbox
            className={classnames('cb1', { 'checkbox-error': cb1Error })}
            inputId="cb1"
            onChange={(e: { checked: boolean }) => {
              setAcceptTerm(e.checked);
              setCb1Error(false);
              setFullConsent(false);
            }}
            checked={isAcceptTerm}
          />
          <label htmlFor="cb1" className="p-checkbox-label font-bold">
            사이트이용약관에 동의하시겠습니까? <span className="text-blue">(필수)</span>
            {cb1Error === true && (
              <div className="d-none d-sm-inline">
                <span className="agree-error text-error">{agreeError}</span>
              </div>
            )}
            {cb1Error === true && (
              <div className="d-block d-sm-none">
                <div className="agree-error text-error">{agreeError}</div>
              </div>
            )}
          </label>
        </div>
        <div className="term-content">
          <div className="docs">{doc1}</div>
        </div>
        <div className="input-check buyer-cb-wrapper">
          <Checkbox
            className={classnames('cb2', { 'checkbox-error': cb2Error })}
            inputId="cb2"
            onChange={(e: { checked: boolean }) => {
              setAcceptBuyer(e.checked);
              setCb2Error(false);
              setFullConsent(false);
            }}
            checked={isAcceptBuyer}
          />
          <label htmlFor="cb2" className="p-checkbox-label font-bold">
            프로젝트참여약관에 동의하시겠습니까? <span className="text-blue">(필수)</span>
            {cb2Error === true && (
              <div className="d-none d-sm-inline">
                <span className="agree-error text-error">{agreeError}</span>
              </div>
            )}
            {cb2Error === true && (
              <div className="d-block d-sm-none">
                <div className="agree-error text-error">{agreeError}</div>
              </div>
            )}
          </label>
        </div>
        <div className="term-content">
          <div className="docs">{doc2}</div>
        </div>
        <div className="input-check privacy-cb-wrapper">
          <Checkbox
            className={classnames('cb3', { 'checkbox-error': cb3Error })}
            inputId="cb3"
            onChange={(e: { checked: boolean }) => {
              setAcceptPrivacy(e.checked);
              setCb3Error(false);
              setFullConsent(false);
            }}
            checked={isAcceptPrivacy}
          />
          <label htmlFor="cb3" className="p-checkbox-label font-bold">
            개인정보처리방침에 동의하시겠습니까? <span className="text-blue">(필수)</span>
            {cb3Error === true && (
              <div className="d-none d-sm-inline">
                <span className="agree-error text-error">{agreeError}</span>
              </div>
            )}
            {cb3Error === true && (
              <div className="d-block d-sm-none">
                <div className="agree-error text-error">{agreeError}</div>
              </div>
            )}
          </label>
        </div>
        <div className="term-content">
          <div className="docs">{doc3}</div>
        </div>
        <div className="input-check input-check--promotion">
          <Checkbox
            className="cb4"
            inputId="cb4"
            onChange={(e: { checked: boolean }) => {
              setAcceptPromotional(e.checked);
              setFullConsent(false);
            }}
            checked={isAcceptPromotional}
          />
          <label htmlFor="cb4" className="p-checkbox-label font-bold">
            프로모션(새로운 프로젝트 알림 및 각종 정보) 정보 수신에 동의 하시겠습니까?{' '}
            <span className="text-blue">(선택)</span>
          </label>
        </div>

        <div className="submit-wrapper">
          {(cb1Error || cb2Error || cb3Error) && (
            <div className="agree-error">
              회원가입을 위해 {isMobile && <br />}모든 필수 약관에 대한 동의가 필요합니다.
            </div>
          )}
          <p className="cmt">
            본인은 만 19세 이상이며 본인 명의로 {isMobile && <br />}서비스 가입 및 이용에 동의합니다.​
          </p>
          <Button className="personal" label="개인회원 가입" onClick={() => handleSubmitClick({ type: curType })} />
          <Button
            className="corporate"
            label="법인회원 가입"
            onClick={() => handleSubmitClick({ type: 'corporate' })}
          />
        </div>
      </div>
    </div>
  );
}
