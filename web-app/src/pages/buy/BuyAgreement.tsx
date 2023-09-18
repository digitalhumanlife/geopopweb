import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Checkbox } from 'primereact/checkbox';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { isEmpty } from 'lodash';
import BiteLogo from '../../statics/images/v2/bite-logo-gray.png';
import './BuyAgreement.scss';
import { initializeNicePass } from '../../utilities/pass';
import Account from '../../services/Account';
import DialogAlert from '../../components/DialogAlert';

export default function BuyAgreement(props: RouteComponentProps) {
  const [agreeArray, setAgreeArray] = useState<boolean[]>([false, false, false]);
  const [agreeAll, setAgreeAll] = useState<boolean>(false);
  const [isAcceptAbove, setAcceptAbove] = useState<boolean>(false);
  const [cb1Error, setCb1Error] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<boolean>(false);
  const [encData, setEncData] = useState<string>('');
  const [tokenVersionId, setTokenVersionId] = useState<string>('');
  const [integrityValue, setIntegrityValue] = useState<string>('');
  const [terms, setTerms] = useState<any>([]);

  const [isShowDialogAlert, setShowDialogAlert] = useState<boolean>(false);
  const showDialogAlert = () => {
    document.getElementsByTagName('body')[0].classList.add('dialog-show');
    setShowDialogAlert(true);
  };

  const handleDialogAlertHide = () => {
    setShowDialogAlert(false);
    document.getElementsByTagName('body')[0].classList.remove('dialog-show');
  };

  const initializePass = async () => {
    const returlUrl = window.location.origin + '/nice';
    const { enc_data, token_version_id, integrity_value } = await initializeNicePass(returlUrl);

    setEncData(enc_data);
    setTokenVersionId(token_version_id);
    setIntegrityValue(integrity_value);
  };

  const handleBuyClick = () => {
    if (isEmpty(name)) {
      setNameError(true);
      return;
    }
    const buyData = JSON.parse(localStorage.getItem('bought') || '{}');
    delete buyData.titles;
    delete buyData.contents;

    localStorage.setItem(
      'bought',
      JSON.stringify({
        ...buyData,
        sign_name: name,
      }),
    );
    props.history.push('/deposit-notice');
  };

  const validateCi = async (ci: string) => {
    const data = await Account.validateCi(ci);

    if (!data.success) {
      showDialogAlert();
      if (isShowDialogAlert) window.location.href = '/buy-agreement';
    }
  };

  const onClickOpenPass = () => {
    const form = document.getElementsByName('nice_form')[0] as HTMLFormElement;

    window.open('', 'nice', 'width=475, height=750, toolbar=no, menubar=no, scrollbars=no, resizable=no');
    form.target = 'nice';
    form.submit();
  };

  useEffect(() => {
    setAgreeAll(() => {
      return agreeArray.every((item) => item);
    });
  }, [agreeArray]);

  useEffect(() => {
    const buyData = JSON.parse(localStorage.getItem('bought') || '{}');

    for (let i = 0; i < buyData.titles.length; i++) {
      const title = buyData.titles[i];
      const content = buyData.contents[i];

      const term = { title, content };

      setTerms((old: any) => [...old, term]);
    }

    if (buyData.titles.length === 1) setAgreeArray([false, true, true]);
    if (buyData.titles.length === 2) setAgreeArray([false, false, true]);
    if (buyData.titles.length === 3) setAgreeArray([false, false, false]);
    initializePass();

    window.addEventListener('storage', () => {
      const niceData = localStorage.getItem('nicePass');

      if (niceData) {
        setAgreeAll(true);
        setAgreeArray([true, true, true]);
        setAcceptAbove(true);

        const { name, ci } = JSON.parse(niceData);

        validateCi(ci);
        setName(name);
      }
    });

    return () => {
      localStorage.removeItem('nicePass');
      window.removeEventListener('storage', () => {});
    };
  }, []);

  return (
    <div className="buy-agreement-wrapper">
      <div className="buy-agreement-container">
        <div className="text-center">
          <img src={BiteLogo} alt="" />
        </div>
        {terms.map(({ title, content }: any, index: number) => (
          <>
            <div className="agreement-cb-wrapper">
              <Checkbox
                className={classnames('cb1', { 'checkbox-error': cb1Error })}
                inputId="cb1"
                onChange={() => {
                  setAgreeArray((old: boolean[]) => {
                    const newArray = [...old];
                    newArray[index] = !newArray[index];
                    return newArray;
                  });
                  setCb1Error(false);
                }}
                checked={agreeArray[index]}
              />
              <label htmlFor="cb1" className="p-checkbox-label font-bold">
                {title}
              </label>
            </div>
            <div className="agreement-content">
              <div className="docs">{content}</div>
            </div>
          </>
        ))}
        <div className="accept-all-cb-wrapper">
          <Checkbox
            inputId="cb3"
            onChange={(e: { checked: boolean }) => {
              setAgreeAll(e.checked);
              setAgreeArray([true, true, true]);
            }}
            checked={agreeAll}
          />
          <label htmlFor="cb3" className="p-checkbox-label font-bold">
            모두 동의
          </label>
        </div>
        <div className="sign-wrapper">
          <span className="font-bold">성명</span>
          <InputText value={name} disabled={true} />
        </div>
        <div className="flex-center">{nameError && <small className="text-error">Please enter value</small>}</div>
        <div className="agree-above">
          <label htmlFor="cb4" className="p-checkbox-label font-bold">
            위 사실에 동의 합니다
          </label>
          <Checkbox
            inputId="cb4"
            onChange={(e: { checked: boolean }) => {
              setAcceptAbove(e.checked);
            }}
            checked={isAcceptAbove}
          />
        </div>

        {name ? (
          <div className="submit-wrapper">
            <Button disabled={!isAcceptAbove || !agreeAll} label="동의 및 진행" onClick={handleBuyClick} />
          </div>
        ) : (
          <form
            action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb"
            name="nice_form"
            className="submit-wrapper"
          >
            <input type="hidden" id="m" name="m" value="service" />
            <input type="hidden" id="token_version_id" name="token_version_id" value={tokenVersionId} />
            <input type="hidden" id="enc_data" name="enc_data" value={encData} />
            <input type="hidden" id="integrity_value" name="integrity_value" value={integrityValue} />
            <Button disabled={!isAcceptAbove || !agreeAll} type="button" onClick={onClickOpenPass} label="본인인증" />
          </form>
        )}

        <DialogAlert visible={isShowDialogAlert} onHide={handleDialogAlertHide} {...props} />
      </div>
    </div>
  );
}
