import React from 'react';

interface HeaderInfoPropsType {
  type: string;
  data: any;
}

const HeaderInfo = ({ type, data }: HeaderInfoPropsType) => {
  return (
    <ul className="info">
      <li>
        <dl>
          <dt>결성기금</dt>
          <dd>{data?.fund}</dd>
        </dl>
        {type !== '부동산' && (
          <dl>
            <dt>수행기간</dt>
            <dd>
              {data?.period}
              <small>(예상)</small>
            </dd>
          </dl>
        )}
      </li>
      <li>
        <dl>
          <dt>감정평가</dt>
          <dd>{data?.appraisal}</dd>
        </dl>
        <dl>
          <dt>사업비용</dt>
          <dd>
            {data?.expenditure} <small>(예상)</small>
          </dd>
        </dl>
      </li>
    </ul>
  );
};

export default HeaderInfo;
