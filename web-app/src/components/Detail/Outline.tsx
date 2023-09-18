import React from 'react';
import { isMobile, isBrowser } from 'react-device-detect';
interface OutlinePropsType {
  type: string;
  data: any;
}

const Outline = ({ type, data }: OutlinePropsType) => {
  return (
    <div className="product-content__grid">
      {type === '부동산' ? (
        <>
          <ul data-type="land">
            <li className="col4">
              <span className="sbj">대지위치</span>
              <span className="info info--3">{data?.location}</span>
            </li>
            <li className="col4">
              <span className="sbj">대지면적 / 용도</span>
              <span className="info">{data?.area}</span>
            </li>
            <li className="col4">
              <span className="sbj">비고</span>
              <span className="info info--3 info--textarea">{data?.note}</span>
            </li>
          </ul>
        </>
      ) : (
        <>
          {isBrowser && (
            <ul data-type="outline">
              <li className="col4">
                <span className="sbj">대지위치</span>
                <span className="info">{data?.location}</span>
                <span className="sbj">용도</span>
                <span className="info">{data?.usage}</span>
              </li>
              <li className="col4">
                <span className="sbj">대지면적 / 용도</span>
                <span className="info">{data?.area}</span>
                <span className="sbj">규모</span>
                <span className="info">{data?.scale}</span>
              </li>
              <li className="col4">
                <span className="sbj">연면적 / 용적률</span>
                <span className="info">{data?.areaRatio}</span>
                <span className="sbj">주차장</span>
                <span className="info">{data?.parkingLot}</span>
              </li>
              <li className="col4">
                <span className="sbj">비고</span>
                <span className="info info--3 info--textarea">{data?.note}</span>
              </li>
            </ul>
          )}
          {isMobile && (
            <ul data-type="outline">
              <li className="col4">
                <span className="sbj">대지위치</span>
                <span className="info">{data?.location}</span>
                <span className="sbj">대지면적 / 용도</span>
                <span className="info">{data?.area}</span>
              </li>
              <li className="col4">
                <span className="sbj">연면적 / 용적률</span>
                <span className="info">{data?.areaRatio}</span>
                <span className="sbj">용도</span>
                <span className="info">{data?.usage}</span>
              </li>
              <li className="col4">
                <span className="sbj">규모</span>
                <span className="info">{data?.scale}</span>
                <span className="sbj">주차장</span>
                <span className="info">{data?.parkingLot}</span>
              </li>
              <li className="col4">
                <span className="sbj">비고</span>
                <span className="info info--3 info--textarea">{data?.note}</span>
              </li>
            </ul>
          )}
        </>
      )}
    </div>
  );
};
export default Outline;
