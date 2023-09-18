import React, { lazy, Suspense, useEffect, useState } from 'react';
import { RouteComponentProps, Switch, Route, Redirect } from 'react-router-dom';

import LoginRoute from './routes/LoginRoute';
import PrivateRoute from './routes/PrivateRoute';
import LogoutRoute from './routes/LogoutRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import { LoanDetailProps } from './pages/LoanDetail';
import { ProductDetailProps } from './pages/ProductDetail';
import { VoteResultProps } from './pages/admin/VoteResult';
import { EvidenceDataProps } from './pages/admin/EvidenceData';

import './DesktopApp.scss';
import { NewMyNoticeProps } from './pages/admin/NewInvestNotice';

const AboutUs = lazy(() => import('./pages/AboutUs'));
const Loan = lazy(() => import('./pages/Loan'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const DocumentApproval = lazy(() => import('./pages/admin/DocumentApproval'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const LoanDetail = lazy(() => import('./pages/LoanDetail'));
const Landing = lazy(() => import('./pages/Landing'));
const RegisterTerms = lazy(() => import('./pages/register/RegisterTerms'));
const RegisterIndividual = lazy(() => import('./pages/register/RegisterIndividual'));
const RegisterCorporate = lazy(() => import('./pages/register/RegisterCorporate'));
const RegisterSuccess = lazy(() => import('./pages/register/RegisterSuccess'));
const Investments = lazy(() => import('./pages/Investments'));
const Participate = lazy(() => import('./pages/Participate'));
const Policy = lazy(() => import('./pages/Policy'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Notice = lazy(() => import('./pages/Notice'));
const Vote = lazy(() => import('./pages/Vote'));
const UserGuide = lazy(() => import('./pages/UserGuide'));
const Support = lazy(() => import('./pages/Support'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const MyPage = lazy(() => import('./pages/my-pages/MyPage'));
const MyBookmarks = lazy(() => import('./pages/my-pages/MyBookmarks'));
const IndividualInfo = lazy(() => import('./pages/my-pages/IndividualInfo'));
const BusinessInfo = lazy(() => import('./pages/my-pages/BusinessInfo'));
const BuyAgreement = lazy(() => import('./pages/buy/BuyAgreement'));
const DepositNotice = lazy(() => import('./pages/buy/DepositNotice'));
const NewInvestment = lazy(() => import('./pages/admin/NewInvestment'));
const EditInvestment = lazy(() => import('./pages/admin/EditInvestment'));
const NewNotice = lazy(() => import('./pages/admin/NewNotice'));
const NewInvestNotice = lazy(() => import('./pages/admin/NewInvestNotice'));
const NewUserGuide = lazy(() => import('./pages/admin/NewUserGuide'));
const KakaoLogin = lazy(() => import('./pages/KakaoLogin'));
const NaverLogin = lazy(() => import('./pages/NaverLogin'));
const NewVote = lazy(() => import('./pages/admin/NewVote'));
const VoteResult = lazy(() => import('./pages/admin/VoteResult'));
const EvidenceData = lazy(() => import('./pages/admin/EvidenceData'));
const Nice = lazy(() => import('./pages/Nice'));

window.addEventListener('orientationchange', function () {
  // window.location.reload();
});

export default function DesktopApp() {
  const renderLandingPage = (props: RouteComponentProps) => {
    return <Landing {...props} />;
  };

  const renderLoan = (props: RouteComponentProps) => {
    return <Loan {...props} />;
  };

  const renderAboutUs = (props: RouteComponentProps) => {
    return <AboutUs {...props} />;
  };

  const renderInvestment = (props: RouteComponentProps) => {
    return <Investments {...props} />;
  };

  const renderMyPage = (props: RouteComponentProps) => {
    return <MyPage {...props} />;
  };

  const renderMyBookmarks = (props: RouteComponentProps) => {
    return <MyBookmarks {...props} />;
  };

  const renderIndividualInfo = (props: RouteComponentProps) => {
    return <IndividualInfo {...props} />;
  };

  const renderBusinessInfo = (props: RouteComponentProps) => {
    return <BusinessInfo {...props} />;
  };

  const renderLoanDetail = (props: LoanDetailProps) => {
    return <LoanDetail {...props} />;
  };

  const renderNotice = (props: RouteComponentProps) => {
    return <Notice {...props} />;
  };

  const renderVote = (props: RouteComponentProps) => {
    return <Vote {...props} />;
  };

  const renderProduct = (props: ProductDetailProps) => {
    return <ProductDetail {...props} />;
  };

  const renderParticipate = (props: RouteComponentProps) => {
    return <Participate {...props} />;
  };

  const renderPolicy = (props: RouteComponentProps) => {
    return <Policy {...props} />;
  };

  const renderBuyAgreement = (props: RouteComponentProps) => {
    return <BuyAgreement {...props} />;
  };

  const renderDepositNotice = (props: RouteComponentProps) => {
    return <DepositNotice {...props} />;
  };

  const renderUserManagement = (props: RouteComponentProps) => {
    return <UserManagement {...props} />;
  };

  const renderNewInvestment = (props: RouteComponentProps) => {
    return <NewInvestment {...props} />;
  };
  const renderEditInvestment = (props: RouteComponentProps) => {
    return <EditInvestment {...props} />;
  };

  const renderNewNotice = (props: RouteComponentProps) => {
    return <NewNotice {...props} />;
  };

  const renderNewInvestNotice = (props: NewMyNoticeProps) => {
    return <NewInvestNotice {...props} />;
  };

  const renderNewVote = (props: RouteComponentProps) => {
    return <NewVote {...props} />;
  };

  const renderVoteResult = (props: VoteResultProps) => {
    return <VoteResult {...props} />;
  };

  const renderEvidenceData = (props: EvidenceDataProps) => {
    return <EvidenceData {...props} />;
  };

  const renderNewUserGuide = (props: RouteComponentProps) => {
    return <NewUserGuide {...props} />;
  };

  const renderDocumentApproval = (props: RouteComponentProps) => {
    return <DocumentApproval {...props} />;
  };

  const renderSupportPage = (props: RouteComponentProps) => {
    return <Support {...props} />;
  };

  const renderSitemap = (props: RouteComponentProps) => {
    return <Sitemap {...props} />;
  };

  const renderUserGuidePage = (props: RouteComponentProps) => {
    return <UserGuide {...props} />;
  };

  const renderForgotPassword = (props: RouteComponentProps) => {
    return <ForgotPassword {...props} />;
  };

  const renderResetPassword = (props: RouteComponentProps) => {
    return <ResetPassword {...props} />;
  };

  // const renderRegister = (props: RouteComponentProps) => {
  //   return <Register {...props} />;
  // };

  const renderRegisterTerms = (props: RouteComponentProps) => {
    return <RegisterTerms {...props} />;
  };

  const renderRegisterInformation = (props: RouteComponentProps) => {
    return <RegisterIndividual {...props} />;
  };

  const renderRegisterCorporate = (props: RouteComponentProps) => {
    return <RegisterCorporate {...props} />;
  };

  const renderRegisterSuccess = (props: RouteComponentProps) => {
    return <RegisterSuccess {...props} />;
  };

  const renderPageNotFound = () => {
    return <PageNotFound />;
  };

  const renderErrorPage = (routeProps: RouteComponentProps) => {
    return <ErrorPage error={routeProps.location.state} />;
  };

  const redirectToPageNotFound = () => {
    return <Redirect to="/page-not-found" />;
  };

  const renderKakaoLogin = (props: RouteComponentProps) => {
    return <KakaoLogin {...props} />;
  };

  const renderNaverLogin = (props: RouteComponentProps) => {
    return <NaverLogin {...props} />;
  };

  const renderNice = (props: RouteComponentProps) => {
    return <Nice {...props} />;
  };

  const [btnStatus, setBtnStatus] = useState(false);
  const [btnPosition, setBtnPosition] = useState(false);
  useEffect(() => {
    const handleFollow = () => {
      const pageHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
      );
      if (window.scrollY > 140) {
        setBtnStatus(true);
        // const footer = document.querySelector('.footer');
        // const footStartPos = footer.getBoundingClientRect().y;

        if (window.innerHeight + window.scrollY >= pageHeight - 299 + 93 + 20) {
          setBtnPosition(false);
        } else {
          setBtnPosition(true);
        }
      } else {
        setBtnStatus(false);
      }
    };
    const watch = () => {
      window.addEventListener('scroll', handleFollow);
    };
    watch();
    return () => {
      window.removeEventListener('scroll', handleFollow);
    };
  });

  const moveTopPage = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  return (
    <div className="wrapper">
      <div id="content">
        <Header />
        <Suspense
          fallback={
            <div className="common-loading">
              <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
            </div>
          }
        >
          <Switch>
            <LoginRoute path="/login" exact />
            <LoginRoute path="/login/kakao/callback" render={renderKakaoLogin} exact />
            <LoginRoute path="/login/naver/callback" render={renderNaverLogin} exact />
            <LogoutRoute path="/logout" />
            <LoginRoute path="/forgot-password" render={renderForgotPassword} />
            <LoginRoute path="/reset-password" render={renderResetPassword} />
            <LoginRoute path="/register-terms" render={renderRegisterTerms} />
            <LoginRoute path="/register-individual" render={renderRegisterInformation} />
            <LoginRoute path="/register-corporate" render={renderRegisterCorporate} />
            <LoginRoute path="/register-success" render={renderRegisterSuccess} />
            <Route path="/" exact={true} render={renderLandingPage} />
            <Route path="/aboutus" exact={true} render={renderAboutUs} />
            <Route path="/investment" exact={true} render={renderInvestment} />
            <Route path="/products/:id" exact={true} render={renderProduct} />
            <Route path="/buy-agreement" exact={true} render={renderBuyAgreement} />
            <Route path="/deposit-notice" exact={true} render={renderDepositNotice} />
            <Route path="/loan-request" exact={true} render={renderLoan} />
            <Route path="/my-page" exact={true} render={renderMyPage} />
            <Route path="/bookmarks" exact={true} render={renderMyBookmarks} />
            <Route path="/individual-info" exact={true} render={renderIndividualInfo} />
            <Route path="/business-info" exact={true} render={renderBusinessInfo} />
            <Route path="/notice" exact={true} render={renderNotice} />
            <Route path="/page-not-found" render={renderPageNotFound} />
            <Route path="/participate" exact={true} render={renderParticipate} />
            <Route path="/policy" exact={true} render={renderPolicy} />
            <Route path="/error" render={renderErrorPage} />
            <Route path="/result/:id" render={renderLoanDetail} />
            <Route path="/support" render={renderSupportPage} />
            <Route path="/sitemap" exact={true} render={renderSitemap} />
            <Route path="/user-guide" render={renderUserGuidePage} />
            <Route path="/vote" render={renderVote} />
            <Route path="/nice" render={renderNice} />
            <PrivateRoute path="/new-investment" render={renderNewInvestment} />
            <PrivateRoute path="/edit-investment" render={renderEditInvestment} />
            <PrivateRoute path="/new-user-guide" render={renderNewUserGuide} />
            <PrivateRoute path="/new-notice" exact={true} render={renderNewNotice} />
            <PrivateRoute path="/new-my-notice/:invest_id" exact={true} render={renderNewInvestNotice} />
            <PrivateRoute path="/new-vote" exact={true} render={renderNewVote} />
            <PrivateRoute path="/vote-result/:id/:invest_id/:masked" exact={true} render={renderVoteResult} />
            <PrivateRoute path="/evidence-data/:id/:invest_id/:masked" exact={true} render={renderEvidenceData} />
            <PrivateRoute path="/users-management" render={renderUserManagement} />
            <PrivateRoute path="/documents" render={renderDocumentApproval} />
            <Route path="*" render={redirectToPageNotFound} />
          </Switch>
          {btnStatus && (
            <button onClick={moveTopPage} className={btnPosition ? 'content-top content-top--fix' : 'content-top'}>
              <span className="blind">TOP</span>
            </button>
          )}
        </Suspense>
        <Footer />
      </div>
    </div>
  );
}
