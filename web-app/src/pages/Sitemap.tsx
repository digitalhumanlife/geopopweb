import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import './Sitemap.scss';

export default function Sitemap(props: RouteComponentProps) {
  return (
    <div className="sitemap-wrapper">
      <div className="common-header">
        <h1>사이트맵</h1>
      </div>
      <div className="sitemap-container">
        <div className="sitemap-grid">
          <div className="grid-panel">
            <h2 className="subject">프로젝트</h2>
            <ul>
              <li>
                <Link to="/investment?status=예정">공개예정</Link>
              </li>
              <li>
                <Link to="/investment?status=진행중">결성중</Link>
              </li>
              <li>
                <Link to="/investment?status=완료">결성완료</Link>
              </li>
            </ul>
          </div>
          <div className="grid-panel">
            <h2 className="subject">About US</h2>
            <ul>
              <li>
                <Link to="/aboutus?status=geopop">지오팝</Link>
              </li>
              <li>
                <Link to="/aboutus?status=gc">그라운드컨트롤</Link>
              </li>
            </ul>
          </div>
          <div className="grid-panel">
            <h2 className="subject">고객센터</h2>
            <ul>
              <li>
                <Link to="/notice">공지사항</Link>
              </li>
              <li>
                <Link to="/user-guide">자주 하는 질문</Link>
              </li>
              <li>
                <Link to="/support">1:1 문의</Link>
              </li>
            </ul>
          </div>
          <div className="grid-panel">
            <h2 className="subject">GeoPop 정책</h2>
            <ul>
              <li>
                <HashLink smooth to="/policy#1">
                  사이트이용약관
                </HashLink>
              </li>
              <li>
                <HashLink smooth to="/policy#2">
                  프로젝트참여약관
                </HashLink>
              </li>
              <li>
                <HashLink smooth to="/policy#3">
                  개인정보처리방침
                </HashLink>
              </li>
            </ul>
          </div>
          <div className="grid-panel">
            <h2 className="subject">Services</h2>
            <ul>
              <li>
                <Link to="/login">로그인</Link>
              </li>
              <li>
                <Link to="/register-terms">회원가입</Link>
              </li>
              <li>
                <Link to="/sitemap">사이트맵</Link>
              </li>
            </ul>
          </div>
          <div className="grid-panel">
            <h2 className="subject">SNS</h2>
            <ul>
              <li>
                <a href="https://www.instagram.com/geopopkr/" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/geopopkr/" target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://blog.naver.com/geopop_gc" target="_blank" rel="noreferrer">
                  Blog
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@groundcontrol_kr" target="_blank" rel="noreferrer">
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C%EC%BB%A8%ED%8A%B8%EB%A1%A4-groundcontrol-1bba47244/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
