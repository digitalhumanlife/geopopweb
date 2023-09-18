import moment from 'moment';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import InvestmentItem from '../components/InvestmentItem';
import APIService from '../services/API';
import { toFormattedNumber } from '../utilities/common';

import './Landing.scss';

import Part2Img3 from '../statics/images/v2/part2/part2_3.png';

import ContactContract from '../statics/images/v3/main/ic-contract1.png';
import ContactContract2 from '../statics/images/v3/main/ic-contract2.png';
import ContactContract3 from '../statics/images/v3/main/ic-contract3.png';
import ContactContract4 from '../statics/images/v3/main/ic-contract4.png';

// import MainImage from '../statics/images/v3/main/img-main.jpg';
// import MainImageMobile from '../statics/images/v3/main/img-main_m.jpg';
import { ICarouselItem } from '../interfaces/carousel';

import ScheduleAlert from '../components/ScheduleAlert';
import { isNull } from 'lodash';

// const carouselItems: ICarouselItem[] = [
//   {
//     img: MainImage,
//     height: 385,
//     href: '/investment?status=전체',
//   },
// ];

// const carouselItemsMobile: ICarouselItem[] = [
//   {
//     img: MainImageMobile,
//     height: 0,
//     href: '/investment?status=전체',
//   },
// ];

export default function Landing(props: RouteComponentProps) {
  const [investmentItems, setInvestmentItems] = useState<any[]>([]);
  const [bannerItems, setBannerItems] = useState<ICarouselItem[]>([]);
  const [isShowSchedule, setShowSchedule] = useState<boolean>(false);

  // const showScheduleAlert = () => {
  //   document.getElementsByTagName('body')[0].classList.add('dialog-show');
  //   setShowSchedule(true);
  // };

  const handleScheduleAlertHide = () => {
    setShowSchedule(false);
    document.getElementsByTagName('body')[0].classList.remove('dialog-show');
  };

  const getInvestments = async () => {
    const result = await APIService.getInvestments();
    if (result.success) {
      setInvestmentItems(
        result.data
          .filter(
            (item: any) =>
              moment(item.start_date).valueOf() <= moment().valueOf() &&
              moment(item.end_date).valueOf() >= moment().valueOf(),
          )
          .map((item: any) => {
            const duration = moment.duration(moment(item.end_date).diff(moment()));
            const hourDuration = duration.asHours() - Math.floor(duration.asDays()) * 24;
            const minuteDuration =
              duration.asMinutes() - Math.floor(duration.asDays()) * 24 * 60 - Math.floor(hourDuration) * 60;
            const thumbnails = [];
            if (item.thumbnail1) thumbnails.push(item.thumbnail1);
            if (item.thumbnail2 !== 'null' && isNull(item.thumbnail2)) thumbnails.push(item.thumbnail2);
            if (item.thumbnail3 !== 'null' && isNull(item.thumbnail3)) thumbnails.push(item.thumbnail3);

            return {
              id: item.id,
              date_1: `[${item.invest_id}]`,
              date_2: '종료일　' + moment(item.end_date).format('YYYY - MM - DD　hh:mm A'),
              title_1: item.title,
              title_21: duration.asDays() >= 0 ? `D-${duration.asDays().toFixed(0)}` : 'D-0',
              title_22:
                hourDuration >= 0 && minuteDuration >= 0
                  ? `${hourDuration.toFixed(0)}시간 ${minuteDuration.toFixed(0)}분`
                  : '0시간 0분',
              // invest_time: item.invest_time,
              // recruitment_amount: item.recruitment_amount,
              // profit: item.profit + '%',
              percentage: ((Number(item.current_invest) * 100) / Number(item.max_invest)).toFixed(0) + '%',
              progress_1: toFormattedNumber(Number(item.current_invest)),
              progress_2: toFormattedNumber(Number(item.max_invest)),
              process_percent: ((Number(item.current_invest) * 100) / Number(item.max_invest)).toFixed(0),
              start_date: item.start_date,
              end_date: item.end_date,
              image: Part2Img3,
              thumbnail1: thumbnails[0],
              thumbnail2: thumbnails[1],
              thumbnail3: thumbnails[2],
              business_information: JSON.parse(item.business_information),
              business_type: item.business_type,
            };
          })
          .slice(0, 3),
      );
    }
  };

  const getBanners = async () => {
    const result = await APIService.getBanners();
    if (result) {
      setBannerItems(result);
    }
  };

  useEffect(() => {
    getInvestments();
    getBanners();
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-page-wrapper">
      <div className="main-banner">
        <Carousel className="d-none d-sm-flex">
          {bannerItems.map((item: ICarouselItem, index: number) => {
            return (
              <Carousel.Item key={index}>
                <div className="carousel-container">
                  <div className="carousel-items">
                    <img
                      src={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${item.image}`}
                      alt={item.description}
                    />
                    {/* <img height={item.height} src={item.img} alt="" /> */}
                  </div>
                </div>
                {/* <Link to={item.href}>
                  <div className={`image-overlay-${index}`}></div>
                </Link> */}
              </Carousel.Item>
            );
          })}
        </Carousel>
        <Carousel className="d-block d-sm-none">
          {bannerItems.map((item: ICarouselItem, index: number) => {
            return (
              <Carousel.Item key={index}>
                <div className="carousel-container">
                  <div className="carousel-items">
                    <img
                      src={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${item.image}`}
                      alt={item.description}
                    />
                    {/* <img height={item.height} src={item.img} alt="" /> */}
                    {/* <img src={item.image} alt={item.description} /> */}
                  </div>
                </div>
                {/* <Link to={item.href}>
                  <div className={`image-overlay-${index}`}></div>
                </Link> */}
              </Carousel.Item>
            );
          })}
        </Carousel>
      </div>

      <div className="landing-investment-wrapper">
        <h1>
          <Link to="/investment" className="title">
            프로젝트
          </Link>
          <Link className="new-investment__more" to="/investment?status=진행중">
            더보기
          </Link>
        </h1>
        {/* 모집예정 */}
        <div className="investments-content">
          <div>
            {investmentItems.map((item, idx: number) => {
              return <InvestmentItem {...props} data={item} showEdit={false} onReload={() => {}} key={idx} tab={''} />;
            })}
          </div>

          <ScheduleAlert visible={isShowSchedule} onHide={handleScheduleAlertHide} {...props} />
        </div>
      </div>
      <div className="contact-us-wrapper">
        <div className="contact-us-container">
          <div className="contact-us-items">
            <dl>
              <dt>정보공유</dt>
              <dd>
                <img width={62} height={62} src={ContactContract} alt="" />
                <p>
                  <mark>다양한 데이터 기반</mark>의<br />
                  프로젝트 소개
                </p>
              </dd>
            </dl>
            <dl>
              <dt>공통목표</dt>
              <dd>
                <img width={70} height={70} src={ContactContract2} alt="" />
                <p>
                  부동산 개발에
                  <br />
                  대한 <mark>열정</mark>
                </p>
              </dd>
            </dl>
            <dl>
              <dt>직접참여</dt>
              <dd>
                <img width={70} height={69} src={ContactContract3} alt="" />
                <p>
                  전자 투표와 공시를 통한
                  <br />
                  <mark>투명성 제고</mark>
                </p>
              </dd>
            </dl>
            <dl>
              <dt>신탁관리</dt>
              <dd>
                <img width={58} height={66} src={ContactContract4} alt="" />
                <p>
                  부동산 신탁 등기를 통한
                  <br /> <mark>안정성</mark> 강화
                </p>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="about-us-wrapper">
        <div className="about-us-container">
          <HashLink to="/aboutus#root">About Us</HashLink>
          <Link to="/user-guide">FAQ</Link>
        </div>
      </div>
    </div>
  );
}
