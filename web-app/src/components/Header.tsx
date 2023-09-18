import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';

import { useUser } from '../store/hooks/hooks';

import './Header.scss';
import Logo from '../statics/images/v2/bite-logo-indigo.png';

function Header(props: RouteComponentProps) {
  const [isShowSidebar, setShowSidebar] = useState<boolean>(false);

  const user = useUser();
  const handleRegisterClick = () => {
    props.history.push('/register-terms');
  };

  const [isLandingPage, setIsLandingPage] = useState<boolean>();

  const handleSideMenu = (name: string) => {
    const elNames = document.querySelectorAll('.mobile-menu-items button.menu-item__sbj');
    elNames.forEach((elName) => {
      const elId = elName.getAttribute('id');
      if (elId === name) {
        if (elName.className === 'menu-item__sbj menu-item__sbj--show') {
          elName.classList.remove('menu-item__sbj--show');
        } else {
          elName.classList.add('menu-item__sbj--show');
        }
      } else {
        elName.classList.remove('menu-item__sbj--show');
      }
    });
  };

  const goBack = () => {
    props.history.goBack();
  };

  useEffect(() => {
    setIsLandingPage(window.location.pathname === '/');
  });

  return (
    <div className="header-wrapper">
      <div className="header">
        {!isLandingPage && (
          <Button className="d-block d-sm-none header-previous" onClick={goBack}>
            previous
          </Button>
        )}
        <Link to="/" className="h-full">
          <img className="logo h-full" src={Logo} alt="" />
        </Link>

        <div className="menu-items d-none d-sm-flex">
          <div className="menu-item investment-menu">
            <Link to="/investment?status=진행중">프로젝트</Link>
            <div className="menu-sub-item">
              <div
                className={classnames('sub-menu-items', {
                  logged: user.isLoggedIn(),
                })}
              >
                <Link to="/investment?status=예정">공개예정</Link>
                <Link to="/investment?status=진행중">결성중</Link>
                <Link to="/investment?status=완료">결성완료</Link>
              </div>
            </div>
          </div>
          <div className="menu-item aboutus-menu">
            <Link to="/aboutus#root">About Us</Link>
            <div className="menu-sub-item">
              <div
                className={classnames('sub-menu-items', {
                  logged: user.isLoggedIn(),
                })}
              >
                <Link to="/aboutus?status=geopop">지오팝</Link>
                <Link to="/aboutus?status=gc">그라운드컨트롤</Link>
              </div>
            </div>
          </div>
          <div className="menu-item support-menu">
            <Link to="/notice">고객센터</Link>
            <div className="menu-sub-item">
              <div
                className={classnames('sub-menu-items', {
                  logged: user.isLoggedIn(),
                })}
              >
                <Link to="/notice">공지사항</Link>
                <Link to="/user-guide" style={{ width: '90px' }}>
                  자주 하는 질문
                </Link>
                <Link to="/support">1:1 문의</Link>
              </div>
            </div>
          </div>
          <div className="split-menu"></div>
          <div className="menu-items">
            {!user.isLoggedIn() ? (
              <Link to="/login" className="login-item login-link parent-menu-item-2">
                로그인
              </Link>
            ) : (
              <>
                <Link to="/logout" className="login-item login-link parent-menu-item-2">
                  로그아웃
                </Link>
              </>
            )}
            {!user.isLoggedIn() ? (
              <button type="button" className="login-item login-link parent-menu-item-2" onClick={handleRegisterClick}>
                회원가입
              </button>
            ) : (
              <>
                <div className="menu-item logged-in-menu">
                  <div className="login-item parent-menu-item-2">
                    <Link to="/my-page" className="mypage">
                      마이페이지
                    </Link>
                  </div>
                  <div className="menu-sub-item">
                    <div className="sub-menu-items">
                      <Link to="/my-page" style={{ width: 'auto' }}>
                        나의프로젝트
                      </Link>
                      <Link to="/bookmarks">관심프로젝트</Link>
                      <Link to={user.type === 'individual' ? '/individual-info' : '/business-info'}>회원정보</Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="d-block d-sm-none">
          <Button className="menu-btn" icon="pi pi-bars" onClick={(e) => setShowSidebar(true)} />
          <Sidebar visible={isShowSidebar} position="right" onHide={() => setShowSidebar(false)}>
            <div className="mobile-menu-items">
              <div className="sidebar-login">
                {!user.isLoggedIn() ? (
                  <Link to="/login" className="sidebar-login__btn" onClick={(e) => setShowSidebar(false)}>
                    로그인
                  </Link>
                ) : (
                  <>
                    <Link to="/logout" className="sidebar-login__btn" onClick={(e) => setShowSidebar(false)}>
                      로그아웃
                    </Link>
                  </>
                )}
                |
                {!user.isLoggedIn() ? (
                  <Link to="/register-terms" className="sidebar-login__btn" onClick={(e) => setShowSidebar(false)}>
                    회원가입
                  </Link>
                ) : (
                  <>
                    <Link to="/my-page" className="sidebar-login__btn" onClick={(e) => setShowSidebar(false)}>
                      마이페이지
                    </Link>
                  </>
                )}
              </div>
              <div className="menu-item">
                <button
                  type="button"
                  id="menuProject"
                  className="menu-item__sbj"
                  onClick={() => handleSideMenu('menuProject')}
                >
                  프로젝트
                </button>

                <div className="menu-item__list">
                  <Link to="/investment?status=예정" onClick={(e) => setShowSidebar(false)}>
                    공개예정
                  </Link>
                  <Link to="/investment?status=진행중" onClick={(e) => setShowSidebar(false)}>
                    결성중
                  </Link>
                  <Link to="/investment?status=완료" onClick={(e) => setShowSidebar(false)}>
                    결성완료
                  </Link>
                </div>
              </div>
              <div className="menu-item">
                <button
                  type="button"
                  id="menuAbout"
                  className="menu-item__sbj"
                  onClick={() => handleSideMenu('menuAbout')}
                >
                  About Us
                </button>
                <div className="menu-item__list">
                  <Link to="/aboutus?status=geopop" onClick={() => setShowSidebar(false)}>
                    지오팝
                  </Link>
                  <Link to="/aboutus?status=gc" onClick={() => setShowSidebar(false)}>
                    그라운드컨트롤
                  </Link>
                </div>
              </div>
              <div className="menu-item">
                <button type="button" id="menuCS" className="menu-item__sbj" onClick={() => handleSideMenu('menuCS')}>
                  고객센터
                </button>
                <div className="menu-item__list">
                  <Link to="/notice" onClick={(e) => setShowSidebar(false)}>
                    공지사항
                  </Link>
                  <Link to="/user-guide" onClick={(e) => setShowSidebar(false)}>
                    자주 하는 질문
                  </Link>
                  <Link to="/support" onClick={(e) => setShowSidebar(false)}>
                    1 : 1 문의
                  </Link>
                </div>
              </div>
              {/* {user.isLoggedIn() && (
                <div className="menu-item" onClick={(e) => setShowSidebar(false)}>
                  <div className="menu-item__sbj">마이페이지</div>
                  <Link to="/my-page" onClick={(e) => setShowSidebar(false)}>
                    나의프로젝트
                  </Link>
                  <Link to="/bookmarks" onClick={(e) => setShowSidebar(false)}>
                    관심프로젝트
                  </Link>
                  <Link to="/my-info" onClick={(e) => setShowSidebar(false)}>
                    회원정보
                  </Link>
                </div>
              )} */}
            </div>
          </Sidebar>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Header);
