import moment from 'moment';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SelectButton } from 'primereact/selectbutton';
import qs from 'query-string';
import { Button } from 'primereact/button';

import InvestmentItem from '../components/InvestmentItem';
import APIService from '../services/API';
import { useUser } from '../store/hooks/hooks';
import { toFormattedNumber } from '../utilities/common';

import './Investments.scss';
import TitleInvestments from '../statics/images/v3/bg-investments.jpg';
import Part2Img3 from '../statics/images/v2/part2/part2_3.png';
import { IInvestmentItem } from '../interfaces/investment';
import { diffDate } from '../utilities/date';
import { isNull } from 'lodash';

const TAB_OPTIONS: any[] = [
  { label: '공개예정', value: '예정' },
  { label: '결성중', value: '진행중' },
  { label: '결성완료', value: '완료' },
];

export default function Investments(props: RouteComponentProps) {
  const query: any = qs.parse(props.location.search);
  const [tab, setTab] = useState<string>(TAB_OPTIONS[0].value);
  const [rawInvestmentItems, setRawInvestmentItems] = useState<IInvestmentItem[]>([]);
  const [investmentItems, setInvestmentItems] = useState<IInvestmentItem[]>([]);
  const [investmentItemLength, setInvestmentItemLength] = useState(1);
  const [curContentLength, setCurContentLength] = useState<number>(0);

  const user = useUser();

  const getInvestments = async () => {
    const result = await APIService.getInvestments();

    if (result.success) {
      setRawInvestmentItems(
        result.data.map((item: IInvestmentItem) => {
          const diff = diffDate(item.end_date).diff;
          const diffDay = diffDate(item.end_date).diffDay;
          const diffHour = diffDate(item.end_date).diffHour;
          const diffMin = diffDate(item.end_date).diffMin;
          const thumbnails = [];
          if (item.thumbnail1) thumbnails.push(item.thumbnail1);
          if (item.thumbnail2 !== 'null' && isNull(item.thumbnail2)) thumbnails.push(item.thumbnail2);
          if (item.thumbnail3 !== 'null' && isNull(item.thumbnail3)) thumbnails.push(item.thumbnail3);

          return {
            id: item.id,
            date_1: `[${item.invest_id}]`,
            date_2: '종료일　' + moment(item.end_date).format('YYYY - MM - DD　hh:mm A'),
            title_1: item.title,
            title_21: diff >= 0 ? `D-${diffDay}` : 'D-0',
            title_22: `${diff >= 0 ? diffHour : 0}시간 ${diff >= 0 ? diffMin : 0}분`,
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
            recruitment_complete: item.recruitment_complete,
            business_type: item.business_type,
          };
        }),
      );
    }
  };

  const handleTabChange = (e: any) => {
    if (!e.value) return;
    props.history.push('/investment?status=' + e.value);
  };

  useEffect(() => {
    setInvestmentItems([]);
    let investmentItemResult: IInvestmentItem[] = [];
    if (tab === '예정') {
      investmentItemResult = rawInvestmentItems.filter(
        (item) => moment(item.start_date).valueOf() > moment().valueOf(),
      );
    }

    if (tab === '진행중') {
      investmentItemResult = rawInvestmentItems.filter(
        (item) => moment(item.start_date).valueOf() <= moment().valueOf() && item.recruitment_complete === false,
      );
    }

    if (tab === '완료') {
      investmentItemResult = rawInvestmentItems.filter((item) => item.recruitment_complete === true);
    }

    setCurContentLength(investmentItemResult.length / investmentItemLength);
    if (investmentItemResult.length > 0) {
      setInvestmentItems(investmentItemResult.slice(0, investmentItemLength * 5)); // 5개씩 보여줌
    } else {
      setInvestmentItems([]);
    }
  }, [rawInvestmentItems, tab, investmentItemLength]);

  useEffect(() => {
    getInvestments();
  }, [user]);

  useEffect(() => {
    let { status } = query;

    if (status !== '예정' && status !== '진행중' && status !== '완료') {
      props.history.push('/investment?status=예정');
    } else {
      setTab(status);
      setCurContentLength(0);
      setInvestmentItemLength(1);
    }
  }, [query.status]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="investments-wrapper">
      <div className="common-header">
        <img src={TitleInvestments} alt="" />
        <h1>프로젝트</h1>
      </div>
      {user.isAdmin() && (
        <div className="new-investment d-none d-sm-flex">
          <Button label="New Investment" onClick={() => props.history.push('/new-investment')} />
        </div>
      )}
      <div className="investments-tab">
        <SelectButton value={tab} options={TAB_OPTIONS} onChange={handleTabChange}></SelectButton>
      </div>
      <div>
        <div className="investments-content">
          {investmentItems.map((item, index) => {
            return (
              <InvestmentItem key={index} data={item} showEdit={true} tab={tab} onReload={getInvestments} {...props} />
            );
          })}
        </div>
        {curContentLength >= 5 ? (
          <div
            onClick={() => setInvestmentItemLength((oldLength) => oldLength + 1)}
            className="investment-view-more pointer"
          >
            더보기
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
