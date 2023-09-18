import React, { useState } from 'react';
import { isBrowser } from 'react-device-detect';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import ConfirmationDialog from '../components/ConfirmationDialog';

import FooterLogo from '../statics/images/v2/footer/footer-logo.png';
import FooterInstagram from '../statics/images/v3/common/instagram.svg';
import FooterFacebook from '../statics/images/v3/common/facebook.svg';
import FooterBlog from '../statics/images/v3/common/blog.svg';
import FooterYoutube from '../statics/images/v3/common/youtube.svg';
import FooterLinkedin from '../statics/images/v3/common/linkedin.svg';

import './Footer.scss';

export default function Footer() {
  const [visibleConfirmShow, setVisibleConfirmShow] = useState<boolean>(false);

  const handleConfirmDialogAccept = () => {
    setVisibleConfirmShow(true);
  };

  const handleConfirmDialogDismiss = () => {
    setVisibleConfirmShow(false);
  };

  return (
    <>
      <div className="footer-wrapper" id="footer">
        <div className="footer-content">
          <div className="footer-title">
            <div>
              <HashLink smooth to="/policy#1">
                사이트이용약관
              </HashLink>
            </div>
            <div>
              <HashLink smooth to="/policy#2">
                프로젝트참여약관
              </HashLink>
            </div>
            <div>
              <HashLink smooth to="/policy#3">
                개인정보처리방침
              </HashLink>
            </div>
            <div>
              <Link to="/sitemap">사이트맵</Link>
            </div>
          </div>
          <div className="footer-content-wrapper">
            <div className="logo-group">
              <div>
                <img src={FooterLogo} alt="" />
              </div>
            </div>
            <div className="footer-lang">
              <a role="button">한국어</a>
              <a href="https://en.geopop.co.kr" target="_blank">
                English
              </a>
            </div>
            <div className="footer-text">
              <dl>
                <dt className="title-2">COMPANY</dt>
                <dd className="company">
                  <span>(주) 그라운드컨트롤</span>
                  <span>대표이사 : 서태식</span>
                  <span>사업자등록번호 : 782-87-01418</span>
                </dd>
              </dl>
              <dl>
                <dt className="title-2">CONTACT</dt>
                <dd>
                  <p>[본사] 42989 대구광역시 달성군 유가읍 현풍로 47길 86-2, 1층 102호</p>
                  <p>[서울] 06247 서울특별시 강남구 역삼로 169, 2층 A7호</p>
                  <p>
                    <span>070 - 4242 - 6767</span>{' '}
                    <a href="mailto:support@groundcontrol.co.kr">support@groundcontrol.co.kr</a>
                  </p>
                  <p>
                    <span>평일 10 : 00 ~ 18 : 00</span>
                    <span>점심시간 12 : 00 ~ 13 : 00</span>
                  </p>
                </dd>
              </dl>
            </div>
            <div className="footer-sns">
              <a href="https://www.instagram.com/geopopkr/" title="instagram" target="_blank" rel="noreferrer">
                {isBrowser && <img src={FooterInstagram} alt="" />}
              </a>
              <a
                href="https://www.facebook.com/geopopkr/"
                className="facebook"
                title="facebook"
                target="_blank"
                rel="noreferrer"
              >
                {isBrowser && <img src={FooterFacebook} alt="" />}
              </a>
              <a href="https://blog.naver.com/geopop_gc" className="blog" title="blog" target="_blank" rel="noreferrer">
                {isBrowser && <img src={FooterBlog} alt="" />}
              </a>
              <a href="https://www.youtube.com/@groundcontrol_kr" title="Youtube" target="_blank" rel="noreferrer">
                {isBrowser && <img src={FooterYoutube} alt="" />}
              </a>
              <a
                href="https://www.linkedin.com/in/%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C%EC%BB%A8%ED%8A%B8%EB%A1%A4-groundcontrol-1bba47244/"
                title="LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                {isBrowser && <img src={FooterLinkedin} alt="" />}
              </a>
            </div>
          </div>
          <div className="footer-copyright">Copyright © GEOPOP All Rights Reserved.</div>
        </div>
        <ConfirmationDialog
          header="알림"
          visible={visibleConfirmShow}
          acceptText="닫기"
          onAccept={handleConfirmDialogAccept}
          onDismiss={handleConfirmDialogDismiss}
          messageAlignment="center"
          message="해당 서비스는 준비중입니다."
        />
      </div>
    </>
  );
}
