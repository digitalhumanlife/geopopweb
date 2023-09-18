import React, { useEffect, useState, useRef, useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SelectButton } from 'primereact/selectbutton';
import qs from 'query-string';

import './AboutUs.scss';
import Aboutlogo from '../statics/images/v3/common/logo.svg';
import TitleAbout from '../statics/images/v3/bg-aboutus.jpg';
import AboutGeopop from '../statics/images/v3/about/diagram.png';
import AboutGcLogo from '../statics/images/v3/about/logo_GC.png';
import AboutGC from '../statics/images/v3/about/gc_img.jpg';
import AboutGCMob from '../statics/images/v3/about/gc_img_m.png';
import { isBrowser, isMobile } from 'react-device-detect';
import { throttle } from 'lodash';

const gcLabel = isBrowser ? '그라운드컨트롤' : '그라운드 컨트롤';

const TAB_OPTIONS: any[] = [
  { label: '지오팝', value: 'geopop' },
  { label: gcLabel, value: 'gc' },
];

export default function AboutUs(props: RouteComponentProps) {
  const query: any = qs.parse(props.location.search);
  const [tab, setTab] = useState<string>(TAB_OPTIONS[0].value);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const targetRef = useRef(null);

  const handleTabChange = ({ value, videoWidth = 0 }: any) => {
    if (value === null) return;
    setIsClicked(() => true);
    setTab(value);

    const tabID = document.getElementById(value) as HTMLElement;
    const yOffset = 0;
    const y = tabID.getBoundingClientRect().top + window.pageYOffset + yOffset + videoWidth;
    window.scrollTo({ top: y - 60, behavior: 'smooth' });

    setTimeout(() => {
      setIsClicked(() => false);
    }, 500);
  };

  const handleFollow = useMemo(
    () =>
      throttle(() => {
        if (isClicked) return;
        if (window.scrollY > (isBrowser ? 1300 : 1400)) {
          setTab('gc');
        } else {
          setTab('geopop');
        }
      }, 300),
    [isClicked],
  );

  useEffect(() => {
    const { status } = query;
    if (!status) return;

    if (status) handleTabChange({ value: status });
  }, [query.status]);

  useEffect(() => {
    const { status } = query;
    if (!status) return;

    if (status === 'gc' && isMobile) handleTabChange({ value: status, videoWidth: 400 });
    else handleTabChange({ value: status });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleFollow);
    return () => {
      window.removeEventListener('scroll', handleFollow);
    };
  });

  return (
    <div className="about-wrapper" ref={targetRef}>
      <div className="common-header">
        <img src={TitleAbout} alt="" />
        <h1>About Us</h1>
      </div>

      <div className="about-tab">
        <SelectButton value={tab} options={TAB_OPTIONS} onChange={handleTabChange}></SelectButton>
      </div>

      <section className="about-tabpanel" id="geopop">
        <h2 className="about-title">지오팝</h2>
        <div className="about-tabpanel__grid">
          <div className="grid-left">
            <img src={AboutGeopop} alt="" />
          </div>
          <div className="grid-right">
            <img src={Aboutlogo} alt="" />
            <p>
              ‘GeoPop(지오팝)’은
              <br />
              부동산 개발 프로젝트에 관심이 있는 시장 참여자들의 편의를 위해 {isBrowser && <br />}㈜그라운드컨트롤이
              제작한 {isMobile && <br />}
              <mark>부동산 개발 커뮤니티 플랫폼</mark>입니다.
            </p>
            <p>
              “부동산 개발업”은 부동산에 새 생명을 불어넣는 생산활동의 중요한 시작점이자 매력적인 기대수익 가능성을 품은
              경제 활동인 동시에, 높은 수준의 전문성과 자금력, 인내심을 요구하는 등 진입장벽과 위험부담이 높아 오랜 기간
              일반 개인이 참여하기 어려운 전문가들의 영역으로 받아들여져 왔습니다.
            </p>
            <p>
              ‘GeoPop’은 효율적인 정보공유와 체계적인 절차간편화 지원을 통해 부동산 단순매매에 국한되어 임대수입 또는
              지가상승에 의존하는 대다수 시장 참여자 들에게 부동산 개발의 특별한 매력과 소중한 경험을 한층 수월하고
              안정적으로 제공하고자 합니다.
            </p>
            <p>
              다양한 부동산 데이터에 기반한 부동산 개발 프로젝트를 소개하고 공통 관심사를 가진 사용자들이 공동체를
              형성하고 원활한 프로젝트 진행을 할 수 있도록 집합 운영관리 부분에 대한 편의장치를 기술 지원합니다. 모든
              프로젝트는 참여자들로 구성 및 결성된 집합의 결정, 즉 참여 구성원의 독립적인 투표와 공시에 의한 일련의
              과정을 거쳐 투명하게 전개됩니다.
            </p>
            <p>
              프로젝트의 안전성을 강화하고 참여자의 피해가능성을 최소화하기 위해 부동산 신탁등기를 통한 관리를 적극
              권장하고, 이를 위한 신탁사 외에도 검증된 건축사, 건설사, 법무법인, 세무회계법인 등을 추천드립니다.
            </p>
            <p>부동산 개발 프로젝트의 색다른 경험을 {isMobile && <br />}'GeoPop'과 함께 하시기 바랍니다.</p>
          </div>
        </div>
      </section>

      <div className="about-tabpanel-wrap" id="video" style={{ width: '100%', height: '100%' }}>
        <section className="about-tabpanel">
          <h2 className="about-title">소개영상</h2>
          <div className="about-video">
            <iframe
              style={{ width: '608px', height: '342px' }}
              src="https://www.youtube.com/embed/0Bh8b4ObWWI"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      </div>

      <section className="about-tabpanel" id="gc">
        <h2 className="about-title">그라운드컨트롤</h2>
        <div className="about-tabpanel__grid">
          <div className="grid-left">
            <img src={AboutGcLogo} alt="" />
            <p>
              ㈜그라운드컨트롤은
              <br />
              “공익과 사익의 동행”이란 꿈을 꿉니다.
            </p>
            <p>
              공공의 이익을 도모하고 사회적 가치를 내재한 부동산 개발사업의 기회가 보다 쉽고 투명하고 공정하게 전파될 수
              있는 환경을 만들기 위해 건축, 금융, IT 등 다양한 경험을 가진 일꾼들이 모였습니다.
            </p>
            <p>
              ㈜그라운드컨트롤은 방대한 양의 다양한 부동산 관련 데이터를 꾸준히 수집· 가공하여 보유 중이며, 최적의
              부동산 개발 프로젝트를 선별하기 위해 부동산의 현재 및 미래 가치를 정확하고 효과적으로 판단하는 알고리즘을
              개발, 지속적 으로 발전시켜 가고 있습니다.
            </p>
            <p>고객 모두가 신뢰하고 만족하는 최고의 종합 부동산 정보 제공 플랫폼 회사가 되도록 항상 노력하겠습니다.</p>
          </div>
          <div className="grid-right">
            {isBrowser && <img src={AboutGC} alt="" />}
            {isMobile && <img src={AboutGCMob} alt="" />}
          </div>
        </div>
      </section>
      <div className="about-tabpanel-wrap" id="history">
        <section className="about-tabpanel">
          <h2 className="about-title">연혁</h2>
          <div className="about-history">
            <div className="history-table">
              <div className="year">
                <mark>2022</mark>
                <ul>
                  <li>
                    <strong className="month">08</strong>
                    <div className="cont">
                      <strong>기업부설연구소 설립</strong>
                      {isMobile && <br />}(인증 한국산업기술진흥협회)
                    </div>
                  </li>
                  <li>
                    <strong className="month">07</strong>
                    <div className="cont">
                      <strong>22년 대구TIPS프로그램 선정</strong> {isMobile && <br />}(주관 대구창조경제혁신센터)
                    </div>
                  </li>
                  <li>
                    <strong className="month">06</strong>
                    <div className="cont">
                      <strong>K-Global 액셀러레이팅 {isMobile && <br />}프로그램 선정</strong> (주최 과학기술정보통신부)
                    </div>
                  </li>
                  <li>
                    <strong className="month">05</strong>
                    <div className="cont">
                      <strong>팁스(TIPS) 창업성장기술개발사업 {isMobile && <br />}선정</strong>(주관 중소벤처기업부)
                    </div>
                  </li>
                  <li>
                    <strong className="month">02</strong>
                    <div className="cont">
                      <strong>시드투자 유치 (VC)</strong>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="year">
                <mark>2020</mark>
                <ul>
                  <li>
                    <strong className="month">03</strong>
                    <div className="cont">
                      <strong>기술보증기금 신기술사업 선정 및 {isMobile && <br />}벤처기업인증</strong>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="year">
                <mark>2019</mark>
                <ul>
                  <li>
                    <strong className="month">08</strong>
                    <div className="cont">
                      <strong>법인 설립</strong>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
