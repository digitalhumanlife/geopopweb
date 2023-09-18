import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from 'primereact/button';
// import { Field } from 'formik';
import DialogAlert from '../components/DialogAlert';
import DepositAlert from '../components/DepositAlert';
import moment from 'moment';
import { initializeNicePass } from '../utilities/pass';
import { isEmpty } from 'lodash';
// import TextInput from '../components/TextInput';
// import FileUploadField from '../components/FileUploadField';
// import { UPLOAD_FILE_CONFIG } from '../constants/fileConfig';

import APIService from '../services/API';

import './Participate.scss';
import { useUser } from '../store/hooks/hooks';
import { isChecked } from '../utilities/radioChecked';
import { toFile } from '../utilities/changeFile';
import { isMobile, isBrowser } from 'react-device-detect';

export default function Participate(props: RouteComponentProps) {
  const [isShowDialogAlert, setShowDialogAlert] = useState<boolean>(false);
  const [isShowDepositAlert, setShowDepositAlert] = useState<boolean>(false);

  const [tokenVersionId, setTokenVersionId] = useState<string>('');
  const [encData, setEncData] = useState<string>('');
  const [integrityValue, setIntegrityValue] = useState<string>('');
  const [isNicePass, setIsNicePass] = useState<boolean>(false);
  const [certificationUser, setCertifiCationUser] = useState<any>({});
  const [bankInfo, setBankInfo] = useState<any>();

  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);
  const [nameValue, setNameValue] = useState<string>('');
  const [fund, setFund] = useState(0);
  const [userData, setUserData] = useState<any>();
  const [investment, setInvestMent] = useState<any>({});
  const [isParticipation, setIsParticipation] = useState(false);
  const curId = useRef<string>('');

  const user = useUser();

  const handleBuyClick = async () => {
    if (!Object.keys(certificationUser).length) return setIsErrorMessage(true);
    if (isEmpty(certificationUser.name) || isEmpty(certificationUser.phone2)) return setIsErrorMessage(true);
    if (certificationUser.name !== nameValue) return setShowDialogAlert(true);
    if (user.name !== nameValue) return setShowDialogAlert(true);
    if (user.name !== certificationUser.name) return setShowDialogAlert(true);
    if (
      !(
        isChecked('agreement1') &&
        isChecked('agreement2') &&
        isChecked('agreement3') &&
        isChecked('agreement4') &&
        isChecked('agreement5') &&
        isChecked('agreement6') &&
        isChecked('agreement7') &&
        isChecked('agreement8') &&
        isChecked('agreement9')
      )
    )
      return setIsErrorMessage(true);

    const buyData = JSON.parse(localStorage.getItem('bought') || '{}');

    const result = await APIService.getBankInformation(buyData.investment_id);
    if (result.success) setBankInfo(result);
    else alert('Error');

    const res = await APIService.saveBought({
      investment_id: buyData.investment_id,
      invest_id: buyData.invest_id,
      title: buyData.title,
      process_percent: 0,
      amount: buyData.amount,
    });

    if (res.success) {
      showDepositAlert(buyData.investment_id);
      setIsParticipation(true);
      localStorage.removeItem('bought');
    } else {
      alert('Error');
    }
  };

  const onClickOpenPass = () => {
    const form = document.getElementsByName('nice_form')[0] as HTMLFormElement;

    window.open('', 'nice', 'width=475, height=750, toolbar=no, menubar=no, scrollbars=no, resizable=no');
    form.target = 'nice';
    form.submit();

    window.addEventListener('storage', () => {
      try {
        const niceData = localStorage.getItem('nicePass');
        if (niceData) {
          const passData = JSON.parse(niceData);
          setCertifiCationUser(() => {
            return {
              name: passData.name,
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

  const initializePass = async () => {
    const returlUrl = window.location.origin + '/nice';
    const { enc_data, token_version_id, integrity_value } = await initializeNicePass(returlUrl);

    setEncData(enc_data);
    setTokenVersionId(token_version_id);
    setIntegrityValue(integrity_value);
  };

  const getSocialSecurityNum = () => {
    if (user.type === 'business') return user.business_number;
    const is20Th = String(user.year).substring(0, 2);
    const gender = user.gender;
    const backNum =
      is20Th === '19' && gender === '남자'
        ? '1'
        : gender === '여자'
        ? 2
        : is20Th === '20' && gender === '남자'
        ? '3'
        : '4';

    const yy = String(user.year).substring(2, 4);
    const mm = +user.month < 10 ? `0${user.month}` : user.month;
    const dd = +user.day < 10 ? `0${user.day}` : user.day;
    return String(yy) + String(mm) + String(dd) + ' - ' + backNum + '******';
  };

  const getInvestMent = async (id: string) => {
    const result = await APIService.getInvestment(id);
    if (result.success) {
      const doc1 = result.data[0].document1 ? await toFile(result.data[0].document1) : '';
      const doc2 = result.data[0].document2 ? await toFile(result.data[0].document2) : '';
      const doc3 = result.data[0].document3 ? await toFile(result.data[0].document3) : '';
      const doc4 = result.data[0].document4 ? await toFile(result.data[0].document4) : '';
      const doc5 = result.data[0].document5 ? await toFile(result.data[0].document5) : '';

      const url = window.URL || window.webkitURL;
      setInvestMent({
        ...result.data[0],
        document1: doc1 ? url.createObjectURL(doc1) : null,
        document2: doc2 ? url.createObjectURL(doc2) : null,
        document3: doc3 ? url.createObjectURL(doc3) : null,
        document4: doc4 ? url.createObjectURL(doc4) : null,
        document5: doc5 ? url.createObjectURL(doc5) : null,
        business_information: JSON.parse(result.data[0].business_information),
      });
    }
  };

  const handleDialogAlertHide = () => {
    setShowDialogAlert(false);
    document.getElementsByTagName('body')[0].classList.remove('dialog-show');
  };

  const showDepositAlert = (id: string) => {
    curId.current = id;
    document.getElementsByTagName('body')[0].classList.add('dialog-show');
    setShowDepositAlert(true);
  };

  const handleDepositAlertHide = () => {
    setShowDepositAlert(false);
    document.getElementsByTagName('body')[0].classList.remove('dialog-show');
  };

  useEffect(() => {
    const buyData = localStorage.getItem('bought');

    if (!buyData) {
      alert('잘못된 접근입니다.');
      props.history.push('/');
      return;
    }

    const data = JSON.parse(buyData);
    getInvestMent(data.investment_id);

    setFund(data.amount);
  }, []);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  useEffect(() => {
    initializePass();

    return () => {
      localStorage.removeItem('nicePass');
      localStorage.removeItem('bought');
    };
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="participate-wrapper">
      <div className="common-header">
        <h1>프로젝트 참여 관련 서류 및 동의</h1>
      </div>
      <div className="participate-container">
        <div className="participate-document">
          <h2>조합 결성 총회 안내문</h2>
          <div className="scroll-box">
            {investment.document1 !== null && (
              <iframe
                title="document1"
                src={!!investment.document1 ? `${investment.document1}#toolbar=0&navpanes=0&scrollbar=0` : ''}
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </div>
        </div>
        <div className="participate-document">
          <h2>지오팝 프로젝트조합 규약</h2>
          <div className="scroll-box">
            {investment.document2 !== '' && (
              <iframe
                title="document2"
                src={!!investment.document2 ? `${investment.document2}#toolbar=0&navpanes=0&scrollbar=0` : ''}
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </div>
        </div>
        <div className="participate-document">
          <h2>조합 결성총회 의안설명서</h2>
          <div className="scroll-box">
            {investment.document3 !== '' && (
              <iframe
                title="document3"
                src={!!investment.document3 ? `${investment.document3}#toolbar=0&navpanes=0&scrollbar=0` : ''}
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </div>
        </div>

        <div className="participate-agreement basic">
          <div className="title title-left">
            <strong>◤{investment.business_information?.code}◢</strong>
          </div>
          <p>
            본인은 『{investment.business_information?.code}』의 조합원총회의 의안에 대하여​ 다음과 같이 전자서명 으로
            의결권을 행사합니다.​
          </p>
          <div className="agree-area">
            <ul className="agree-list">
              <li className="agree-list__head">
                <span className="sbj">부 의 안 건</span>
                <div className="agree-select">
                  <span>찬성</span>
                  <span>반대</span>
                </div>
              </li>
              <li>
                <span className="sbj">제 1호 의안 {isMobile && <br />}: 규약 승인의 건</span>
                <div className="agree-select">
                  <span className="input-check">
                    <input type="radio" id="agree1" name="agreement1" value={'yes'} />
                    <label htmlFor="agree1">
                      <i className="icon-check"></i>
                    </label>
                  </span>
                  <span className="input-check">
                    <input type="radio" id="agree2" name="agreement1" value={'no'} />
                    <label htmlFor="agree2">
                      <i className="icon-check"></i>
                    </label>
                  </span>
                </div>
              </li>
              <li>
                <span className="sbj">제 2호 의안 {isMobile && <br />}: 사업계획 승인의 건</span>
                <div className="agree-select">
                  <span className="input-check">
                    <input type="radio" id="agree3" name="agreement2" value={'yes'} />
                    <label htmlFor="agree3">
                      <i className="icon-check"></i>
                    </label>
                  </span>
                  <span className="input-check">
                    <input type="radio" id="agree4" name="agreement2" value={'no'} />
                    <label htmlFor="agree4">
                      <i className="icon-check"></i>
                    </label>
                  </span>
                </div>
              </li>
              <li>
                <span className="sbj">제 3호 의안 {isMobile && <br />}: 임원 선임의 건</span>
                <div className="agree-select">
                  <span className="input-check">
                    <input type="radio" id="agree5" name="agreement3" value={'yes'} />
                    <label htmlFor="agree5">
                      <i className="icon-check"></i>
                    </label>
                  </span>
                  <span className="input-check">
                    <input type="radio" id="agree6" name="agreement3" value={'no'} />
                    <label htmlFor="agree6">
                      <i className="icon-check"></i>
                    </label>
                  </span>
                </div>
              </li>
              <li>
                <span className="sbj">제 4호 의안 {isMobile && <br />}: 회계감사인 선임의 건</span>
                <div className="agree-select">
                  <span className="input-check">
                    <input type="radio" id="agree7" name="agreement4" value={'yes'} />
                    <label htmlFor="agree7">
                      <i className="icon-check"></i>
                    </label>
                  </span>
                  <span className="input-check">
                    <input type="radio" id="agree8" name="agreement4" value={'no'} />
                    <label htmlFor="agree8">
                      <i className="icon-check"></i>
                    </label>
                  </span>
                </div>
              </li>
              <li>
                <span className="sbj">제 5호 의안 {isMobile && <br />}: 사업관련 당사자 선임의 건</span>
                <div className="agree-select">
                  <span className="input-check">
                    <input type="radio" id="agree9" name="agreement5" value={'yes'} />
                    <label htmlFor="agree9">
                      <i className="icon-check"></i>
                    </label>
                  </span>
                  <span className="input-check">
                    <input type="radio" id="agree10" name="agreement5" value={'no'} />
                    <label htmlFor="agree10">
                      <i className="icon-check"></i>
                    </label>
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div className="align-right">
            <strong>{moment().format('YYYY년 MM월 DD일')}</strong>
          </div>

          <div className="detail">
            <p>조합원명 : {userData?.name}</p>
            <p>좌 수 : {fund} 계좌</p>
            <p>주민등록번호 : {getSocialSecurityNum()}</p>
          </div>
        </div>

        <div className="participate-agreement combi">
          <strong className="title">조합동의서</strong>
          <p>
            본인은 『{investment.business_information?.code}』 의 규약과 사업계획의 내용을 충분히 숙지하고 이에 동의하는
            바, 본 규약을 수락하고 동의서에 날인합니다.
          </p>
          <div className="align-right">
            <strong>{moment().format('YYYY년 MM월 DD일')}</strong>
          </div>

          <div className="detail">
            <p>조합원명 : {userData?.name}</p>
            <p>주민등록번호 (사업자번호) : {getSocialSecurityNum()}</p>
            <p>주&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;소 : {userData?.address}</p>
            <p>연&nbsp;락&nbsp;처 : {userData?.phone2}</p>
            <p>좌&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;수 : {fund} 계좌</p>
          </div>

          <div className="align-right">
            <p>{investment.business_information?.code}</p>
            <p>업무진행조합원</p>
            <p>(주)그라운드컨트롤 귀하</p>
          </div>
        </div>

        <div className="participate-document">
          <div className="scroll-box">
            {investment.document4 !== '' && (
              <iframe
                title="document4"
                src={!!investment.document4 ? `${investment.document4}#toolbar=0&navpanes=0&scrollbar=0` : ''}
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </div>

          <div className="agree-area">
            <strong>※ 위와 같이 귀하의 개인(신용)정보 중 아래 항목을 수집, 이용하는 것에 동의합니까?​</strong>
            <ul className="agree-list">
              <li>
                <span className="sbj">필수 항목 중 조합원명부, 개인식별정보</span>
                <div className="agree-select">
                  <span className="input-check">
                    <input type="radio" id="agree15" name="agreement8" value={'yes'} />
                    <label htmlFor="agree15">
                      <i className="icon-check"></i>동의
                    </label>
                  </span>
                  <span className="input-check">
                    <input type="radio" id="agree16" name="agreement8" value={'no'} />
                    <label htmlFor="agree16">
                      <i className="icon-check"></i>비동의
                    </label>
                  </span>
                </div>
              </li>
              <li>
                <span className="sbj">필수 항목 중 고유식별정보 (주민등록번호)</span>
                <div className="agree-select">
                  <span className="input-check">
                    <input type="radio" id="agree17" name="agreement9" value={'yes'} />
                    <label htmlFor="agree17">
                      <i className="icon-check"></i>동의
                    </label>
                  </span>
                  <span className="input-check">
                    <input type="radio" id="agree18" name="agreement9" value={'no'} />
                    <label htmlFor="agree18">
                      <i className="icon-check"></i>비동의
                    </label>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="participate-document">
          <div className="scroll-box">
            {investment.document5 !== '' && (
              <iframe
                title="document5"
                src={!!investment.document5 ? `${investment.document5}#toolbar=0&navpanes=0&scrollbar=0` : ''}
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </div>

          <div className="agree-area">
            <strong>※ 위와 같이 귀하의 개인(신용)정보 중 아래 항목을 제3자에 제공하는 것에 동의합니까?​</strong>
            <ul className="agree-list">
              <li>
                <span className="sbj">필수 항목 중 조합원명부, 개인식별정보</span>
                <div className="agree-select">
                  <span className="input-check">
                    <input type="radio" id="agree11" name="agreement6" value={'yes'} />
                    <label htmlFor="agree11">
                      <i className="icon-check"></i>동의
                    </label>
                  </span>
                  <span className="input-check">
                    <input type="radio" id="agree12" name="agreement6" value={'no'} />
                    <label htmlFor="agree12">
                      <i className="icon-check"></i>비동의
                    </label>
                  </span>
                </div>
              </li>
              <li>
                <span className="sbj">필수 항목 중 고유식별정보 (주민등록번호)</span>
                <div className="agree-select">
                  <span className="input-check">
                    <input type="radio" id="agree13" name="agreement7" value={'yes'} />
                    <label htmlFor="agree13">
                      <i className="icon-check"></i>동의
                    </label>
                  </span>
                  <span className="input-check">
                    <input type="radio" id="agree14" name="agreement7" value={'no'} />
                    <label htmlFor="agree14">
                      <i className="icon-check"></i>비동의
                    </label>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* <div className="participate-require">
          <div className="participate-require__type">
            <h2 className="title">* 필수정보 및 서류</h2>
            <div className="input-select">
              <input id="typeLoad" type="radio" name="selectType" />
              <label htmlFor="typeLoad">
                회원정보 자동입력
                <i className="icon-check"></i>
              </label>
            </div>
            <div className="input-select">
              <input id="typeNew" type="radio" name="selectType" />
              <label htmlFor="typeNew">
                새로입력
                <i className="icon-check"></i>
              </label>
              <div className="input-check">
                <input id="save" type="checkbox" name="saveData" />
                <label htmlFor="save">
                  기본정보로 저장
                  <i className="icon-check"></i>
                </label>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <ul className="form-group__list">
              <li className="row-group">
                <label className="label">본인명의 계좌정보</label>
                <div className="content">
                  <div className="content__row bank">
                    <select>
                      <option>은행명</option>
                    </select>
                    <Field
                      className="form-control"
                      type="text"
                      name="bank"
                      component={TextInput}
                      placeholder="계좌번호 입력( - 제외 )"
                    />
                  </div>
                  <div className="cmt">프로젝트 참여 시 본인 명의 계좌 확인을 위해 정확히 입력해 주세요.​</div>
                </div>
              </li>
              <li>
                <label className="label">통장사본</label>
                <div className="content">
                  <Field
                    name="file"
                    type="file"
                    component={FileUploadField}
                    value={'file'}
                    uploadConfig={UPLOAD_FILE_CONFIG}
                    chooseLabel="첨부"
                  />
                </div>
              </li>
              <li className="row-group">
                <label className="label">신분증사본</label>
                <div className="content">
                  <div className="content__row">
                    <Field
                      name="file"
                      type="file"
                      component={FileUploadField}
                      value={'file'}
                      uploadConfig={UPLOAD_FILE_CONFIG}
                      chooseLabel="첨부"
                    />
                  </div>
                </div>
              </li>
              <li className="row-group">
                <label className="label">인감증명서</label>
                <div className="content">
                  <div className="content__row">
                    <Field
                      name="file"
                      type="file"
                      component={FileUploadField}
                      value={'file'}
                      uploadConfig={UPLOAD_FILE_CONFIG}
                      chooseLabel="첨부"
                    />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div> */}

        <div className="participate-agreement">
          <p>
            본인은 만 19세 이상이며 모든 관련 정보 및 서류내용을 숙지하였고 {isBrowser && <br />}
            위험요소 및 부담에 대한 신중한 검토 후 프로젝트 참여를 신청합니다​.
          </p>
          <div className="certification">
            <div className="info">
              <p>
                이름 : <span>{certificationUser?.name || 'ex) 홍길동'}</span>
              </p>
              <p>
                전화번호 : <span>{certificationUser?.phone2 || 'ex) 010********'}</span>
              </p>
            </div>
            <form action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb" name="nice_form">
              <input type="hidden" id="m" name="m" value="service" />
              <input type="hidden" id="token_version_id" name="token_version_id" value={tokenVersionId} />
              <input type="hidden" id="enc_data" name="enc_data" value={encData} />
              <input type="hidden" id="integrity_value" name="integrity_value" value={integrityValue} />
              <Button
                type="button"
                className="font-regular"
                label={isNicePass ? '인증 완료' : '본인 인증'}
                onClick={() => onClickOpenPass()}
                disabled={isNicePass}
              />
            </form>
          </div>
          <div className="agree-name">
            <label htmlFor="name">성명 :</label>
            <input
              type="text"
              id="name"
              placeholder="직접 입력"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
            />
          </div>
          <p>
            본인의 성명을 직접 입력함으로써 {isMobile && <br />}프로젝트 참여 신청에 대한 {isMobile && <br />}본인의
            자발적인 의사를 최종 확인하며,
            <br /> 참여신청이 프로젝트 참여(권) 확정 또는 보장을{isMobile && <br />} 의미하지 않는다는 점을 이해합니다.
          </p>
          <p className="require">
            회원가입 시 필수 정보 및 서류를{isMobile && <br />} 제공하지 않으신 분은 필히 참여 신청 전
            <br /> “마이페이지-회원정보”로 이동하셔서
            <br />
            필수서류(통장사본, 신분증 사본, 인감증명서,{isMobile && <br />}법인의 경우 등기부등본)을 제공하여 주셔야
            합니다.
          </p>
          <Button
            label={isParticipation ? '신청완료' : '참여신청'}
            className="submit"
            onClick={handleBuyClick}
            disabled={isParticipation}
          />
          {isErrorMessage && (
            <p className="warn">프로젝트 참여를 위해 모든 내용에 대한 동의 및 정보입력이 필수입니다.</p>
          )}
          <p className="guide">
            * 신청기간 마감 후 참여신청 취소 및 즉각적인​ 자금반환이 불가하오니 신중히 결정해주시기 바랍니다.
          </p>
        </div>

        <p className="participate-notice">
          프로젝트 참여 관련 서류 및 약관 동의서는
          <br />
          '마이페이지 - 나의 프로젝트'에서 {isMobile && <br />}다운로드 하실 수 있습니다.
        </p>
      </div>
      <DialogAlert visible={isShowDialogAlert} onHide={handleDialogAlertHide} {...props} />

      {isShowDepositAlert && (
        <DepositAlert visible={true} onHide={handleDepositAlertHide} id={curId} bankInfo={bankInfo.data} {...props} />
      )}
    </div>
  );
}
