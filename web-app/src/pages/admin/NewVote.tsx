import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Col, Grid, Row } from 'react-flexbox-grid';
import { Field, Form, Formik } from 'formik';
import qs from 'query-string';
import { Button } from 'primereact/button';
import { RouteComponentProps } from 'react-router-dom';
import moment from 'moment';

import TextInput from '../../components/TextInput';
import TextAreaField from '../../components/TextAreaField';
import FileUploadField from '../../components/FileUploadField';
import APIService from '../../services/API';

import './NewVote.scss';
import { NewVoteSchema } from '../../schema/newVote';
import { UPLOAD_FILE_CONFIG } from '../../constants/fileConfig';

const emptyVote = {
  title: '',
  content: '',
  file: null,
};

export default function NewVote(props: RouteComponentProps) {
  const query: any = qs.parse(props.location.search);
  const [investmentId, setInvestmentId] = useState<string>(query.investmentId);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [selectedVote, setSelectedVote] = useState<any>(emptyVote);

  const getVote = async (id: string) => {
    const data = await APIService.getVote(id);
    if (data.success && data.data.length > 0) {
      setSelectedVote({
        ...data.data[0],
        created_at: moment(data.data[0].created_at).toDate(),
      });
    }
  };

  const submitHandler = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('file', values.file);
      formData.append('investment_id', investmentId);

      if (query.id) {
        formData.append('id', query.id);
      }

      const data = await APIService.saveVote(formData);

      if (data.success) {
        props.history.goBack();
      } else {
        setErrorMsg(data.message);
        alert(`투표 등록에 실패했습니다. ${data.message}`);
      }
    } catch (error) {
      setErrorMsg('Unable to create new vote.');
      alert(`투표 등록에 실패했습니다. ${error}`);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (query.id) {
      getVote(query.id);
    }
  }, [query.id]);

  useEffect(() => {
    if (query.investment_id) {
      setInvestmentId(query.investment_id);
    }
  }, [query.investment_id]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="new-vote-wrapper">
      <div className="new-vote-content">
        {query.id ? (
          <h1 className="text-center font-black">Edit Vote</h1>
        ) : (
          <h1 className="text-center font-black">New Vote</h1>
        )}
        <Formik
          initialValues={selectedVote}
          enableReinitialize={true}
          onSubmit={submitHandler}
          validationSchema={NewVoteSchema}
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
              <label className="label">첨부 파일</label>
              <Grid>
                <Row>
                  <Col xs={12}>
                    <Field
                      component={FileUploadField}
                      value={values.file}
                      name="file"
                      uploadConfig={UPLOAD_FILE_CONFIG}
                      chooseLabel="첨부 파일"
                    />
                  </Col>
                </Row>
              </Grid>
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
