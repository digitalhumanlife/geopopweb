import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import React, { useState, useRef, useLayoutEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import TextInput from '../../components/TextInput';
import APIService from '../../services/API';

import './NewInvestment.scss';

import TextAreaField from '../../components/TextAreaField';
import { NewNoticeSchema } from '../../schema/notice';

const emptyData = {
  title: '',
  content: '',
};

export interface NewMyNoticeProps
  extends RouteComponentProps<{
    invest_id: string;
  }> {}

export default function NewInvestNotice(props: NewMyNoticeProps) {
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [selectedInvestment] = useState<any>(emptyData);
  const investId = useRef(props.match.params.invest_id);

  const submitHandler = async (values: any) => {
    try {
      const data = await APIService.saveInvestNotice({
        title: values.title,
        content: values.content,
        investment_id: investId.current,
      });
      if (data.success) {
        props.history.push('/my-page');
      } else {
        setErrorMsg(data.message);
        alert(`공지사항 등록에 실패했습니다. ${data.message}`);
      }
    } catch (error) {
      setErrorMsg('Unable to create new investment.');
      alert(`공지사항 등록에 실패했습니다. ${error}`);
    }
  };

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="new-investment-wrapper">
      <div className="new-investment-content">
        <h1 className="text-center font-black">Notice Management</h1>
        <Formik
          initialValues={selectedInvestment}
          enableReinitialize={true}
          validationSchema={NewNoticeSchema}
          onSubmit={submitHandler}
        >
          {() => (
            <Form className="form-group">
              <label className="label">공지 제목(Title)</label>
              <Field className="form-control" type="text" name="title" component={TextInput} />
              <div style={{ height: '10px' }} />
              <Field
                className="form-control"
                type="text"
                name="content"
                placeholder="공지 내용"
                rows={8}
                component={TextAreaField}
                style={{ padding: '20px' }}
              />

              {errorMsg && <div className="text-error">{errorMsg}</div>}
              <div className="submit-wrapper">
                <Button
                  type="button"
                  className="font-medium btn-1"
                  label="Cancel"
                  onClick={() => props.history.push('/my-page')}
                />
                <Button type="submit" className="font-medium" label="Save" />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
