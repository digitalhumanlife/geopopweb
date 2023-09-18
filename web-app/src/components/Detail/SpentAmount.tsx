import React from 'react';
import { toFormattedNumber } from '../../utilities/common';

interface SpentAmountPropsType {
  type: string;
  data: any;
}

const SpentAmount = ({ type, data }: SpentAmountPropsType) => {
  return (
    <div className="table-area">
      <h3 className="table-area__title">지출금액</h3>
      <table>
        <colgroup>
          <col style={{ width: '19%' }} />
          <col style={{ width: '24%' }} />
          <col style={{ width: '57%' }} />
        </colgroup>
        <thead>
          <tr>
            <th className="sbj">구분</th>
            <th className="sbj">지출</th>
            <th className="sbj">비고 (가정)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>토지비</td>
            <td className="right">{toFormattedNumber(data?.expenditureAnalysis.landCost)}</td>
            <td className="left">{data?.expenditureAnalysis.land}</td>
          </tr>
          {(type === 'LH' || type === '분양') && (
            <>
              <tr>
                <td>공사비</td>
                <td className="right">{toFormattedNumber(data?.expenditureAnalysis.constructionCost)}</td>
                <td className="left">{data?.expenditureAnalysis.construction}</td>
              </tr>
              <tr>
                <td>설계 / 감리</td>
                <td className="right">{toFormattedNumber(data?.expenditureAnalysis.designCost)}</td>
                <td className="left">{data?.expenditureAnalysis.design}</td>
              </tr>
            </>
          )}
          {type === '부동산' && (
            <tr>
              <td>토목비용</td>
              <td className="right">{toFormattedNumber(data?.expenditureAnalysis.constructionCost)}</td>
              <td className="left">{data?.expenditureAnalysis.construction}</td>
            </tr>
          )}
          <tr>
            <td>제세비용</td>
            <td className="right">{toFormattedNumber(data?.expenditureAnalysis.taxCost)}</td>
            <td className="left">{data?.expenditureAnalysis.tax}</td>
          </tr>
          <tr>
            <td>사업추진비</td>
            <td className="right">{toFormattedNumber(data?.expenditureAnalysis.propelCost)}</td>
            <td className="left">{data?.expenditureAnalysis.propel}</td>
          </tr>
          <tr>
            <td>금융비용</td>
            <td className="right">{toFormattedNumber(data?.expenditureAnalysis.financeCost)}</td>
            <td className="left">{data?.expenditureAnalysis.finance}</td>
          </tr>
          <tr className="cost">
            <th className="sbj">총계</th>
            <td className="total">{toFormattedNumber(data?.expenditureAnalysis.totalCost)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SpentAmount;
