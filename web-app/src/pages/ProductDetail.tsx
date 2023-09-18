import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import Carousel from 'nuka-carousel';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from 'primereact/button';

import { useUser } from '../store/hooks/hooks';
import { toFormattedNumber } from '../utilities/common';
import APIService from '../services/API';

import './ProductDetail.scss';

import BookmarkImg from '../statics/images/v3/products/ic-star.svg';
import ContentIcon from '../statics/images/v3/products/ic-dsc.png';
import NoticeIcon from '../statics/images/v3/products/ic-notice.svg';
import { diffDate } from '../utilities/date';
import { toFile } from '../utilities/changeFile';
import { locationMarker } from '../statics/svg/ic-map';
import { locationMarkerMobile } from '../statics/svg/ic-map-mobile';
import HeaderInfo from '../components/Detail/HeaderInfo';
import ProcessImg from '../components/Detail/ProcessImg';
import Schedule from '../components/Detail/Schedule';
import Highlights from '../components/Detail/Highlights';
import Outline from '../components/Detail/Outline';
import SalesAmount from '../components/Detail/SalesAmount';
import FloorPlan from '../components/Detail/FloorPlan';
import { isMobile, isBrowser } from 'react-device-detect';
const kakao = (window as any).kakao;

export interface ProductDetailProps
  extends RouteComponentProps<{
    id: string;
  }> {}

export default function ProductDetail(props: ProductDetailProps) {
  const [amount, setAmount] = useState<number>(0);
  const [isBookmarked, setBookmarked] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<string>('');
  const [investment, setInvestment] = useState<any>({});
  const [isEnded, setEnded] = useState<boolean>(false);
  const [businessType, setBusinessType] = useState<string>('');

  const [location, setLocation] = useState<any>({});
  const [mapState, setMapState] = useState<any>(null);
  const mapRef = useRef(null);

  const user = useUser();

  const getInvestment = async (id: string) => {
    const response = await APIService.getInvestment(id);
    const targetData = response.data[0];
    if (response.success && response.data.length > 0) {
      const diff = diffDate(targetData.end_date).diff;
      if (diff < 0) setEnded(true);

      const diffDay = diffDate(targetData.end_date).diffDay;
      const diffHour = diffDate(targetData.end_date).diffHour;
      const diffMin = diffDate(targetData.end_date).diffMin;

      const panel_image = (await toFile(targetData.panel_image))?.name;
      const expected_schedule_image = (await toFile(targetData.expected_schedule_image))?.name;
      const thumbnail1 = (await toFile(targetData.thumbnail1))?.name;
      const thumbnail2 = (await toFile(targetData.thumbnail2))?.name;
      const thumbnail3 = (await toFile(targetData.thumbnail3))?.name;
      const perspectiveDrawing1 = (await toFile(targetData.perspective_drawing_image1))?.name;
      const floorPlan = (await toFile(targetData.floor_plan_image))?.name;
      const perspectiveDrawing2 = (await toFile(targetData.perspective_drawing_image2))?.name;
      const perspectiveDrawing3 = (await toFile(targetData.perspective_drawing_image3))?.name;
      setInvestment({
        ...targetData,
        panel_image,
        expected_schedule_image,
        thumbnail1,
        thumbnail2,
        thumbnail3,
        floorPlan,
        perspectiveDrawing1,
        perspectiveDrawing2,
        perspectiveDrawing3,
        product_appeal: JSON.parse(targetData.product_appeal),
        business_information: JSON.parse(targetData.business_information),
        business_overview: JSON.parse(targetData.business_overview),
        business_analysis: JSON.parse(targetData.business_analysis),
        diffTimeDay: diff >= 0 ? `D-${diffDay}` : 'D-0',
        diffTimeMinute: `${diff >= 0 ? diffHour : 0}시간 ${diff >= 0 ? diffMin : 0}분`,
        start_date: moment(targetData.start_date).toDate(),
        end_date: moment(targetData.end_date).toDate(),
      });
      setBookmarked(!!targetData.is_bookmarked);
      setLocation({ latitude: targetData.latitude, longitude: targetData.longitude });
      setBusinessType(targetData.business_type);
    } else {
      props.history.push('/investment');
    }
  };

  const handleBookmarkClick = async () => {
    if (user.isLoggedIn()) {
      const result = await APIService.saveBookmark({ investment_id: props.match.params.id });
      if (result.success) {
        setBookmarked(!isBookmarked);
      }
    } else {
      props.history.push('/login');
    }
  };

  const handleBuyClick = async () => {
    if (!user.isLoggedIn()) {
      props.history.push('/login');
      return;
    }
    if (amount <= 0) {
      document.querySelector('.amount')?.scrollIntoView({
        behavior: 'smooth',
      });
      setAmountError('수량을 입력해주세요.');
    } else {
      // 약관
      localStorage.setItem(
        'bought',
        JSON.stringify({
          investment_id: investment.id,
          invest_id: investment.invest_id,
          title: investment.title,
          amount: amount,
          total_price: investment.won_per_account * amount,
        }),
      );

      props.history.push('/participate');
    }
  };

  const decreaseAmount = () => setAmount((val: number) => (val = val - 1));
  const increaseAmount = () => setAmount((val: number) => (val = val + 1));

  const curPosition = new kakao.maps.LatLng(location?.latitude, location?.longitude);
  const centerPosition = new kakao.maps.LatLng(location?.latitude, location?.longitude);

  const initMap = () => {
    const options = { center: centerPosition, level: 3 };
    const newMap = new kakao.maps.Map(mapRef.current, options);
    setMapState(newMap);
  };

  const drawCurLocation = () => {
    const overlay = new kakao.maps.CustomOverlay({
      position: curPosition,
      content: isMobile ? locationMarkerMobile : locationMarker,
    });
    overlay.setMap(mapState);
  };

  const getStatus = (start_date: Date, recruitment_complete: boolean) => {
    if (moment(start_date).valueOf() > moment().valueOf()) return '공개예정';
    if (moment(start_date).valueOf() <= moment().valueOf() && recruitment_complete === false) return '결성중';
    if (recruitment_complete === true) return '결성완료';
  };

  const handleEditClick = () => props.history.push('/edit-investment?id=' + props.match.params.id);

  useEffect(() => {
    initMap();
  }, [mapRef, location]);

  useEffect(() => {
    drawCurLocation();
  }, [mapState]);

  useEffect(() => {
    if (!isEmpty(props.match.params.id)) {
      getInvestment(props.match.params.id);
    } else {
      props.history.push('/investment');
    }
  }, [props.match.params.id]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="product-wrapper">
      <div className="product-container">
        {user.isAdmin() && (
          <div className="new-product">
            <Button label="Edit Product" onClick={handleEditClick} />
          </div>
        )}
        <div className="product-top">
          <div className="product-top__bg">
            <img
              src={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${investment.panel_image}`}
              alt="배경"
            />
          </div>
          <div className="product-top__cont">
            <div className="product-top__left">
              <div className="status">{getStatus(investment.start_date, investment.recruitment_complete)}</div>
              <div className="code">[{investment.invest_id}]</div>
              <div className="title">{investment.title}</div>

              {/* 헤더정보 */}
              <HeaderInfo type={businessType} data={investment.business_information} />
            </div>
            <div className="product-top__right">
              <ul>
                <li className="period">
                  <div className="period__day">
                    <span>종료일</span> {moment(investment.end_date).format('YYYY-MM-DD　hh:mm A')}
                  </div>
                  <div className="period__deadline">
                    <strong>
                      <span className="day">{investment.diffTimeDay}</span>
                      {investment.diffTimeMinute}
                    </strong>
                  </div>
                </li>
                <li className="remain">
                  <span className="total">총 참여권수 {toFormattedNumber(+investment.max_invest)}개 /</span>
                  <strong>
                    잔여수량 {toFormattedNumber(investment.max_invest - investment.current_invest - amount)} 개
                  </strong>
                </li>
                <li className="cost">{toFormattedNumber(+investment.won_per_account)}원 / 개</li>
                <li className="quantity">
                  <span className="text">수량</span>
                  <div className="quantity__range">
                    <input
                      role="spinbutton"
                      className="value"
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={toFormattedNumber(amount)}
                      onChange={(e) => {
                        e.preventDefault();
                        setAmount(+e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      className="btns btns-down"
                      title="decrease"
                      onClick={decreaseAmount}
                      disabled={amount <= 0}
                    >
                      -
                    </button>
                    <button
                      type="button"
                      className="btns btns-up"
                      title="increase"
                      onClick={increaseAmount}
                      disabled={investment.max_invest - investment.current_invest - amount <= 0}
                    >
                      +
                    </button>
                  </div>
                  {amountError && <div className="amount-error text-error">{amountError}</div>}
                  {investment.max_invest - investment.current_invest - amount < 0 && (
                    <div className="amount-error text-error">잔여 수량이 부족합니다.</div>
                  )}
                </li>
                <li className="cost">총 {toFormattedNumber(investment.won_per_account * amount)}원</li>
              </ul>
              <div className="button-group">
                {investment.has_invested ? (
                  <Button className="btn-2" label="참여완료" disabled={true} />
                ) : isEnded ? (
                  <Button className="btn-2" label="모집종료" disabled={true} />
                ) : (
                  <Button
                    className="btn-2"
                    label="참여"
                    disabled={amount <= 0 || investment.max_invest - investment.current_invest - amount < 0}
                    onClick={handleBuyClick}
                  />
                )}
                {user.isLoggedIn() ? (
                  <div className="bookmark-icon-wrapper" onClick={handleBookmarkClick}>
                    {isBookmarked ? (
                      <img className="bookmark bookmark--marked" src={BookmarkImg} alt="" />
                    ) : (
                      <img className="bookmark" src={BookmarkImg} alt="" />
                    )}
                  </div>
                ) : (
                  <div className="bookmark-icon-wrapper" onClick={handleBookmarkClick}>
                    <img className="bookmark" src={BookmarkImg} alt="" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <p className="cmt">* 참여결정 후 48시간 내에 참여금 미납입 시 참여가 취소 될 수 있습니다.</p>
        <div className="product-content-wrapper">
          <div className="product-summary">
            <div className="product-summary__image">
              <Carousel
                className="carousel"
                defaultControlsConfig={{
                  nextButtonStyle: {
                    display: 'none',
                  },
                  prevButtonStyle: {
                    display: 'none',
                  },
                  pagingDotsStyle: {
                    margin: '0px 4px',
                  },
                }}
              >
                <img
                  src={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${investment.thumbnail1}`}
                  alt="썸네일"
                  draggable="false"
                />
                {investment.thumbnail2 && (
                  <img
                    src={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${investment.thumbnail2}`}
                    alt="썸네일"
                    draggable="false"
                  />
                )}
                {investment.thumbnail3 && (
                  <img
                    src={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${investment.thumbnail3}`}
                    alt="썸네일"
                    draggable="false"
                  />
                )}
              </Carousel>
              <span className="guide">사진은 구매희망자의 이해를 돕기 위한 참고 이미지입니다.</span>
            </div>
            <ul className="product-summary__list">
              <li>
                <i>
                  <img src={ContentIcon} alt="" />
                </i>
                {investment.product_appeal?.first}
              </li>
              <li>
                <i>
                  <img src={ContentIcon} alt="" />
                </i>
                {investment.product_appeal?.second}
              </li>
              <li>
                <i>
                  <img src={ContentIcon} alt="" />
                </i>
                {investment.product_appeal?.third}
              </li>
            </ul>
          </div>

          {/* 진행과정 */}
          <ProcessImg type={businessType} />

          {/* 예상일정 */}
          {businessType !== '부동산' && <Schedule url={investment.expected_schedule_image} />}

          <div className="product-content">
            <h2 className="product-content__title">주요사항</h2>
            <div className="product-content__grid">
              {/* 주요사항 */}
              <Highlights type={businessType} data={investment.business_information} />
            </div>
          </div>

          <div className="product-content product-content__map">
            <h2 className="product-content__title">부지위치</h2>
            <div id="map1" className="map" style={{ width: '870px', height: '335px' }} ref={mapRef}></div>
          </div>

          {/* 주요사항 */}
          <div className="product-content">
            <h2 className="product-content__title">건축개요</h2>
            <Outline type={businessType} data={investment.business_overview} />
          </div>

          <div className="product-content">
            <h2 className="product-content__title">예상수지분석</h2>
            <div className="product-content__table product-content__table--type2">
              {/* 매출액 */}
              <SalesAmount type={businessType} data={investment.business_analysis} />

              <div className="table-area">
                <h3 className="table-area__title">지출금액</h3>
                <table>
                  {isBrowser && (
                    <colgroup>
                      <col style={{ width: '19%' }} />
                      <col style={{ width: '24%' }} />
                      <col style={{ width: '57%' }} />
                    </colgroup>
                  )}
                  {isMobile && (
                    <colgroup>
                      <col style={{ width: '25%' }} />
                      <col style={{ width: '32%' }} />
                      <col style={{ width: '43%' }} />
                    </colgroup>
                  )}
                  <thead>
                    <tr>
                      <th className="sbj">구분</th>
                      <th className="sbj">지출</th>
                      <th className="sbj">비고 (가정)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>매입비용</td>
                      <td className="right">
                        {toFormattedNumber(+investment.business_analysis?.expenditureAnalysis.landCost)}
                      </td>
                      <td className="left">{investment.business_analysis?.expenditureAnalysis.land}</td>
                    </tr>
                    {businessType !== '부동산' && (
                      <tr>
                        <td>공사비</td>
                        <td className="right">
                          {toFormattedNumber(+investment.business_analysis?.expenditureAnalysis.constructionCost)}
                        </td>
                        <td className="left">{investment.business_analysis?.expenditureAnalysis.construction}</td>
                      </tr>
                    )}
                    <tr>
                      <td>{businessType === '부동산' ? '토목비용' : '설계 / 감리'}</td>
                      <td className="right">
                        {toFormattedNumber(+investment.business_analysis?.expenditureAnalysis.designCost)}
                      </td>
                      <td className="left">{investment.business_analysis?.expenditureAnalysis.design}</td>
                    </tr>
                    <tr>
                      <td>제세비용</td>
                      <td className="right">
                        {toFormattedNumber(+investment.business_analysis?.expenditureAnalysis.taxCost)}
                      </td>
                      <td className="left">{investment.business_analysis?.expenditureAnalysis.tax}</td>
                    </tr>
                    <tr>
                      <td>사업추진비</td>
                      <td className="right">
                        {toFormattedNumber(+investment.business_analysis?.expenditureAnalysis.propelCost)}
                      </td>
                      <td className="left">{investment.business_analysis?.expenditureAnalysis.propel}</td>
                    </tr>
                    <tr>
                      <td>금융비용</td>
                      <td className="right">
                        {toFormattedNumber(+investment.business_analysis?.expenditureAnalysis.financeCost)}
                      </td>
                      <td className="left">{investment.business_analysis?.expenditureAnalysis.finance}</td>
                    </tr>
                    <tr className="cost">
                      <th className="sbj">총계</th>
                      <td className="total">
                        {toFormattedNumber(+investment.business_analysis?.expenditureAnalysis.totalCost)}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 평면도 */}
          {businessType !== '부동산' && <FloorPlan floorPlanUrl={investment.floorPlan} />}

          <div className="product-content">
            {businessType === '부동산' ? (
              <h2 className="product-content__title">현황사진</h2>
            ) : (
              <h2 className="product-content__title">투시도</h2>
            )}
            <div className="image-slide">
              <Carousel
                className="carousel"
                defaultControlsConfig={{
                  nextButtonStyle: {
                    backgroundColor: 'transparent',
                  },
                  prevButtonStyle: {
                    backgroundColor: 'transparent',
                  },
                  pagingDotsStyle: {
                    display: 'none',
                  },
                }}
              >
                {investment.perspectiveDrawing1 && (
                  <img
                    src={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${investment.perspectiveDrawing1}`}
                    alt="투시도"
                    draggable="false"
                  />
                )}
                {investment.perspectiveDrawing2 && (
                  <img
                    src={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${investment.perspectiveDrawing2}`}
                    alt="투시도"
                    draggable="false"
                  />
                )}
                {investment.perspectiveDrawing3 && (
                  <img
                    src={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${investment.perspectiveDrawing3}`}
                    alt="투시도"
                    draggable="false"
                  />
                )}
              </Carousel>
            </div>
          </div>

          <div className="product-content">
            <h2 className="product-content__title">추천 파트너사</h2>
            <ul className="product-content__list">
              {businessType !== '부동산' && (
                <li>
                  <strong>신탁사</strong>
                  <span>{investment.related_trust_company}</span>
                </li>
              )}

              <li>
                <strong>감정평가</strong>
                <span>{investment.related_appraisal}</span>
              </li>
              <li>
                <strong>회계법인</strong>
                <span>{investment.related_accounting}</span>
              </li>
              <li>
                <strong>법무법인</strong>
                <span>{investment.related_legal_affairs}</span>
              </li>
            </ul>
          </div>

          <div className="product-content product-content--notice">
            <h2 className="product-content__title">
              <img src={NoticeIcon} alt="" />
              유의사항
            </h2>
            <div className="product-content__notice">
              <p>
                온라인을 통한 프로젝트 참여는 특정 기관이나 인물의 권유 또는 강제 없이 이용자의 판단에 의해
                이루어집니다.
                <br />
                이용자의 결정, 착오 또는 과실로 인해 발생하는 모든 피해 또는 손실에 대한 책임은 이용자에게 귀속되므로
                각별한 주의가 필요하며
                {isBrowser && <br />} 이용자는 프로젝트 설명서 및 공지사항을 통해 프로젝트에 대한 정보를 정확히 확인 및
                파악한 후 참여여부를 신중히 결정하시기 {isBrowser && <br />}
                바랍니다. 당사는 선관주의의무에 입각하여 서비스를 제공하며, 프로젝트의 결과를 보장하거나 책임지지
                않습니다.
              </p>
            </div>
          </div>

          {/* <div className="product-btns">
            {investment.has_invested ? (
              <Button className="btn-2" label="참여완료" disabled={true} />
            ) : isEnded ? (
              <Button className="btn-2" label="모집종료" disabled={true} />
            ) : (
              <Button className="btn-2" label="모집참여" onClick={handleBuyClick} />
            )}
            <Button
              className={classnames('bookmark', { 'bookmark--marked': isBookmarked })}
              onClick={handleBookmarkClick}
            >
              <img src={BookmarkImg} alt="" />
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
