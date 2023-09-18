import React, { useEffect, useState } from 'react';
import { Col, Grid, Row } from 'react-flexbox-grid';
import { RouteComponentProps } from 'react-router-dom';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import './InvestmentProduct.scss';
import Img6 from '../statics/images/content/img6.jpeg';
import Img7 from '../statics/images/content/img7.jpeg';

const productItems: any[] = [
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '100%',
    img: Img7,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '80%',
    img: Img6,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '100%',
    img: Img7,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '80%',
    img: Img6,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '100%',
    img: Img7,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '80%',
    img: Img6,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '100%',
    img: Img7,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '80%',
    img: Img6,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '100%',
    img: Img7,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '80%',
    img: Img6,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '100%',
    img: Img7,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '80%',
    img: Img6,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '100%',
    img: Img7,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '80%',
    img: Img6,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '100%',
    img: Img7,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '80%',
    img: Img6,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '100%',
    img: Img7,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '80%',
    img: Img6,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '100%',
    img: Img7,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '80%',
    img: Img6,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '100%',
    img: Img7,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '80%',
    img: Img6,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '100%',
    img: Img7,
  },
  {
    propertyNo: 'Property No.1',
    propertyDate: '2022.03.08',
    propertyLH: 'LH 매각확정',
    title: '광진구 구의동 100평 대지 <br /> 세종시개발사업 대지매입 공동개발',
    titleDate: '기간 22.04.05~22.05.05 10:00~22:00',
    descValue: '5,000 KRW',
    descRate: '15% per year',
    descPeriod: '2 months',
    progressValue: '5,000 KRW',
    progressPercent: '80%',
    img: Img6,
  },
];

const searchStatusItems: any[] = [
  { label: '채권상태', value: '' },
  { label: '펀딩 대기중', value: 'FUNDING_WAITING' },
  { label: '펀딩 진행중', value: 'FUNDING_PROCEEDING' },
  { label: '펀딩 성공', value: 'FUNDING_SUCCESS' },
  { label: '상환중', value: 'REPAYMENT_PROCEEDING' },
  { label: '상환 지연', value: 'REPAYMENT_DELAY' },
  { label: '연체', value: 'REPAYMENT_OVERDUE' },
  { label: '상환 완료', value: 'COMPLETE_SUCCESS' },
  { label: '부실', value: 'COMPLETE_FAIL' },
];

export default function InvestmentProduct(props: RouteComponentProps) {
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [visibleItems, setVisibleItems] = useState<any[]>([]);
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [first, setFirst] = useState<number>(0);

  const handleSearchStatusChange = (e: any) => {
    setSearchStatus(e.value);
  };

  const handleSearchTextChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleInvestmentClick = () => {
    props.history.push('/products');
  };

  useEffect(() => {
    const items = productItems.filter((item: any) => {
      return (
        item.propertyNo.indexOf(searchText) >= 0 ||
        item.propertyDate.indexOf(searchText) >= 0 ||
        item.propertyLH.indexOf(searchText) >= 0 ||
        item.title.indexOf(searchText) >= 0 ||
        item.titleDate.indexOf(searchText) >= 0 ||
        item.descValue.indexOf(searchText) >= 0 ||
        item.descRate.indexOf(searchText) >= 0 ||
        item.descPeriod.indexOf(searchText) >= 0 ||
        item.progressValue.indexOf(searchText) >= 0
      );
    });
    setFilteredItems(items);
  }, [searchText]);

  useEffect(() => {
    const items = filteredItems.slice(first, first + 5);
    setVisibleItems(items);
  }, [first, filteredItems]);

  return (
    <Grid className="invest-product-wrapper">
      <Row className="mx-10">
        <Col md={4}>
          <h1>공동개발상품 리스트</h1>
        </Col>
        <Col md={8} className="text-right search-wrapper">
          <div>
            <Dropdown value={searchStatus} options={searchStatusItems} onChange={handleSearchStatusChange} />
          </div>
          <div className="search-group">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                type="text"
                placeholder="상품명을 입력해주세요"
                value={searchText}
                onChange={handleSearchTextChange}
              />
            </span>
          </div>
        </Col>
      </Row>
      {visibleItems.map((item: any) => {
        return (
          <Row className="new-investment-item" onClick={handleInvestmentClick}>
            <Col md={7}>
              <Row className="text-bold">
                <Col md={4}>{item.propertyNo}</Col>
                <Col md={4}>{item.propertyDate}</Col>
                <Col md={4}>{item.propertyLH}</Col>
              </Row>
              <Row className="title">
                <Col md={12} dangerouslySetInnerHTML={{ __html: item.title }}></Col>
              </Row>
              <Row>
                <Col md={12}>{item.titleDate}</Col>
              </Row>
              <Row className="desc">
                <Col md={12} className="value">
                  {item.descValue}
                </Col>
                <Col md={12} className="rate">
                  {item.descRate}
                </Col>
                <Col md={12} className="period">
                  {item.descPeriod}
                </Col>
              </Row>
              <div className="custom-progress">
                <div className="bg">
                  <div className="bar" style={{ width: item.progressPercent }}></div>
                </div>
                <div className="value">
                  <span>{item.progressValue}</span>
                  <span>{item.progressPercent}</span>
                </div>
              </div>
            </Col>
            <Col md={5}>
              <img src={item.img} alt="" />
            </Col>
          </Row>
        );
      })}
      {visibleItems.length === 0 && (
        <Row className="new-investment-item" onClick={handleInvestmentClick}>
          <Col md={7}>
            <Row className="text-bold">
              <Col md={4}>No items</Col>
            </Row>
          </Col>
        </Row>
      )}
      <Paginator
        first={first}
        rows={5}
        totalRecords={filteredItems.length}
        onPageChange={(e) => {
          setFirst(e.first);
        }}
      ></Paginator>
    </Grid>
  );
}
