import React, { useEffect, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import qs from 'query-string';
import { Button } from 'primereact/button';
import { RouteComponentProps } from 'react-router-dom';
import moment from 'moment';

import TextInput from '../../components/TextInput';
import TextAreaField from '../../components/TextAreaField';
import APIService from '../../services/API';

import './NewNotice.scss';
import { NewNoticeSchema } from '../../schema/notice';

const emptyNotice = {
  title: '',
  content: '',
};

export default function NewNotice(props: RouteComponentProps) {
  const query: any = qs.parse(props.location.search);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [selectedNotice, setSelectedNotice] = useState<any>(emptyNotice);

  const getNotice = async (id: string) => {
    const data = await APIService.getNotice(id);
    if (data.success && data.data.length > 0) {
      setSelectedNotice({
        ...data.data[0],
        created_at: moment(data.data[0].created_at).toDate(),
      });
    }
  };

  const submitHandler = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      const data = await APIService.saveNotice(values);
      if (data.success) {
        props.history.push('/notice');
      } else {
        setErrorMsg(data.message);
        alert(`공지사항 등록에 실패했습니다. ${data.message}`);
      }
    } catch (error) {
      setSubmitting(false);
      setErrorMsg('Unable to create new notice.');
      alert(`공지사항 등록에 실패했습니다. ${error}`);
    }
  };

  useEffect(() => {
    if (query.id) {
      getNotice(query.id);
    }
  }, [query.id]);

  return (
    <div className="new-notice-wrapper">
      <div className="new-notice-content">
        {query.id ? (
          <h1 className="text-center font-black">Edit Notice</h1>
        ) : (
          <h1 className="text-center font-black">New Notice</h1>
        )}
        <Formik
          initialValues={selectedNotice}
          enableReinitialize={true}
          onSubmit={submitHandler}
          validationSchema={NewNoticeSchema}
        >
          {({ values, isSubmitting }) => (
            <Form className="form-group">
              <label className="label">Title</label>
              <Field className="form-control" type="text" name="title" component={TextInput} />
              <label className="label">Content</label>
              <Field
                containerClass="w-full"
                className="form-control"
                type="text"
                name="content"
                component={TextAreaField}
              />
              {errorMsg && <div className="text-error">{errorMsg}</div>}
              <div className="submit-wrapper">
                <Button
                  type="button"
                  className="font-medium btn-1"
                  label="Cancel"
                  onClick={() => props.history.goBack()}
                />
                <Button disabled={isSubmitting} type="submit" className="font-medium" label="Save" />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
