import React from 'react';

import Logo from '../statics/images/v2/bite-logo-indigo.png';
import bgAbout from '../statics/images/v3/bg-aboutus.jpg';
import './SoonPage.scss';

export default function SoonPage() {
  return (
    <div className="soon-wrap">
      <main>
        <div className="soon-bg">
          <img src={bgAbout} alt="Logo" />
        </div>
        <span className="soon-logo">
          <img className="error-img" src={Logo} alt="Logo" />
        </span>
        <div className="soon-box">
          <span className="soon-box__text">COMING SOON</span>
        </div>
      </main>
    </div>
  );
}
