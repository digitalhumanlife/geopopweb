import classnames from 'classnames';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Field, Form, Formik } from 'formik';
import { Checkbox } from 'primereact/checkbox';
import { isBrowser } from 'react-device-detect';
// import moment from 'moment';
import { RouteComponentProps } from 'react-router-dom';

import TextInput from '../components/TextInput';
import TextAreaField from '../components/TextAreaField';
import APIService from '../services/API';

import './Support.scss';
import TitleNotice from '../statics/images/v3/bg-notice.jpg';
import { domainOption, DomainOptionType } from '../constants/emailDomain';
import { QnASchema } from '../schema/qnA';

const emptyData = {
  name: '',
  email: '',
  domain: '',
  phone: '',
  title: '',
  content: '',
};

export default function Support(props: RouteComponentProps) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [domainSelected, setDomainSelected] = useState(domainOption[0].value);
  const [textLength, setTextLength] = useState(0);
  const [isAcceptTerm, setAcceptTerm] = useState<boolean>(false);
  const [cb1Error, setCb1Error] = useState<boolean>(false);
  const [agreeError, setAgreeError] = useState<string>('');

  const handleDomainChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '직접입력') return setDomainSelected(undefined);
    setDomainSelected(e.target.value);
  };

  const getTextLength = (e: any) => {
    let last_char = e.target.value.charAt(e.target.value.length - 1);
    const ascii = last_char.charCodeAt();
    if ((ascii >= 65 && ascii <= 90) || (ascii >= 97 && ascii <= 122)) {
      setTextLength((value) => value + 1);
    } else {
      setTextLength((value) => value + 2);
    }
  };

  const submitHandler = async (values: any, { setSubmitting, resetForm }: any) => {
    setCb1Error(false);
    if (!isAcceptTerm) {
      setCb1Error(true);
      document.querySelector('.cb1')?.scrollIntoView({ behavior: 'smooth' });
      setAgreeError('본 약관은 필수 동의 사항입니다.');
      return;
    }

    try {
      const payload = {
        name: values.name,
        email: values.email,
        domain: domainSelected,
        phone1: String(values.phone).substring(0, 3),
        phone2: String(values.phone).substring(3, 7),
        phone3: String(values.phone).substring(7, 11),
        title: values.title,
        content: values.content,
      };

      const data = await APIService.sendQnaEmail(payload);

      if (data.success) {
        alert('정상 접수 되었습니다.');
        setErrorMessage('');
        resetForm();
      }

      if (!data.success) {
        setErrorMessage(data.data.message);
      }
    } catch (error) {
      setSubmitting(false);
    }
  };

  return (
    <div className="support-wrapper">
      <div className="common-header">
        <img src={TitleNotice} alt="" />
        <h1 className="text-center">1 : 1 문의</h1>
      </div>
      <div className="support-content">
        <Formik
          initialValues={emptyData}
          enableReinitialize={true}
          onSubmit={submitHandler}
          validationSchema={QnASchema}
        >
          {({ values, isSubmitting }) => (
            <Form className="form-group">
              <div className="table-2" style={{ marginTop: 0 }}>
                <div className="table-2-content">
                  <div className="name">
                    <div className="label">이름</div>
                    <div className="content">
                      <Field className="form-control" type="text" name="name" component={TextInput} />
                    </div>
                  </div>
                  <div className="row-3">
                    <div className="label">휴대폰</div>
                    <div className="content">
                      {/* <select>
                        <option>대한민국(+82)</option>
                      </select> */}
                      {isBrowser ? (
                        <>
                          <Field className="form-control" type="text" name="phone" component={TextInput} />
                          <span>' - ' 제외 입력</span>
                        </>
                      ) : (
                        <Field
                          className="form-control"
                          type="text"
                          name="phone"
                          placeholder="' - ' 제외 입력"
                          component={TextInput}
                        />
                      )}
                    </div>
                  </div>
                  <div className="row-2">
                    <div className="label">이메일</div>
                    <div className="content">
                      <Field className="form-control" type="text" name="email" component={TextInput} />
                      <span>@</span>
                      <Field
                        className="form-control"
                        type="text"
                        name="domain"
                        component={TextInput}
                        value={domainSelected}
                      />
                      <select onChange={handleDomainChanged} value={domainSelected}>
                        {domainOption.map((item: DomainOptionType) => (
                          <option value={item.value} key={item.id}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row-4">
                    <div className="label">제목</div>
                    <div className="content">
                      <Field className="form-control w-full" type="text" name="title" component={TextInput} />
                    </div>
                  </div>
                  <div className="row-5">
                    <div className="label">내용</div>
                    <div className="content">
                      <Field
                        className="form-control w-full"
                        type="text"
                        name="content"
                        rows={8}
                        component={TextAreaField}
                        onChange={getTextLength}
                        disabled={+textLength >= 2000}
                      />
                      <span className="range">
                        현재 {textLength} / 최대 4000byte
                        <br />
                        (한글 2000자, 영문 4000자)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="table-dsc">
                  <div className="input-check term-cb-wrapper">
                    <Checkbox
                      className={classnames('cb1', { 'checkbox-error': cb1Error })}
                      inputId="cb1"
                      onChange={(e) => {
                        setAcceptTerm(e.checked);
                        setCb1Error(false);
                      }}
                      checked={isAcceptTerm}
                    />
                    <label htmlFor="cb1" className="p-checkbox-label font-bold">
                      개인정보 수집 및 이용에 동의합니다. <span className="text-blue">(필수)</span>
                      {cb1Error === true && <div className="agree-error text-error">{agreeError}</div>}
                    </label>
                  </div>
                  <p>고객님의 상담내역은 자주 하는 질문에 활용될 수 있습니다.</p>
                </div>
              </div>
              {errorMessage && <div className="text-error">{errorMessage}</div>}
              <div className="button-group">
                <Button type="submit" label="보내기" />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
