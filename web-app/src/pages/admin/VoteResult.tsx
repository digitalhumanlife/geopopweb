import React, { useState, useRef, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import './VoteResult.scss';
import Seal from '../../statics/images/v3/img-seal.png';
import APIService from '../../services/API';
import { toFormattedNumber } from '../../utilities/common';
import { getPercentage } from '../../utilities/persent';
export interface VoteResultProps
  extends RouteComponentProps<{
    id: string;
    invest_id: string;
    masked: string;
  }> {}

interface VoteDataType {
  investment: any[];
  userInvestments: any[];
}

export default function VoteResult(props: VoteResultProps) {
  const [voteData, setVoteData] = useState<VoteDataType>();

  const [result, setResult] = useState({
    agree: 0,
    disAgree: 0,
    abstention: 0,
  });

  const investment_id = useRef(props.match.params.id);
  const vote_id = useRef(props.match.params.invest_id);
  const masked = useRef(props.match.params.masked === 'false' ? false : true);

  const getPrintVoteResult = async () => {
    try {
      const response = await APIService.getVoteResult(investment_id.current, vote_id.current, masked.current);
      if (response.success) {
        setVoteData(response.data);
        getResult(response.data.userInvestments);
        window.print();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getResult = (data: any) => {
    data.map((vl: any) => {
      if (vl.record === '1') return setResult((val) => ({ ...val, agree: +val.agree + +vl.amount }));
      else if (vl.record === '2') return setResult((val) => ({ ...val, disAgree: +val.disAgree + +vl.amount }));
      else if (vl.record === '3') return setResult((val) => ({ ...val, abstention: +val.abstention + +vl.amount }));
    });
  };

  const getSocialSecurityNum = (item: any) => {
    if (item.type === 'business') return item.business_number;
    const is20Th = String(item.year).substring(0, 2);
    const gender = item.gender;
    const backNum =
      is20Th === '19' && gender === '남자'
        ? '1'
        : gender === '여자'
        ? 2
        : is20Th === '20' && gender === '남자'
        ? '3'
        : '4';

    const yy = String(item.year).substring(2, 4);
    const mm = +item.month < 10 ? `0${item.month}` : item.month;
    const dd = +item.day < 10 ? `0${item.day}` : item.day;
    return String(yy) + String(mm) + String(dd) + ' - ' + backNum + '******';
  };

  const getHyphen = (phoneNum: any) => {
    if (phoneNum.length <= 11) {
      const a = phoneNum.substr(0, 3);
      const b = phoneNum.substr(3, 4);
      const c = phoneNum.substr(7, 4);
      return a + '-' + b + '-' + c;
    }
    if (phoneNum.length >= 10) {
      const a = phoneNum.substr(0, 3);
      const b = phoneNum.substr(3, 3);
      const c = phoneNum.substr(7, 4);
      return a + '-' + b + '-' + c;
    }
    return '';
  };

  useEffect(() => {
    getPrintVoteResult();
  }, [investment_id.current, vote_id.current, masked.current]);

  return (
    <div className="vote-result">
      {voteData?.investment[0] && voteData?.userInvestments[0] && (
        <>
          <div className="vote-result__inf">제목: {voteData?.investment[0].title}</div>
          <div className="vote-result__inf">안건: {voteData?.userInvestments[0].title}​</div>
          <div className="vote-result__inf">날짜: {voteData?.investment[0].end_date.split('T')[0]}</div>
        </>
      )}

      {voteData?.userInvestments[0] && (
        <>
          <div className="vote-result__table">
            <table>
              <colgroup>
                <col style={{ width: '1%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '21%' }} />
                <col style={{ width: '35%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '7%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>
                    <span className="order"></span>
                  </th>
                  <th>성명</th>
                  <th>
                    주민등록번호
                    <br />
                    (사업자번호)
                  </th>
                  <th>주소</th>
                  <th>연락처</th>
                  <th className="account">구좌수</th>
                  <th>찬/반</th>
                </tr>
              </thead>
              <tbody>
                {voteData?.userInvestments.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td>　{idx + 1}　　</td>
                    <td>{item.name}</td>
                    <td>{getSocialSecurityNum(item)}</td>
                    <td>{item.address}</td>
                    <td>{getHyphen(item.phone2)}</td>
                    <td className="account">{item.amount}</td>
                    <td>{item.record === '1' ? '찬' : item.record === '2' ? '반' : '기권'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <dl className="vote-result__detail">
        <dt>
          투표 결과<>(가 / 부결)</>
        </dt>
        <dd className="total">총 투표권수 : {toFormattedNumber(+voteData?.investment[0].max_invest)}</dd>
        <dd>
          찬성 : {result.agree} ({getPercentage(result.agree, +voteData?.investment[0].max_invest)}%)
        </dd>
        <dd>
          반대 : {result.disAgree} ({getPercentage(result.disAgree, +voteData?.investment[0].max_invest)}%)
        </dd>
        <dd>
          기권 : {result.abstention} ({getPercentage(result.abstention, +voteData?.investment[0].max_invest)}%)
        </dd>
        <dd>
          불참 : {+voteData?.investment[0].max_invest - result.agree - result.disAgree - result.abstention}(
          {getPercentage(
            +voteData?.investment[0].max_invest - result.agree - result.disAgree - result.abstention,
            +voteData?.investment[0].max_invest,
          )}
          %)
        </dd>
      </dl>
      <p>해당 결의안건이 상기 투표내용과 같이 결정되었습니다.​</p>
      <div className="vote-result__author">
        ㈜ 그라운드컨트롤 <img src={Seal} alt="" />
      </div>
    </div>
  );
}
