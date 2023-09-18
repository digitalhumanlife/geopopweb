import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import { Col, Grid, Row } from 'react-flexbox-grid';
import { RouteComponentProps } from 'react-router-dom';

import AccountService from '../services/Account';
import TextInput from '../components/TextInput';

import './ResetPassword.scss';
import Logo from '../statics/images/gc/unnamed.png';
import { ResetPasswordSchema } from '../schema/resetPassword';

export default function ResetPassword(props: RouteComponentProps) {
  const query: any = qs.parse(props.location.search);
  const [errorMsg, setErrorMsg] = useState('');
  const [initFormData, setInitFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    AccountService.checkResetPasswordToken(query.token)
      .then((response: any) => {
        setInitFormData({ ...initFormData, email: response.email });
      })
      .catch((error: any) => {
        setErrorMsg(error.response.data.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandler = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      setErrorMsg('');
      await AccountService.changePassword(query.token, values.password);
      setErrorMsg('Your password reset successfully, Please try to login again.');
    } catch (error: any) {
      setErrorMsg(error.response.data.message);
    }

    setSubmitting(false);
  };

  return (
    <div className="login-container">
      <Row className="logo-ctn">
        <img src={Logo} alt="" />
      </Row>
      <Row center="xs">
        <Col lg={10} md={8} xs={11} className="content-wrapper">
          <Formik
            initialValues={initFormData}
            onSubmit={submitHandler}
            validationSchema={ResetPasswordSchema}
            enableReinitialize={true}
          >
            {(formikProps: any) => {
              return (
                <Form className="form-group">
                  <Grid className="change-password-content">
                    <Row>
                      <Col xs={true}>
                        <Field
                          className="form-control"
                          type="email"
                          name="email"
                          readOnly={true}
                          component={TextInput}
                          placeholder="Email"
                          value={formikProps.values.email}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={true}>
                        <Field
                          className="form-control"
                          type="password"
                          name="password"
                          component={TextInput}
                          value={formikProps.values.password}
                          placeholder="New Password"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={true}>
                        <Field
                          className="form-control"
                          type="password"
                          name="confirmPassword"
                          component={TextInput}
                          value={formikProps.values.confirmPassword}
                          placeholder="Confirm Password"
                        />
                      </Col>
                    </Row>
                    <Row start="xs">
                      <Col xs={true}>
                        {formikProps.isSubmitting ? (
                          <i className="pi pi-spin pi-spinner" />
                        ) : (
                          <Button type="submit" label="Submit" className="signin-btn fsi-12rem-xs" />
                        )}
                        {errorMsg && errorMsg.length > 0 && <div className="error-feedback">{errorMsg}</div>}
                      </Col>
                    </Row>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </Col>
      </Row>
    </div>
  );
}
