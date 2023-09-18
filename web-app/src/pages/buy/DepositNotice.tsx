import React, { useCallback, useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button } from 'primereact/button';

import APIService from '../../services/API';

import './DepositNotice.scss';
import DepositNoticeImg from '../../statics/images/v2/deposit-notice.png';
import { toFormattedNumber } from '../../utilities/common';

export default function DepositNotice(props: RouteComponentProps) {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);

  const saveBought = useCallback(async () => {
    const buyData = JSON.parse(localStorage.getItem('bought') || '{}');
    const res = await APIService.saveBought({
      investment_id: buyData.investment_id,
      invest_id: buyData.invest_id,
      title: buyData.title,
      process_percent: 0,
      amount: buyData.amount,
      sign_name: buyData.sign_name,
    });
    if (res.success) {
      localStorage.removeItem('bought');
      setIsSuccess(res.success);
    } else {
      alert('Error');
    }
  }, []);

  useEffect(() => {
    const buyData = localStorage.getItem('bought');

    if (!buyData) {
      alert('잘못된 접근입니다.');
      props.history.push('/');
      return;
    }

    const data = JSON.parse(buyData);

    setPrice(data.total_price);

    saveBought();
  }, []);

  const handleSubmitClick = async () => {
    while (true) {
      if (isSuccess) {
        props.history.push('/');
        break;
      }
    }
  };

  return (
    <div className="deposit-notice-wrapper">
      <div className="deposit-notice-container">
        <h1 className="title font-bold text-center">입금공지</h1>
        <div className="deposit-blue-title font-medium text-center">구매 전 항상 입금액을 확인해 주시기 바랍니다</div>
        <div className="deposit-top-content">
          <div className="top-content-left">
            <p className="top-content-title font-medium">[입금계좌정보]</p>
            <div className="top-content-content">
              <p className="font-bold">KEB하나은행</p>
              <p className="font-bold">000-000000-00000</p>
            </div>
            <div className="top-content-content">
              <p className="font-bold">예금주</p>
              <p className="font-bold">000000</p>
            </div>
          </div>
          <div className="top-content-right">
            <div className="top-content-title font-medium">[결제금액]</div>
            <p className="font-bold">{toFormattedNumber(price)}</p>
          </div>
        </div>
        <div className="deposit-notice-img">
          <img src={DepositNoticeImg} alt="" />
        </div>
        <div className="go-to-my-page font-regular">
          상세사항은{' '}
          <Link className="font-bold text-black" to="/my-page">
            Mypage
          </Link>
          를 참조해 주시기 바랍니다
        </div>
        <div className="submit-wrapper">
          <Button label="메인 페이지로" onClick={handleSubmitClick} />
        </div>
      </div>
    </div>
  );
}
