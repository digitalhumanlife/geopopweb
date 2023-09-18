import { RouteComponentProps } from 'react-router-dom';
import classnames from 'classnames';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import React, { useEffect, useState } from 'react';
import AccountService from '../services/Account';
import { initializeNicePass } from '../utilities/pass';
import Eye from '../statics/images/gc/eye.svg';
import EyeHide from '../statics/images/gc/eye_hide.svg';
import './IDPasswordRecovery.scss';

interface Props extends RouteComponentProps {
  visible: boolean;
  type: string;
  onHide: () => void;
}

export default function IDPasswordRecovery(props: Props) {
  const [recoveryType, setRecoveryType] = useState<string>(props.type);
  const [type, setType] = useState<string>('email');
  const [step, setStep] = useState<string>('1');
  const [idRecoveryValue, setIdRecoveryValue] = useState<string>('');
  const [idRecoveryResult, setIdRecoveryResult] = useState<string>('');
  const [encData, setEncData] = useState<string>('');
  const [tokenVersionId, setTokenVersionId] = useState<string>('');
  const [integrityValue, setIntegrityValue] = useState<string>('');
  const [hasAccountForPassword, setHasAccountForPassword] = useState<boolean>(false);

  const [isNicePass, setIsNicePass] = useState<boolean>(false);
  const [passwordID, setPasswordID] = useState<string>('');
  const [myCi, setMyCi] = useState<string>('');

  const [newPassword, setNewPassword] = useState<string>('');
  const [newConfirmPassword, setNewConfirmPassword] = useState<string>('');

  const [isPassword, setIsPassword] = useState<boolean>(true);
  const [isConfirmPassword, setIsConfirmPassword] = useState<boolean>(true);

  const initializePass = async () => {
    const returlUrl = window.location.origin + '/nice';
    const { enc_data, token_version_id, integrity_value } = await initializeNicePass(returlUrl);

    setEncData(enc_data);
    setTokenVersionId(token_version_id);
    setIntegrityValue(integrity_value);

    window.addEventListener('storage', () => {
      const niceData = localStorage.getItem('nicePass');

      if (niceData) {
        setRecoveryType('password');
        const { ci } = JSON.parse(niceData);
        setMyCi(ci);
        setIsNicePass(true);
      }
    });
  };

  const onHideWrapper = () => {
    window.location.href = '/login';
    props.onHide();
    setStep('1');
    setIdRecoveryValue('');
    setIdRecoveryResult('');
    setHasAccountForPassword(false);
  };

  const handleSubmitId = async () => {
    const res = await AccountService.findId(type, idRecoveryValue);

    if (res.success) {
      setIdRecoveryResult(res.data.id);
      setStep('2');
    }

    if (!res.success) {
      setIdRecoveryResult('없는 아이디입니다.');
      setStep('2');
    }
  };

  const onClickOpenPass = () => {
    const form = document.getElementsByName('nice_form')[0] as HTMLFormElement;

    window.open('', 'nice', 'width=475, height=750, toolbar=no, menubar=no, scrollbars=no, resizable=no');
    form.target = 'nice';
    form.submit();
  };

  const checkCiAndId = async () => {
    const res = await AccountService.checkCiId(myCi, passwordID);
    if (res.success) setHasAccountForPassword(false);
    else setHasAccountForPassword(true);
    setStep('2');
  };

  const findPassword = async () => {
    if (newPassword !== newConfirmPassword) return alert('비밀번호가 일치하지 않습니다.');
    const passwordRegex = /^((?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*[0-9]))[a-zA-Z0-9!@#$%^&*()\-_=+{};:,<.>]{6,}$/;
    if (!passwordRegex.test(newPassword)) return alert('비밀번호 양식을 확인해주세요');

    const res = await AccountService.findPw(myCi, newPassword, passwordID);
    if (res.data && res.success) setStep('3');
    else return;
  };

  useEffect(() => {
    setRecoveryType(props.type);
    setStep('1');
  }, [props.type]);

  useEffect(() => {
    initializePass();

    return () => {
      localStorage.removeItem('nicePass');
      window.removeEventListener('storage', () => {});
    };
  }, []);

  return (
    <Dialog
      visible={props.visible}
      style={{ width: '500px' }}
      modal={true}
      showHeader={false}
      appendTo={document.body}
      onHide={onHideWrapper}
      className="id-recovery-dialog"
    >
      <div className="id-recovery-header">
        <div className="header-content">
          <div
            onClick={() => {
              setStep('1');
              setRecoveryType('id');
            }}
            className={classnames('font-bold', { active: recoveryType === 'id' })}
          >
            아이디 찾기
          </div>
          <div
            onClick={() => {
              setStep('1');
              setRecoveryType('password');
            }}
            className={classnames('font-bold', { active: recoveryType === 'password' })}
          >
            비밀번호 찾기
          </div>
        </div>
        <div className="p-dialog-titlebar-icons">
          <button
            type="button"
            className="p-dialog-titlebar-icon p-dialog-titlebar-close p-link"
            aria-label="Close"
            onClick={onHideWrapper}
          >
            <span className="p-dialog-titlebar-close-icon pi pi-times"></span>
          </button>
        </div>
      </div>
      <hr />
      {recoveryType === 'id' && step === '1' && (
        <>
          <div className="recovery-text">아이디를 찾을 방법을 선택해 주세요</div>
          <div className="checkbox-group">
            <RadioButton
              inputId="rd1"
              value="email"
              name="id"
              onChange={(e) => {
                setIdRecoveryValue('');
                setType(e.value);
              }}
              checked={type === 'email'}
            />
            <label htmlFor="rd1">이메일로 찾기</label>
          </div>
          <InputText
            placeholder="이메일 입력"
            value={type === 'email' ? idRecoveryValue : ''}
            onChange={(e) => (type === 'email' ? setIdRecoveryValue(e.currentTarget.value) : null)}
            onFocus={() => {
              setIdRecoveryValue('');
              setType('email');
            }}
          />
          <div className="checkbox-group">
            <RadioButton
              inputId="rd2"
              value="phone"
              name="id"
              onChange={(e) => {
                setIdRecoveryValue('');
                setType(e.value);
              }}
              checked={type === 'phone'}
            />
            <label htmlFor="rd2">휴대폰 번호로 찾기 </label>
          </div>
          <InputText
            placeholder="' - ' 제외 입력"
            value={type === 'phone' ? idRecoveryValue : ''}
            onChange={(e) => (type === 'phone' ? setIdRecoveryValue(e.currentTarget.value) : null)}
            onFocus={() => {
              setIdRecoveryValue('');
              setType('phone');
            }}
          />
          <div className="submit-button">
            <Button className="font-medium" label="아이디 찾기" onClick={handleSubmitId} />
          </div>
        </>
      )}
      {recoveryType === 'id' && step === '2' && (
        <>
          <div className="recovery-result">
            <ul>
              <li>
                <label>아이디</label>
                <div className="recovery-result__id">{idRecoveryResult}</div>
              </li>
            </ul>
          </div>

          <div className="submit-button">
            <Button label="확인" onClick={onHideWrapper} />
          </div>
        </>
      )}
      {recoveryType === 'password' && step === '1' && (
        <>
          <div className="checkbox-group">
            <label htmlFor="pwID">아이디</label>
          </div>
          <InputText
            id="pwID"
            placeholder="비밀번호를 찾을 아이디를 입력해주세요."
            value={passwordID}
            onChange={(e) => setPasswordID(e.currentTarget.value)}
          />
          <form
            action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb"
            name="nice_form"
            className="submit-button submit-button--pw"
          >
            <input type="hidden" id="m" name="m" value="service" />
            <input type="hidden" id="token_version_id" name="token_version_id" value={tokenVersionId} />
            <input type="hidden" id="enc_data" name="enc_data" value={encData} />
            <input type="hidden" id="integrity_value" name="integrity_value" value={integrityValue} />
            <Button
              type="button"
              onClick={isNicePass ? checkCiAndId : onClickOpenPass}
              label={isNicePass ? '비밀번호 재설정' : '휴대폰 인증 후 비밀번호 재설정'}
            />
          </form>
        </>
      )}
      {recoveryType === 'password' && step === '2' && (
        <>
          {hasAccountForPassword ? (
            <div className="recovery-text">유저가 존재하지 않습니다.</div>
          ) : (
            <>
              <div className="recovery-result recovery-result--pw">
                <ul>
                  <li>
                    <label>아이디</label>
                    <div className="recovery-result__id">{passwordID}</div>
                  </li>

                  <li>
                    <label htmlFor="pwInput">새 비밀번호</label>
                    <div className="p-inputgroup">
                      {isPassword ? (
                        <img className="icon eye-icon" src={Eye} onClick={() => setIsPassword(false)} alt="" />
                      ) : (
                        <img className="icon eye-icon" src={EyeHide} onClick={() => setIsPassword(true)} alt="" />
                      )}
                      <InputText
                        id="pwInput"
                        className="w-full"
                        type={isPassword ? 'password' : 'text'}
                        placeholder="영문, 숫자, 특수기호 포함 8자리 이상"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.currentTarget.value)}
                      />
                    </div>
                  </li>
                  <li>
                    <label htmlFor="pwInput">비밀번호 확인</label>
                    <div className="input-box">
                      <div className="p-inputgroup">
                        {isConfirmPassword ? (
                          <img className="icon eye-icon" src={Eye} onClick={() => setIsConfirmPassword(false)} alt="" />
                        ) : (
                          <img
                            className="icon eye-icon"
                            src={EyeHide}
                            onClick={() => setIsConfirmPassword(true)}
                            alt=""
                          />
                        )}
                        <InputText
                          id="pwInput"
                          className="w-full"
                          type={isConfirmPassword ? 'password' : 'text'}
                          placeholder="비밀번호 재입력"
                          value={newConfirmPassword}
                          onChange={(e) => setNewConfirmPassword(e.currentTarget.value)}
                        />
                      </div>

                      {!!newPassword && !!newConfirmPassword && newPassword === newConfirmPassword && (
                        <p className="recovery-alert">비밀번호가 일치합니다.</p>
                      )}
                    </div>
                  </li>
                </ul>
              </div>

              <div className="submit-button">
                <Button label="변경하기" onClick={findPassword} />
              </div>
            </>
          )}
        </>
      )}
      {recoveryType === 'password' && step === '3' && (
        <>
          <p className="recovery-cmt">비밀번호가 변경되었습니다.</p>
          <div className="submit-button">
            <Button label="확인" onClick={onHideWrapper} />
          </div>
        </>
      )}
    </Dialog>
  );
}
