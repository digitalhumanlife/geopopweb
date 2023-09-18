import React from 'react';

interface HighlightsPropsType {
  type: string;
  data: any;
}

const Highlights = ({ type, data }: HighlightsPropsType) => {
  return (
    <ul>
      {type === '부동산' ? (
        <>
          <li className="col4">
            <span className="sbj">명칭 [코드]</span>
            <span className="info info--3">{data?.code}</span>
          </li>
          <li className="col4">
            <span className="sbj">결성기금</span>
            <span className="info">{data?.fund}</span>
            <span className="sbj">제안매도가</span>
            <span className="info">{data?.endPoint}</span>
          </li>
          <li className="col4">
            <span className="sbj">계좌수</span>
            <span className="info">{data?.accounts}</span>
            <span className="sbj">감정평가</span>
            <span className="info">{data?.appraisal}</span>
          </li>
          <li className="col4">
            <span className="sbj">기금목적</span>
            <span className="info">{data?.purpose}</span>
            <span className="sbj">사업비용</span>
            <span className="info">
              {data?.expenditure}
              <small> (예상)</small>
            </span>
          </li>
          <li className="col4">
            <span className="sbj">참여개시</span>
            <span className="info">{data?.startParticipate}</span>
            <span className="sbj">매출재원</span>
            <span className="info">{data?.salesPurpose}</span>
          </li>
        </>
      ) : (
        <>
          <li className="col4">
            <span className="sbj">명칭 [코드]</span>
            <span className="info info--3">{data?.code}</span>
          </li>
          <li className="col4">
            <span className="sbj">결성기금</span>
            <span className="info">{data?.fund}</span>
            <span className="sbj">수행기간</span>
            <span className="info">
              {data?.period}
              <small> (예상)</small>
            </span>
          </li>
          <li className="col4">
            <span className="sbj">계좌수</span>
            <span className="info">{data?.accounts}</span>
            <span className="sbj">종료시점</span>
            <span className="info">
              {data?.endPoint}
              <small> (예상)</small>
            </span>
          </li>
          <li className="col4">
            <span className="sbj">기금목적</span>
            <span className="info">{data?.purpose}</span>
            <span className="sbj">감정평가</span>
            <span className="info">{data?.appraisal}</span>
          </li>
          <li className="col4">
            <span className="sbj">참여개시</span>
            <span className="info">{data?.startParticipate}</span>
            <span className="sbj">사업비용</span>
            <span className="info">
              {data?.expenditure}
              <small> (예상)</small>
            </span>
          </li>
          <li className="col4">
            <span className="sbj">참여종료</span>
            <span className="info">{data?.endParticipate}</span>
            <span className="sbj">매출재원</span>
            <span className="info">{data?.salesPurpose}</span>
          </li>
        </>
      )}
    </ul>
  );
};

export default Highlights;
