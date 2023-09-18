import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Field, Form, Formik } from 'formik';
import qs from 'query-string';
import { Button } from 'primereact/button';
import { RouteComponentProps } from 'react-router-dom';
import moment from 'moment';

import TextInput from '../../components/TextInput';
import TextAreaField from '../../components/TextAreaField';
import APIService from '../../services/API';

import './NewUserGuide.scss';
import { NewNoticeSchema } from '../../schema/notice';

const emptyUserGuide = {
  title: '',
  content: '',
};

export default function NewUserGuide(props: RouteComponentProps) {
  const query: any = qs.parse(props.location.search);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [selectedUserGuide, setSelectedUserGuide] = useState<any>(emptyUserGuide);

  const getUserGuide = async (id: string) => {
    const data = await APIService.getUserGuide(id);
    if (data.success && data.data.length > 0) {
      setSelectedUserGuide({
        ...data.data[0],
        created_at: moment(data.data[0].created_at).toDate(),
      });
    }
  };

  const submitHandler = async (values: any) => {
    try {
      const data = await APIService.saveUserGuide(values);
      if (data.success) {
        props.history.push('/user-guide');
      } else {
        setErrorMsg(data.message);
        alert(`자주하는질문 등록에 실패했습니다. ${data.message}`);
      }
    } catch (error) {
      setErrorMsg('Unable to create new user guide.');
      alert(`자주하는질문 등록에 실패했습니다. ${error}`);
    }
  };

  useEffect(() => {
    if (query.id) {
      getUserGuide(query.id);
    }
  }, [query.id]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="new-user-guide-wrapper">
      <div className="new-user-guide-content">
        {query.id ? (
          <h1 className="text-center font-black">Edit User Guide</h1>
        ) : (
          <h1 className="text-center font-black">New User Guide</h1>
        )}
        <Formik
          initialValues={selectedUserGuide}
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
                  onClick={() => props.history.push('/user-guide')}
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
