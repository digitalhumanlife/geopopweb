import React from 'react';

import PageNotFoundIcon from '../statics/images/gc/page_not_found.png';

import './PageNotFound.scss';

export default function PageNotFound() {
  return (
    <div className="page-not-found">
      <div>
        <img className="page-not-found-img" src={PageNotFoundIcon} alt="Page Not Found" />
      </div>
      <h1 className="text">Sorry, page not found</h1>
      <a href="/" className="go-back-home">
        <span>Go back home</span>
      </a>
    </div>
  );
}
