import { Field, Formik } from 'formik';
import { Button } from 'primereact/button';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Checkbox } from 'primereact/checkbox';

import TextInput from '../../components/TextInput';
import AccountService from '../../services/Account';

import './RegisterIndividual';

import FileUploadField from '../../components/FileUploadField';
import { initializeNicePass } from '../../utilities/pass';
import { domainOption, DomainOptionType } from '../../constants/emailDomain';
import IdDuplicateCheckModal from '../../components/Modal/IdDuplicateCheckModal';
import EmailDuplicateCheckModal from '../../components/Modal/EmailDuplicateCheckModal';
import PhoneDuplicateCheckModal from '../../components/Modal/PhoneDuplicateCheckModal';
import AddressModal from '../../components/AddressModal';
import { isMobile, isBrowser } from 'react-device-detect';
import { bankName, BankNameOptionType } from '../../constants/bankName';
import { RegisterCorporateSchema } from '../../schema/register';
import { UPLOAD_FILE_CONFIG } from '../../constants/fileConfig';

const initial = {
  user_id: '',
  password: '',
  confirmPassword: '',
  name: '',
  phone1: '대한민국 +82',
  phone2: '',
  phone3: '인증번호를 입력하세요',
  email: '',
  domain: '',
  company_name: '',
  address: '',
  address_detail: '',
  business_number: '',
  file: '',
  birth: '',
  gender: '',
  accountNum: '',
  bankbook: '',
  idCard: '',
  auth_document: '',
  register_certified: '',
};

export default function RegisterCorporate(props: RouteComponentProps) {
  const [initData, setInitData] = useState<any>(initial);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [encData, setEncData] = useState<string>('');
  const [tokenVersionId, setTokenVersionId] = useState<string>('');
  const [integrityValue, setIntegrityValue] = useState<string>('');
  const [isNicePass, setIsNicePass] = useState<boolean>(false);
  const [ci, setCi] = useState<string>('');

  const [isOpenAddress, setIsOpenAddress] = useState<boolean>(false);
  const [addressValue, setAddress] = useState<string>('');

  const [agreeInfoEmail, setAgreeInfoEmail] = useState<boolean>(false);
  const [agreeInfoSMS, setaAgreeInfoSMS] = useState<boolean>(false);

  const [isIdDuplicated, setIsIdDuplicated] = useState<boolean>(true);
  const [isIdCheckModal, setIsIdCheckModal] = useState<boolean>(false);
  const [isPhoneCheckModal, setIsPhoneCheckModal] = useState<boolean>(false);

  const [isEmailDuplicated, setIsEmailDuplicated] = useState<boolean>(true);
  const [isEmailCheckModal, setIsEmailCheckModal] = useState<boolean>(false);

  const [domainSelected, setDomainSelected] = useState(domainOption[0].value);
  const [bankNameSelected, setBankNameSelected] = useState(bankName[0].value);

  const [idInputValue, setIdInputValue] = useState<boolean>(true);
  const [emailInputValue, setEmailInputValue] = useState<boolean>(true);

  const handleDomainChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsEmailDuplicated(true);
    if (e.target.value === '직접입력') return setDomainSelected(undefined);
    setDomainSelected(e.target.value);
  };

  const handleBankNameChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '은행선택') return setBankNameSelected(undefined);
    setBankNameSelected(e.target.value);
  };

  const onClickIdDuplicateCheck = async (values: any, errors: any) => {
    const { user_id } = values;

    if (!user_id) return alert('아이디를 입력해주세요.');
    if (errors.user_id) return alert('아이디 양식을 확인해주세요.');

    const { data } = await AccountService.idDuplicateCheck(user_id);
    if (data.isDuplicated) setIsIdDuplicated(data.isDuplicated);
    else setIsIdDuplicated(data.isDuplicated);

    setIsIdCheckModal(true);
  };

  const onClickEmailDuplicateCheck = async (values: any, errors: any) => {
    const { email, domain } = values;
    if (!email) return alert('이메일을 입력해주세요.');
    if (!domain && !domainSelected) return alert('이메일을 입력해주세요.');
    if (errors.email || errors.domain) return alert('이메일 양식을 확인해주세요.');

    const { data } = await AccountService.emailDuplicateCheck(`${email}@${domain ? domain : domainSelected}`);

    if (data.isDuplicated) setIsEmailDuplicated(data.isDuplicated);
    else setIsEmailDuplicated(data.isDuplicated);
    setIsEmailCheckModal(true);
  };

  const checkIdInputValue = (e: any) => {
    const value = e.target.value;
    setIsIdDuplicated(true);
    return value.length ? setIdInputValue(false) : setIdInputValue(true);
  };

  const checkEmailInputValue = (e: any) => {
    const value = e.target.value;
    setIsEmailDuplicated(true);
    return value.length ? setEmailInputValue(false) : setEmailInputValue(true);
  };

  const checkUnfilledForm = () => {
    const inputElement = document.querySelectorAll('.check-form');
    Array.from(inputElement).forEach((el: any) => {
      if (!el.value) el.classList.add('form-error');
      else el.classList.remove('form-error');
    });

    const fileElement = document.querySelector('.p-fileupload-filename');
    if (!fileElement) document.querySelector('.p-fileupload-content')!.classList.add('form-error');

    const isInputValueChecked = Array.from(inputElement).filter((el) => el.classList.contains('form-error'));

    const addressDiv = document.querySelector('.form-data');
    if (!addressValue) addressDiv?.classList.add('form-error');
    else addressDiv?.classList.remove('form-error');

    if (isInputValueChecked.length === 0 && addressValue) {
      setErrorMessage('');
      return true;
    }

    setErrorMessage('정보 미기재 시 회원가입이 불가능 합니다.');
    return false;
  };

  const submitHandler = async (values: any, errors: any) => {
    if (!checkUnfilledForm()) return;
    if (Object.keys(errors).length > 0) return alert('양식을 확인해주세요');
    if (isIdDuplicated) alert('아이디 중복 확인을 완료해주세요.');
    if (isEmailDuplicated) alert('이메일 중복 확인을 완료해주세요.');
    if (!isNicePass) return alert('본인인증을 완료해주세요.');

    const { email, domain, birth, gender, ...rest } = values;
    const tempBirth = String(birth).split('');
    tempBirth.splice(4, 0, '-');
    tempBirth.splice(7, 0, '-');
    const isoDate = new Date(tempBirth.join('')).toISOString().split('T')[0];

    const year = isoDate.split('-')[0];
    const month = isoDate.split('-')[1];
    const day = isoDate.split('-')[2];

    try {
      const data = await AccountService.corporateRegister({
        ...rest,
        email: `${email}@${domain ? domain : domainSelected}`,
        address: addressValue,
        sms_send_agree: agreeInfoSMS,
        email_send_agree: agreeInfoEmail,
        type: 'business',
        ci,
        gender,
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
        bankName: bankNameSelected,
      });
      if (data.success) {
        props.history.push('/register-success');
      } else {
        setErrorMessage(data.message);
        alert(`회원가입 실패: ${data.message}`);
      }
    } catch (err) {
      console.log(err);
      alert(`회원가입 실패: ${err}`);
    }
  };

  const initializePass = async () => {
    const returlUrl = window.location.origin + '/nice';
    const { enc_data, token_version_id, integrity_value } = await initializeNicePass(returlUrl);

    setEncData(enc_data);
    setTokenVersionId(token_version_id);
    setIntegrityValue(integrity_value);
  };

  const onClickOpenPass = (values: any) => {
    const form = document.getElementsByName('nice_form')[0] as HTMLFormElement;

    window.open('', 'nice', 'width=475, height=750, toolbar=no, menubar=no, scrollbars=no, resizable=no');
    form.target = 'nice';
    form.submit();

    window.addEventListener('storage', async () => {
      try {
        const niceData = localStorage.getItem('nicePass');
        if (niceData) {
          const passData = JSON.parse(niceData);

          const checkDuplicateUser = await AccountService.phoneDuplicateCheck(passData.mobileno);

          if (checkDuplicateUser.data.isDuplicated) {
            localStorage.removeItem('nicePass');
            return setIsPhoneCheckModal(true);
          }

          setCi(passData.ci);
          setInitData(() => {
            return {
              ...values,
              name: passData.name,
              birth: +passData.birthdate,
              gender: passData.gender === '1' ? '남자' : '여자',
              phone1: '대한민국 +82',
              phone2: passData.mobileno,
            };
          });
          setIsNicePass(true);
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  useEffect(() => {
    initializePass();

    return () => {
      localStorage.removeItem('nicePass');
      localStorage.removeItem('nice_tmp_data');
    };
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="register-info-wrapper">
      <div className="common-header">
        <h1>
          법인회원가입
          {isBrowser && <span className="second-title">손쉬운 부동산의 시작, 지금 시작해 보세요</span>}
        </h1>
      </div>
      {isMobile && (
        <span className="second-title">
          손쉬운 부동산의 시작,
          <br />
          지금 시작해 보세요
        </span>
      )}
      <div className="register-info-content">
        <p className="register-info-cmt">*법인 고객 가입은 대표자 명의로만 가입이 가능합니다.</p>
        <Formik
          initialValues={initData}
          onSubmit={submitHandler}
          validationSchema={RegisterCorporateSchema}
          enableReinitialize={true}
        >
          {({ values, errors }) => (
            <div className="form-group">
              <ul className="form-group__list">
                <li>
                  <label className="label">아이디</label>
                  <div className="content identity">
                    <Field
                      className={!errors.user_id ? 'form-control check-form' : 'form-control form-error'}
                      type="text"
                      name="user_id"
                      component={TextInput}
                      placeholder="영문, 숫자 조합 6자리 이상"
                      onChange={checkIdInputValue}
                    />
                    <Button
                      type="button"
                      label="중복 확인"
                      onClick={() => onClickIdDuplicateCheck(values, errors)}
                      disabled={!isIdDuplicated && !idInputValue}
                    />
                  </div>
                </li>
                {isIdCheckModal && (
                  <IdDuplicateCheckModal isIdDuplicated={isIdDuplicated} setCloseModal={setIsIdCheckModal} />
                )}

                <>
                  <li>
                    <label className="label">비밀번호</label>
                    <div className="content">
                      <Field
                        className={!errors.password ? 'form-control check-form' : 'form-control form-error'}
                        type="password"
                        name="password"
                        placeholder="영문, 숫자, 특수기호 포함 8자리 이상"
                        component={TextInput}
                      />
                    </div>
                  </li>
                  <li className="type2">
                    <label className="label">비밀번호 확인</label>
                    <div className="content">
                      <Field
                        className={!errors.confirmPassword ? 'form-control check-form' : 'form-control form-error'}
                        type="password"
                        name="confirmPassword"
                        placeholder="비밀번호 재입력"
                        component={TextInput}
                      />
                    </div>
                  </li>
                </>
                <li>
                  <label className="label">법인명</label>
                  <div className="content">
                    <Field className="form-control check-form" type="text" component={TextInput} name="company_name" />
                  </div>
                </li>

                <li className="type2 row-group">
                  <label className="label">
                    본점 소재지
                    <small>(사업자등록증)</small>
                  </label>
                  <div className="content addr">
                    <div className="content__row">
                      {!addressValue ? (
                        <div className="form-data form-data--placeholder">우편번호 찾기 자동입력</div>
                      ) : (
                        <div className="form-data">{addressValue}</div>
                      )}
                    </div>
                    <div className="content__row">
                      <Field
                        className={!errors.address_detail ? 'form-control check-form' : 'form-control form-error'}
                        type="text"
                        name="address_detail"
                        placeholder="상세주소 입력"
                        component={TextInput}
                      />
                    </div>
                    <div className="cmt">사업 관련 증서 등이 우편으로 발송 될 수 있으니 정확히 입력해주세요.​</div>
                    <Button
                      type="button"
                      className="font-regular"
                      label="우편번호 찾기"
                      onClick={() => setIsOpenAddress((value) => !value)}
                    />
                  </div>
                </li>
                {isOpenAddress && <AddressModal setState={setAddress} closeModal={() => setIsOpenAddress(false)} />}

                <li className="type2">
                  <label className="label">사업자 등록 번호</label>
                  <div className="content">
                    <Field
                      className="form-control check-form"
                      type="text"
                      name="business_number"
                      component={TextInput}
                    />
                  </div>
                </li>

                <li className="type2">
                  <label className="label">사업자 등록증</label>
                  <div className="content">
                    <Field
                      name="file"
                      type="file"
                      component={FileUploadField}
                      value={values.file}
                      uploadConfig={UPLOAD_FILE_CONFIG}
                      chooseLabel="첨부"
                    />
                  </div>
                </li>

                <li className="type2">
                  <label className="label">대표자 이름</label>
                  <div className="content">
                    <Field
                      className="form-control check-form"
                      type="text"
                      name="name"
                      placeholder="휴대폰 인증 시 자동으로 입력됩니다."
                      component={TextInput}
                      disabled={true}
                    />
                  </div>
                </li>

                <li className="type2">
                  <label className="label">대표자 휴대폰</label>
                  <div className="content">
                    <div className="phone2-group">
                      {/* <select>
                        <option>대한민국(+82)</option>
                      </select> */}
                      <Field
                        className="form-control check-form"
                        type="text"
                        name="phone2"
                        placeholder="휴대폰 인증 시 자동으로 입력됩니다."
                        component={TextInput}
                        disabled={true}
                      />
                      {isBrowser && <span>' - ' 제외 입력</span>}
                      <form action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb" name="nice_form">
                        <input type="hidden" id="m" name="m" value="service" />
                        <input type="hidden" id="token_version_id" name="token_version_id" value={tokenVersionId} />
                        <input type="hidden" id="enc_data" name="enc_data" value={encData} />
                        <input type="hidden" id="integrity_value" name="integrity_value" value={integrityValue} />
                        <Button
                          type="button"
                          className="font-regular"
                          label={isNicePass ? '인증 완료' : '휴대폰 인증'}
                          onClick={() => onClickOpenPass(values)}
                          disabled={isNicePass}
                        />
                      </form>
                      {/* 휴대폰 명의 중복 확인 다이얼로그 */}
                      {isPhoneCheckModal && (
                        <PhoneDuplicateCheckModal
                          setCloseModal={setIsPhoneCheckModal}
                          location={props.location.pathname}
                        />
                      )}
                    </div>
                  </div>
                </li>

                <li className="row-group">
                  <label className="label">
                    대표자 이메일
                    <small>(세금계산서 수신용)</small>
                  </label>
                  <div className="content">
                    <div className="content__row email">
                      <Field
                        className={!errors.email ? 'form-control check-form' : 'form-control form-error'}
                        type="text"
                        name="email"
                        component={TextInput}
                        onChange={checkEmailInputValue}
                      />
                      <span>@</span>

                      <Field
                        className={!errors.domain ? 'form-control check-form' : 'form-control form-error'}
                        type="text"
                        name="domain"
                        component={TextInput}
                        value={domainSelected}
                        onChange={checkEmailInputValue}
                      />
                      <select onChange={handleDomainChanged} value={domainSelected}>
                        {domainOption.map((item: DomainOptionType) => (
                          <option value={item.value} key={item.id}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        label="중복 확인"
                        onClick={() => onClickEmailDuplicateCheck(values, errors)}
                        disabled={!isEmailDuplicated && !emailInputValue && domainSelected !== ''}
                      />
                    </div>
                    {isEmailCheckModal && (
                      <EmailDuplicateCheckModal
                        isEmailDuplicated={isEmailDuplicated}
                        setCloseModal={setIsEmailCheckModal}
                      />
                    )}
                    <div className="cmt">사업 진행 안내 메일이 발송되니, 정확한 이메일 주소를 입력해주세요.​</div>
                  </div>
                </li>
                <li className="row-group bank-info">
                  <label className="label">
                    *계좌정보
                    <small>&nbsp;&nbsp;&nbsp;(법인명의)</small>
                  </label>
                  <div className="content">
                    <div className="content__row bank">
                      <select onChange={handleBankNameChanged}>
                        {bankName.map((item: BankNameOptionType) => (
                          <option value={item.value} key={item.id}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                      <Field
                        className="form-control"
                        type="text"
                        name="bank"
                        component={TextInput}
                        placeholder="계좌번호 입력( - 제외 )"
                      />
                    </div>
                    <div className="cmt">프로젝트 참여 시 법인 명의 계좌 확인을 위해 정확히 입력해 주세요.​</div>
                  </div>
                </li>
                <li>
                  <label className="label">
                    *통장사본
                    <small>&nbsp;&nbsp;&nbsp;(법인명의)</small>
                  </label>
                  <div className="content">
                    <Field
                      name="file"
                      type="file"
                      component={FileUploadField}
                      value={values.file}
                      uploadConfig={UPLOAD_FILE_CONFIG}
                      chooseLabel="첨부"
                    />
                  </div>
                </li>
                <li className="row-group">
                  <label className="label">
                    *신분증사본
                    <small>&nbsp;&nbsp;&nbsp;(대표자명의)</small>
                  </label>
                  <div className="content">
                    <div className="content__row">
                      <Field
                        name="file"
                        type="file"
                        component={FileUploadField}
                        value={values.file}
                        uploadConfig={UPLOAD_FILE_CONFIG}
                        chooseLabel="첨부"
                      />
                    </div>
                  </div>
                </li>
                <li className="row-group">
                  <label className="label">*인감증명서</label>
                  <div className="content">
                    <div className="content__row">
                      <Field
                        name="auth_document"
                        type="file"
                        component={FileUploadField}
                        value={values.auth_document}
                        uploadConfig={UPLOAD_FILE_CONFIG}
                        chooseLabel="첨부"
                      />
                    </div>
                  </div>
                </li>
                <li className="row-group">
                  <label className="label">*등기부등본</label>
                  <div className="content">
                    <div className="content__row">
                      <Field
                        name="register_certified"
                        type="file"
                        component={FileUploadField}
                        value={values.register_certified}
                        uploadConfig={UPLOAD_FILE_CONFIG}
                        chooseLabel="첨부"
                      />
                    </div>
                  </div>
                  <div className="cmt cmt--mark">
                    *계좌정보 및 통장, 신분증 사본 및 등기부 등본은 회원가입 선택사항이오나, 프로젝트 참여 필수사항으로
                    참여 시 추후 제공하셔야 합니다.
                  </div>
                </li>
              </ul>
              {isBrowser && (
                <p className="register-info-cmt">
                  법인고객 가입은 증빙서류 확인 후 가입절차가 진행되며,
                  <br /> 검토 후 가입여부 확인 이메일이 전송됩니다.
                </p>
              )}
              <div className="promotion-agree">
                <div className="promotion-agree__title">
                  프로모션 정보 수신 동의 <span className="text-blue">(선택)</span>
                </div>
                <div className="input-check">
                  <label htmlFor="email" className="p-checkbox-label">
                    Email
                  </label>
                  <Checkbox
                    inputId="email"
                    checked={agreeInfoEmail}
                    value={agreeInfoEmail}
                    onChange={() => setAgreeInfoEmail(!agreeInfoEmail)}
                  />
                </div>
                <div className="input-check">
                  <label htmlFor="cb1" className="p-checkbox-label">
                    SMS
                  </label>
                  <Checkbox
                    inputId="cb1"
                    checked={agreeInfoSMS}
                    value={agreeInfoSMS}
                    onChange={() => setaAgreeInfoSMS(!agreeInfoSMS)}
                  />
                </div>
              </div>
              {isMobile && (
                <p className="register-info-cmt">
                  법인고객 가입은 증빙서류 확인 후<br />
                  가입절차가 진행되며,
                  <br />
                  검토 후 가입여부 확인 이메일이 전송됩니다.
                </p>
              )}

              <div className="submit-wrapper">
                {errorMessage && <div className="text-error">{errorMessage}</div>}
                <Button
                  onClick={() => submitHandler(values, errors)}
                  type="button"
                  className="font-medium"
                  label="회원가입"
                />
              </div>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
}
