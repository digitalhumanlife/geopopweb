import React from 'react';

import ErrorIcon from '../statics/images/gc/warning.svg';
import './PageNotFound.scss';

interface ErrorPageProps {
  error: any;
}

export default function ErrorPage(props: ErrorPageProps) {
  return (
    <div className="page-not-found error-page">
      <div className="content">
        <img className="error-img" src={ErrorIcon} alt="Error" />
        <span className="text">{props.error.message}</span>
        <a href="/trade" className="go-back-home">
          <span>Go back home</span>
        </a>
      </div>
    </div>
  );
}
