import { Field, Formik } from 'formik';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import React, { useEffect, useState, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Checkbox } from 'primereact/checkbox';

import TextInput from '../../components/TextInput';
import { useUser } from '../../store/hooks/hooks';
import AccountService from '../../services/Account';

import './MyInfo.scss';
import { setUser } from '../../store/user/actions';
import { useDispatch } from 'react-redux';
import { initializeNicePass } from '../../utilities/pass';
import EmailDuplicateCheckModal from '../../components/Modal/EmailDuplicateCheckModal';
import ChangePasswordModal from '../../components/Modal/ChangePasswordModal';
import SecessionModal from '../../components/Modal/SecessionModal';
import { domainOption, DomainOptionType } from '../../constants/emailDomain';
import AddressModal from '../../components/AddressModal';
import FileUploadField from '../../components/FileUploadField';
import { toFile } from '../../utilities/changeFile';
import { isString } from 'lodash';
import PhoneDuplicateCheckModal from '../../components/Modal/PhoneDuplicateCheckModal';
import { isBrowser, isMobile } from 'react-device-detect';
import WithdrawalComplete from '../../components/Modal/WithdrawalComplete';
import { bankName, BankNameOptionType } from '../../constants/bankName';
import { BusinessUserInfoSchema } from '../../schema/userInfo';
import { PROJECT_TAB_OPTIONS } from '../../constants/tab';
import { UPLOAD_FILE_CONFIG } from '../../constants/fileConfig';

const emptyData = {
  user_id: '',
  name: '',
  phone: '',
  email: '',
  domain: '',
  company_name: '',
  address: '',
  address_detail: '',
  business_number: '',
  file: null,
  isSMS: false,
  isEmail: false,
  bank_name: '',
  account_num: '',
  bankbook: '',
  id_card: '',
  auth_document: '',
  register_certified: '',
};

export default function BusinessInfo(props: RouteComponentProps) {
  const dispatch = useDispatch();
  const [tab, setTab] = useState<string>(PROJECT_TAB_OPTIONS[2].value);
  const [userData, setUserData] = useState<any>(emptyData);
  const [isEmailDuplicated, setIsEmailDuplicated] = useState<boolean>(false);
  const [isNice, setIsNicePass] = useState<boolean>(false);
  const [ci, setCi] = useState<string>('');
  const [oldFile, setOldFile] = useState<any>();

  const [encData, setEncData] = useState<string>('');
  const [tokenVersionId, setTokenVersionId] = useState<string>('');
  const [integrityValue, setIntegrityValue] = useState<string>('');

  const [domainSelected, setDomainSelected] = useState(domainOption[0].value);

  const [agreeInfoEmail, setAgreeInfoEmail] = useState<boolean>(false);
  const [agreeInfoSMS, setaAgreeInfoSMS] = useState<boolean>(false);

  const [isPhoneCheckModal, setIsPhoneCheckModal] = useState<boolean>(false);
  const [isEmailCheckModal, setIsEmailCheckModal] = useState<boolean>(false);
  const [isChangePwModal, setIsChangePwModal] = useState<boolean>(false);
  const [isSecessionModal, setIsSecessionModal] = useState<boolean>(false);
  const [isWithdrawalComplete, setIsWithdrawalComplete] = useState<boolean>(false);

  const [isOpenAddress, setIsOpenAddress] = useState<boolean>(false);
  const [addressValue, setAddress] = useState<string>('');

  const [bankNameSelected, setBankNameSelected] = useState<string>('');

  const user = useUser();
  const handleDomainChanged = (e: any) => {
    if (e.target.value === '직접입력') return setDomainSelected(undefined);
    setDomainSelected(e.target.value);
  };

  const handleShowDialog = async (email: string) => {
    setIsEmailCheckModal(true);
    if (email === userData.email) return setIsEmailDuplicated(false);

    const { data } = await AccountService.emailDuplicateCheck(email);

    setIsEmailDuplicated(data.isDuplicated);
  };

  const handleBankNameChange = (e: any) => {
    if (e.target.value === '은행선택') return setBankNameSelected('');
    setBankNameSelected(e.target.value);
  };

  const initializePass = async () => {
    const returlUrl = window.location.origin + '/nice';
    const { enc_data, token_version_id, integrity_value } = await initializeNicePass(returlUrl);

    setEncData(enc_data);
    setTokenVersionId(token_version_id);
    setIntegrityValue(integrity_value);
  };

  const handleTabChange = (e: any) => {
    if (!e.value) return;

    setTab(e.value);
    if (e.value === '나의 프로젝트') props.history.push('/my-page');
    if (e.value === '관심 프로젝트') props.history.push('/bookmarks');
  };

  const submitHandler = async (values: any) => {
    const {
      email,
      domain,
      detailedAddress,
      file,
      bankbook,
      id_card,
      auth_document,
      register_certified,
      ...rest
    } = values;

    const tempDomain = !domainSelected ? domain : domainSelected;

    if (user.email !== `${email}@${tempDomain}`) {
      if (!email || !domain) return alert('이메일 양식을 확인해주세요.');
      if (isEmailDuplicated) return alert('이메일 중복 확인을 해주세요.');
    }
    const token = rest.token;
    delete rest.token;
    delete rest.created_at;
    delete rest.createdAt;

    try {
      const data = await AccountService.updateBusinessUser({
        ...rest,
        email: `${email}@${tempDomain}`,
        sms_send_agree: agreeInfoSMS,
        email_send_agree: agreeInfoEmail,
        address: addressValue,
        detailedAddress: detailedAddress,
        file: file ? file : oldFile.file,
        bank_name: bankNameSelected,
        bankbook: bankbook ? bankbook : oldFile.bankbook,
        id_card: id_card ? id_card : oldFile.id_card,
        auth_document: auth_document ? auth_document : oldFile.auth_document,
        register_certified: register_certified ? register_certified : oldFile.register_certified,
        ci,
      });
      console.log(data.data);
      if (data.success) {
        alert('회원정보가 수정되었습니다.');
        dispatch(
          setUser({
            ...data.data,
            token,
            email: `${email}@${tempDomain}`,
            address: addressValue,
            sms_send_agree: agreeInfoSMS,
            email_send_agree: agreeInfoEmail,
            ci,
            bank_name: bankNameSelected,
          }),
        );
      } else {
        alert('회원정보 수정에 실패했습니다.');
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
      alert(`회원정보 수정에 실패했습니다. ${err}`);
    } finally {
      window.location.reload();
    }
  };

  const onClickOpenPass = () => {
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
          setUserData((val: any) => {
            return {
              ...val,
              name: passData.name,
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

  const getFileBlob = useCallback(async (fileNameArr: any[]) => {
    fileNameArr.forEach(async (name: 'file' | 'bankbook' | 'id_card' | 'auth_document' | 'register_certified') => {
      if (isString(user[name]) && user[name] !== '') {
        const changedFile = await toFile(user[name]);
        setOldFile((val: any) => ({ ...val, [name]: changedFile }));
      } else {
        setOldFile((val: any) => ({ ...val, [name]: '' }));
      }
    });
  }, []);

  useEffect(() => {
    const { email, address, email_send_agree, sms_send_agree, ci, file, bank_name, ...rest } = user;

    const tempEmail = email.split('@');
    setDomainSelected(tempEmail[1]);
    setaAgreeInfoSMS(sms_send_agree);
    setAgreeInfoEmail(email_send_agree);
    setAddress(address);
    setCi(ci);
    setBankNameSelected(bank_name);
    getFileBlob(['file', 'bankbook', 'id_card', 'auth_document', 'register_certified']);
    console.log(oldFile);

    setUserData({
      ...rest,
      email: tempEmail[0],
      domain: tempEmail[1],
      file: oldFile?.file,
      bankbook: oldFile?.bankbook,
      id_card: oldFile?.id_card,
      auth_document: oldFile?.auth_document,
      register_certified: oldFile?.register_certified,
      password: '',
    });
  }, [user]);

  useEffect(() => {
    initializePass();

    return () => {
      localStorage.removeItem('nicePass');
      window.removeEventListener('storage', () => {});
    };
  }, []);
  return (
    <div className="my-info-wrapper">
      <div className="common-header">
        <h1>마이페이지</h1>
      </div>
      <div className="common-tab">
        <SelectButton value={tab} options={PROJECT_TAB_OPTIONS} onChange={handleTabChange}></SelectButton>
      </div>
      <div className="my-info-content">
        <Formik
          initialValues={userData}
          onSubmit={() => submitHandler(userData)}
          validationSchema={BusinessUserInfoSchema}
          enableReinitialize={true}
        >
          {({ values, setFieldValue }) => (
            <div className="form-group">
              <ul className="form-group__list">
                <li>
                  <label className="label">아이디</label>
                  <div className="content">
                    <Field className="form-control" readOnly={true} type="text" name="user_id" component={TextInput} />
                  </div>
                </li>

                <li>
                  <label className="label">비밀번호</label>
                  <div className="content password">
                    {/* 스타일 수정 */}
                    <input className="form-control" type="password" name="password" value={'00000000'} disabled />
                    <Button type="button" label="비밀번호 변경" onClick={() => setIsChangePwModal(true)}></Button>
                  </div>
                </li>
                {isChangePwModal && <ChangePasswordModal setCloseModal={setIsChangePwModal} />}

                <li>
                  <label className="label">법인명</label>
                  <div className="content">
                    <Field className="form-control" type="text" component={TextInput} name="company_name" />
                  </div>
                </li>

                <li className="type2 row-group">
                  <label className="label">
                    본점 소재지
                    <small>(사업자등록증)</small>
                  </label>
                  <div className="content addr">
                    <div className="content__row">
                      <div className="form-data">{addressValue}</div>
                    </div>
                    <div className="content__row">
                      <Field
                        className="form-control"
                        type="text"
                        name="address_detail"
                        placeholder="상세주소 입력"
                        component={TextInput}
                      />
                    </div>
                    <div className="cmt">
                      사업 관련 증서 등이 우편으로{isMobile && <br />} 발송 될 수 있으니 정확히 입력해 주세요.​
                    </div>
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
                  <label className="label">사업자등록번호</label>
                  <div className="content">
                    <Field className="form-control" type="text" name="business_number" component={TextInput} />
                  </div>
                </li>
                {oldFile?.file && (
                  <li>
                    <span className="label">기존 사업자 등록증</span>
                    <div className="content">
                      <a
                        href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${oldFile.file?.name}`}
                        className="content__file"
                      >
                        {oldFile.file?.name}
                      </a>
                    </div>
                  </li>
                )}

                <li className="type2">
                  <label className="label">사업자등록증</label>
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
                    <Field className="form-control" type="text" name="name" disabled={true} component={TextInput} />
                  </div>
                </li>

                <li>
                  <label className="label">대표자 휴대폰</label>
                  <div className="content">
                    <div className="phone2-group">
                      {/* <select>
                        <option>대한민국(+82)</option>
                      </select> */}
                      <Field className="form-control" type="text" name="phone2" component={TextInput} disabled={true} />
                      {isBrowser && <span>' - ' 제외 입력</span>}
                      {isNice ? (
                        <Button type="button" className="font-regular" label="인증 완료" disabled={true} />
                      ) : (
                        <form action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb" name="nice_form">
                          <input type="hidden" id="m" name="m" value="service" />
                          <input type="hidden" id="token_version_id" name="token_version_id" value={tokenVersionId} />
                          <input type="hidden" id="enc_data" name="enc_data" value={encData} />
                          <input type="hidden" id="integrity_value" name="integrity_value" value={integrityValue} />
                          <Button
                            className="font-medium"
                            type="button"
                            onClick={onClickOpenPass}
                            label={isBrowser ? '휴대폰 번호 변경' : '휴대폰 인증'}
                          />
                        </form>
                      )}
                    </div>
                    {isPhoneCheckModal && <PhoneDuplicateCheckModal setCloseModal={setIsPhoneCheckModal} />}
                  </div>
                </li>

                <li className="row-group">
                  <label className="label">
                    대표자 이메일
                    <small>(세금계산서 수신용)</small>
                  </label>
                  <div className="content">
                    <div className="content__row email">
                      <Field className="form-control" type="text" name="email" component={TextInput} />
                      <span>@</span>
                      <Field
                        className="form-control"
                        type="text"
                        name="domain"
                        component={TextInput}
                        value={domainSelected ? domainSelected : undefined}
                      />
                      <select onChange={handleDomainChanged} value={domainSelected}>
                        {domainOption.map((item: DomainOptionType) => (
                          <option value={item.value} key={item.id}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                      <Button type="button" label="중복 확인" onClick={() => handleShowDialog(values.email)} />
                    </div>
                    <div className="cmt">
                      사업 진행 안내 메일이 발송되오니,{isMobile && <br />} 정확한 이메일 주소를 입력해 주세요.​
                    </div>
                  </div>
                </li>

                {isEmailCheckModal && (
                  <EmailDuplicateCheckModal
                    isEmailDuplicated={isEmailDuplicated}
                    setCloseModal={setIsEmailCheckModal}
                  />
                )}
                <li className="row-group bank-info">
                  <label className="label">
                    *계좌정보
                    <small>&nbsp;&nbsp;&nbsp;(법인명의)</small>
                  </label>
                  <div className="content">
                    <div className="content__row bank">
                      <select onChange={handleBankNameChange} value={bankNameSelected}>
                        {bankName.map((item: BankNameOptionType) => (
                          <option key={item.id} value={item.value}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                      <Field
                        className="form-control"
                        type="text"
                        name="account_num"
                        component={TextInput}
                        placeholder="계좌번호 입력( - 제외 )"
                      />
                    </div>
                    <div className="cmt">프로젝트 참여 시 법인 명의 계좌 확인을 위해 정확히 입력해 주세요.​</div>
                  </div>
                </li>
                {oldFile?.bankbook && (
                  <li>
                    <span className="label">기존 통장사본</span>
                    <div className="content">
                      <a
                        href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${oldFile.bankbook?.name}`}
                        className="content__file"
                      >
                        {oldFile.bankbook?.name}
                      </a>
                    </div>
                  </li>
                )}
                <li>
                  <label className="label">
                    *통장사본
                    <small>&nbsp;&nbsp;&nbsp;(법인명의)</small>
                  </label>
                  <div className="content">
                    <Field
                      name="bankbook"
                      type="file"
                      component={FileUploadField}
                      value={values.bankbook}
                      uploadConfig={UPLOAD_FILE_CONFIG}
                      chooseLabel="첨부"
                    />
                  </div>
                </li>

                {oldFile?.id_card && (
                  <li>
                    <span className="label">기존 신분증사본</span>
                    <div className="content">
                      <a
                        href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${oldFile.id_card?.name}`}
                        className="content__file"
                      >
                        {oldFile.id_card?.name}
                      </a>
                    </div>
                  </li>
                )}
                <li className="row-group">
                  <label className="label">
                    *신분증사본
                    <small>&nbsp;&nbsp;&nbsp;(대표자명의)</small>
                  </label>
                  <div className="content">
                    <div className="content__row">
                      <Field
                        name="id_card"
                        type="file"
                        component={FileUploadField}
                        value={values.id_card}
                        uploadConfig={UPLOAD_FILE_CONFIG}
                        chooseLabel="첨부"
                      />
                    </div>
                  </div>
                </li>
                {oldFile?.auth_document && (
                  <li>
                    <span className="label">기존 인감증명서</span>
                    <div className="content">
                      <a
                        href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${oldFile.auth_document?.name}`}
                        className="content__file"
                      >
                        {oldFile.auth_document?.name}
                      </a>
                    </div>
                  </li>
                )}
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
                {oldFile?.register_certified && (
                  <li>
                    <span className="label">기존 등기부등본</span>
                    <div className="content">
                      <a
                        href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${oldFile.register_certified?.name}`}
                        className="content__file"
                      >
                        {oldFile.register_certified?.name}
                      </a>
                    </div>
                  </li>
                )}
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
                    *계좌정보 및 통장, 신분증 사본, 등기부등본은 회원가입 선택사항이오나, 프로젝트 참여 필수사항으로
                    참여 시 추후 제공하셔야 합니다.
                  </div>
                </li>
              </ul>
              {isBrowser && <p className="my-info-cmt">법인 고객의 정보 수정은 확인 후 진행됩니다.</p>}
              <div className="promotion-agree">
                <div className="promotion-agree__title">
                  프로모션 정보 수신 동의<span className="text-blue">(선택)</span>
                </div>
                <div className="input-check">
                  <label htmlFor="email" className="p-checkbox-label">
                    Email
                  </label>
                  <Checkbox
                    inputId="email"
                    checked={agreeInfoEmail}
                    value={agreeInfoEmail}
                    onChange={(e) => setAgreeInfoEmail(e.checked)}
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
                    onChange={(e) => setaAgreeInfoSMS(e.checked)}
                  />
                </div>
              </div>
              <Button className="leave" onClick={() => setIsSecessionModal(true)}>
                탈퇴하기
              </Button>
              <div className="submit-wrapper">
                <Button type="button" onClick={() => submitHandler(values)} label="회원정보 수정" />
              </div>
              {isSecessionModal && (
                <SecessionModal
                  setCloseModal={setIsSecessionModal}
                  setOpenCompleteModal={setIsWithdrawalComplete}
                  {...props}
                />
              )}
              {isWithdrawalComplete && <WithdrawalComplete setCloseModal={setIsWithdrawalComplete} {...props} />}
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
}
