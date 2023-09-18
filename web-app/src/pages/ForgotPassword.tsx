import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Row, Col } from 'react-flexbox-grid';
import React, { useState } from 'react';
import { NavLink, RouteComponentProps } from 'react-router-dom';

import TextInput from '../components/TextInput';
import AccountService from '../services/Account';

import Logo from '../statics/images/gc/unnamed.png';
import './ForgotPassword.scss';
import { ForgotPasswordSchema } from '../schema/forgotPassword';

export default function ForgotPassword(props: RouteComponentProps) {
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const submitHandler = async (values: any, { setSubmitting }: any) => {
    try {
      await AccountService.forgotPassword(values.email);
      setErrorMsg('');
      setMsg('Reset password link has been sent. Please check your email.');
    } catch (error: any) {
      setMsg('');
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
            initialValues={{ email: '', password: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={submitHandler}
          >
            {({ isSubmitting }) => (
              <Form className="form-group">
                <Field
                  className="form-control"
                  type="email"
                  name="email"
                  component={TextInput}
                  placeholder="Your registered email"
                />
                {msg && <div className="msg-info">{msg}</div>}
                {errorMsg && <div className="text-error">{errorMsg}</div>}
                <div>
                  {isSubmitting ? (
                    <i className="pi pi-spin pi-spinner" />
                  ) : (
                    <Button type="submit" disabled={isSubmitting} label="Send" className="signin-btn fsi-12rem-xs" />
                  )}
                </div>
                <div className="p-col back-link fs-12rem-xs">
                  <NavLink to="/login">Back to Sign In</NavLink>
                </div>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </div>
  );
}
