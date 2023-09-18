import React, { useEffect, useRef, useState } from 'react';
import { Col, Grid, Row } from 'react-flexbox-grid';
import { RouteComponentProps } from 'react-router';
import Moment from 'react-moment';
import { Message } from 'primereact/message';

import { config } from '../config';
import APIService from '../services/API';

import './LoanDetail.scss';

export interface LoanDetailProps
  extends RouteComponentProps<{
    id: string;
  }> {}

export default function LoanDetail(props: LoanDetailProps) {
  const [errorMsg, setErrorMsg] = useState<string>();
  const [loanRequest, setLoanRequest] = useState<any>({});
  const [isSubmitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    APIService.getRequest(props.match.params.id).then((result) => {
      setLoanRequest(result.data.data);
    });
    setSubmitted(localStorage.getItem('loan-submitted') === 'true');
    localStorage.removeItem('loan-submitted');
  }, []);

  return (
    <div className="form-group loan-detail-wrapper">
      <Grid>
        {isSubmitted && (
          <Row>
            <Col xs={12} className="flex-between">
              <Message className="" severity="success" text="Your request is submitted" />
            </Col>
          </Row>
        )}
        <Row>
          <Col xs={12} className="flex-between group-title">
            <div>
              <h1>Your loan details</h1>
            </div>
            <p className="flex-self-center">1 of 7</p>
          </Col>
          <Col xs={12}>
            <hr />
          </Col>
        </Row>
        <Row className="mt-10">
          <Col xs={4}>
            <h4>Loan Amount</h4>
            <p>{loanRequest.amount}</p>
          </Col>
          <Col xs={4}>
            <h4>Loan Purpose</h4>
            <p>{loanRequest.purpose}</p>
          </Col>
          <Col xs={4}>
            <h4>Loan Term</h4>
            <p>{loanRequest.term}</p>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="flex-between group-title">
            <div>
              <h1>Your ground details</h1>
            </div>
            <p className="flex-self-center">2 of 7</p>
          </Col>
          <Col xs={12}>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="search-result-wrapper">
            <h4>Ground Address</h4>
            <p>{loanRequest.groundAddress}</p>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="flex-between group-title">
            <div>
              <h1>Your ground documents</h1>
            </div>
            <p className="flex-self-center">3 of 7</p>
          </Col>
          <Col xs={12}>
            <hr />
          </Col>
        </Row>
        <Row className="mt-10">
          <Col xs={6}>
            <h4>Document 1</h4>
            <p>
              <a
                href={`${config.p2pServerUrl}/document/download/${props.match.params.id}/doc1/${loanRequest.doc1}`}
                target="_blank"
              >
                {loanRequest.doc1}
              </a>
            </p>
          </Col>
          <Col xs={6}>
            <h4>Document 2</h4>
            <p>
              <a
                href={`${config.p2pServerUrl}/document/download/${props.match.params.id}/doc2/${loanRequest.doc2}`}
                target="_blank"
              >
                {loanRequest.doc2}
              </a>
            </p>
          </Col>
          <Col xs={6}>
            <h4>Document 3</h4>
            <p>
              <a
                href={`${config.p2pServerUrl}/document/download/${props.match.params.id}/doc3/${loanRequest.doc3}`}
                target="_blank"
              >
                {loanRequest.doc3}
              </a>
            </p>
          </Col>
          <Col xs={6}>
            <h4>Document 4</h4>
            <p>
              <a
                href={`${config.p2pServerUrl}/document/download/${props.match.params.id}/doc4/${loanRequest.doc4}`}
                target="_blank"
              >
                {loanRequest.doc4}
              </a>
            </p>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="flex-between group-title">
            <div>
              <h1>Your personal details</h1>
            </div>
            <p className="flex-self-center">4 of 7</p>
          </Col>
          <Col xs={12}>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <h4>First name</h4>
            <p>{loanRequest.firstName}</p>
          </Col>
          <Col xs={4}>
            <h4>Last name</h4>
            <p>{loanRequest.lastName}</p>
          </Col>
          <Col xs={4}>
            <h4>Gender</h4>
            <p>{loanRequest.gender}</p>
          </Col>
          <Col xs={4}>
            <h4>Marital Status</h4>
            <p>{loanRequest.maritalStatus}</p>
          </Col>
          <Col xs={4}>
            <h4>Number of dependants</h4>

            <p>{loanRequest.dependants}</p>
          </Col>
          <Col xs={4}>
            <h4>Date of birth</h4>
            <p>
              <Moment date={new Date(loanRequest.birthday)} format="YYYY-MM-DD" />
            </p>
          </Col>
          <Col xs={4}>
            <h4>Email</h4>
            <p>{loanRequest.email}</p>
          </Col>
          <Col xs={4}>
            <h4>Mobile phone</h4>

            <p>{loanRequest.phone}</p>
          </Col>
          <Col xs={4}>
            <h4>Address</h4>
            <p>{loanRequest.address}</p>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="flex-between group-title">
            <div>
              <h1>Your employment details</h1>
            </div>
            <p className="flex-self-center">5 of 7</p>
          </Col>
          <Col xs={12}>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <h4>Employment status</h4>
            <p>{loanRequest.employmentStatus}</p>
          </Col>
          <Col xs={4}>
            <h4>Length of employment status</h4>
            <Row className="two-cols">
              <Col xs={6}>
                <p>{loanRequest.employmentYear}</p>
              </Col>
              <Col xs={6}>
                <p>{loanRequest.employmentMonth}</p>
              </Col>
            </Row>
          </Col>
          <Col xs={4}>
            <h4>Pay frequency</h4>
            <p>{loanRequest.employmentPay}</p>
          </Col>
          <Col xs={4}>
            <h4>Employment industry</h4>
            <p>{loanRequest.employmentIndustry}</p>
          </Col>
          <Col xs={4}>
            <h4>Employer Name</h4>
            <p>{loanRequest.employerName}</p>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="flex-between group-title">
            <div>
              <h1>Your finances</h1>
            </div>
            <p className="flex-self-center">6 of 7</p>
          </Col>
          <Col xs={12}>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <h4>Net monthly income</h4>
            <p>{loanRequest.netIncome}</p>
          </Col>
          <Col xs={4}>
            <h4>Monthly rental/mortgage payments</h4>
            <p>{loanRequest.rentalPayments}</p>
          </Col>
          <Col xs={4}>
            <h4>Monthly loan payments</h4>
            <p>{loanRequest.monthlyLoan}</p>
          </Col>
          <Col xs={4}>
            <h4>Other expenses</h4>
            <p>{loanRequest.otherExpenses}</p>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>{errorMsg && errorMsg.length > 0 && <div className="error-feedback">{errorMsg}</div>}</Col>
        </Row>
        {/* <Row>
          <Col xs={12} className="text-right button-group">
            {isSubmitting && <i className="pi pi-spin pi-spinner" />}
            <Button disabled={isSubmitting} label="Submit Your Request" type="submit" />
          </Col>
        </Row> */}
      </Grid>
    </div>
  );
}
