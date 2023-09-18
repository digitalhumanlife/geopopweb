import { Link, RouteComponentProps } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';

import './DepositAlert.scss';
import APIService from '../services/API';
import { toFormattedNumber } from '../utilities/common';
import { BankInfoType } from '../interfaces/bank';
interface Props extends RouteComponentProps {
  visible: boolean;
  onHide: () => void;
  bankInfo: BankInfoType | undefined;
  id?: React.MutableRefObject<string>;
}

export default function DepositAlert(props: Props) {
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const onHideWrapper = () => {
    props.onHide();
    props.history.push('my-page');
  };

  const getPrice = async (id: string) => {
    const res = await APIService.getPrice(id);
    return res.success ? res.data : 0;
  };

  useEffect(() => {
    if (props.id) {
      getPrice(props.id.current).then((msg: number) => {
        setTotalPrice(msg);
      });
    }
  });

  return (
    <Dialog
      visible={props.visible}
      style={{ width: '600px' }}
      modal={true}
      showHeader={false}
      appendTo={document.body}
      onHide={onHideWrapper}
      className="common-dialog common-dialog--deposit"
    >
      <div className="common-dialog__inner">
        <h1 className="title">입금안내</h1>

        <p className="cmt">
          1. 참여신청 회원님의 납입 확인을 위해
          <br /> 회원정보에 입력한 본인 명의의 계좌 사용이 반드시 필요합니다.
          <br />
          <br />
          2. 입금 전 금액 및 예금주를 {isMobile && <br />}반드시 확인해주시기 바랍니다.
        </p>
        <ul className="dtl">
          <li className="dtl-head">
            <div className="dtl-left">입금계좌정보</div>
            <div className="dtl-right">입금금액</div>
          </li>
          <li className="dtl-cont">
            <div className="dtl-left">
              <span>은행</span>
              <span>{props.bankInfo?.bank_name}</span>
            </div>
          </li>
          <li className="dtl-cont">
            <div className="dtl-left">
              <span>계좌번호</span>
              <span>{props.bankInfo?.bank_account}</span>
            </div>
            <div className="dtl-right">{toFormattedNumber(+totalPrice)}</div>
          </li>
          <li className="dtl-cont">
            <div className="dtl-left">
              <span>예금주</span>
              <span>{props.bankInfo?.account_holder}</span>
            </div>
          </li>
        </ul>
        <p className="cmt cmt--sub">
          자세한 사항은 <Link to="/my-page">'마이페이지'</Link>를 통해 확인 하실 수 있습니다.
        </p>

        <div className="submit-button">
          <Button className="submit" label="닫기" onClick={onHideWrapper} />
        </div>
      </div>
    </Dialog>
  );
}
