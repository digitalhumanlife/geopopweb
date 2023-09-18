import React from 'react';
import { toFormattedNumber } from '../../utilities/common';
import { isMobile, isBrowser } from 'react-device-detect';
import { SalesAmountDataType, SalesAnalysisType } from '../../interfaces/detailProduct';

interface SalesAmountPropsType {
  type: string;
  data: SalesAmountDataType;
}

const SalesAmount = ({ type, data }: SalesAmountPropsType) => {
  return (
    <div className="table-area">
      <h3 className="table-area__title">매출액</h3>
      {isBrowser && (
        <>
          {(type === 'LH' || type === '분양') && (
            <>
              <small className="table-area__sub">(원, 평)</small>
              <table>
                <colgroup>
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '18.5%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '18.5%' }} />
                  <col style={{ width: '9%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className="sbj" colSpan={2}>
                      구분
                    </th>
                    <th className="sbj">매출</th>
                    <th className="sbj">분양면적</th>
                    <th className="sbj">평당분양가</th>
                    <th className="sbj">세대별분양가</th>
                    <th className="sbj">세대수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="sbj sbj--keep" rowSpan={(data?.salesAnalysis.length || 0) + 1}>
                      {data?.salesAnalysis[0].type}
                    </th>
                  </tr>
                  {data?.salesAnalysis.map((value: SalesAnalysisType, idx: number) => (
                    <tr key={idx}>
                      <td>{value.division}</td>
                      <td className="right">{toFormattedNumber(+value.sales)}</td>
                      <td>{toFormattedNumber(+value.area)}</td>
                      <td>{toFormattedNumber(+value.pyeongPrice)}</td>
                      <td>{toFormattedNumber(+value.generationPrice)}</td>
                      <td>{toFormattedNumber(+value.generations)}</td>
                    </tr>
                  ))}

                  <tr>
                    <th className="sbj" colSpan={2}>
                      합계
                    </th>
                    <td className="total">
                      {toFormattedNumber(
                        data?.salesAnalysis.reduce((acc: number, cur: SalesAnalysisType) => acc + +cur.sales, 0),
                      )}
                    </td>
                    <td colSpan={4}></td>
                  </tr>
                  <tr>
                    <th className="sbj" colSpan={2}>
                      비고
                    </th>
                    <td className="etc" colSpan={5}>
                      {data?.salesAnalysis[0].note}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
          {type === '임대' && (
            <>
              <small className="table-area__sub">(원, 평)</small>
              <table>
                <colgroup>
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '18.5%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '18.5%' }} />
                  <col style={{ width: '9%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className="sbj" colSpan={2}>
                      구분
                    </th>
                    <th className="sbj">매출</th>
                    <th className="sbj">임대면적</th>
                    <th className="sbj">보증금</th>
                    <th className="sbj">월별임대료</th>
                    <th className="sbj">세대수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="sbj sbj--keep" rowSpan={(data?.salesAnalysis.length || 0) + 1}>
                      {data?.salesAnalysis[0].type}
                    </th>
                  </tr>
                  {data?.salesAnalysis.map((value: any, idx: number) => (
                    <tr key={idx}>
                      <td>{value.division}</td>
                      <td className="right">{toFormattedNumber(value.sales)}</td>
                      <td>{toFormattedNumber(value.area)}</td>
                      <td>{toFormattedNumber(value.pyeongPrice)}</td>
                      <td>{toFormattedNumber(value.generationPrice)}</td>
                      <td>{toFormattedNumber(value.generations)}</td>
                    </tr>
                  ))}

                  <tr>
                    <th className="sbj" colSpan={2}>
                      합계
                    </th>
                    <td className="total">
                      {toFormattedNumber(data?.salesAnalysis.reduce((acc: any, cur: any) => acc + +cur.sales, 0))}
                    </td>
                    <td colSpan={4}></td>
                  </tr>
                  <tr>
                    <th className="sbj" colSpan={2}>
                      비고
                    </th>
                    <td className="etc" colSpan={5}>
                      {data?.salesAnalysis[0].note}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
          {type === '부동산' && (
            <>
              <small className="table-area__sub">(단위/원)</small>
              <table>
                <colgroup>
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '25%' }} />
                  <col style={{ width: '55%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className="sbj">구분</th>
                    <th className="sbj">매출</th>
                    <th className="sbj">비고(가정)</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.salesAnalysis.map((value: SalesAnalysisType, idx: number) => (
                    <tr key={idx}>
                      <td>{value.division}</td>
                      <td className="right">{toFormattedNumber(+value.sales)}</td>
                      <td>{value.area}</td>
                    </tr>
                  ))}
                  <tr className="type2">
                    <th className="sbj">합계</th>
                    <td className="total">
                      {toFormattedNumber(
                        data?.salesAnalysis.reduce((acc: number, cur: SalesAnalysisType) => acc + +cur.sales, 0),
                      )}
                    </td>
                    <td></td>
                  </tr>
                  <tr className="type2">
                    <th className="sbj">비고</th>
                    <td className="etc" colSpan={2}>
                      {data?.salesAnalysis[0].note}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </>
      )}
      {isMobile && (
        <>
          {(type === 'LH' || type === '분양') && (
            <>
              <small className="table-area__sub">(원, 평)</small>
              <div className="section">
                <table>
                  <colgroup>
                    <col style={{ width: '21.5%' }} />
                    <col style={{ width: '21.5%' }} />
                    <col style={{ width: '34%' }} />
                    <col style={{ width: '23%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="sbj" colSpan={2}>
                        구분
                      </th>
                      <th className="sbj">매출</th>
                      <th className="sbj">분양면적</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="sbj sbj--keep" rowSpan={(data?.salesAnalysis.length || 0) + 1}>
                        {data?.salesAnalysis[0].type}
                      </th>
                    </tr>
                    {data?.salesAnalysis.map((value: SalesAnalysisType, idx: number) => (
                      <tr key={idx}>
                        <td>{value.division}</td>
                        <td className="right">{toFormattedNumber(+value.sales)}</td>
                        <td>{toFormattedNumber(+value.area)}</td>
                      </tr>
                    ))}
                    <tr className="type2">
                      <th className="sbj" colSpan={2}>
                        합계
                      </th>
                      <td className="total">
                        {toFormattedNumber(
                          data?.salesAnalysis.reduce((acc: number, cur: SalesAnalysisType) => acc + +cur.sales, 0),
                        )}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="section">
                <table>
                  <colgroup>
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '26.4%' }} />
                    <col style={{ width: '26.4%' }} />
                    <col style={{ width: '11.2%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="sbj" colSpan={2}>
                        구분
                      </th>
                      <th className="sbj">평당분양가</th>
                      <th className="sbj">세대별분양가</th>
                      <th className="sbj">세대수</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="sbj sbj--keep" rowSpan={(data?.salesAnalysis.length || 0) + 1}>
                        {data?.salesAnalysis[0].type}
                      </th>
                    </tr>
                    {data?.salesAnalysis.map((value: SalesAnalysisType, idx: number) => (
                      <tr key={idx}>
                        <td>{value.division}</td>
                        <td>{toFormattedNumber(+value.pyeongPrice)}</td>
                        <td>{toFormattedNumber(+value.generationPrice)}</td>
                        <td>{toFormattedNumber(+value.generations)}</td>
                      </tr>
                    ))}
                    <tr className="type2">
                      <th colSpan={2} className="sbj">
                        비고
                      </th>
                      <td className="etc" colSpan={3}>
                        {data?.salesAnalysis[0].note}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
          {type === '임대' && (
            <>
              <small className="table-area__sub">(원, 평)</small>
              <div className="section">
                <table>
                  <colgroup>
                    <col style={{ width: '21.5%' }} />
                    <col style={{ width: '21.5%' }} />
                    <col style={{ width: '34%' }} />
                    <col style={{ width: '23%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="sbj" colSpan={2}>
                        구분
                      </th>
                      <th className="sbj">매출</th>
                      <th className="sbj">임대면적</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="sbj sbj--keep" rowSpan={(data?.salesAnalysis.length || 0) + 1}>
                        {data?.salesAnalysis[0].type}
                      </th>
                    </tr>
                    {data?.salesAnalysis.map((value: any, idx: number) => (
                      <tr key={idx}>
                        <td>{toFormattedNumber(value.division)}</td>
                        <td className="right">{toFormattedNumber(value.sales)}</td>
                        <td>{toFormattedNumber(value.area)}</td>
                      </tr>
                    ))}
                    <tr>
                      <th className="sbj" colSpan={2}>
                        합계
                      </th>
                      <td className="total">
                        {toFormattedNumber(data?.salesAnalysis.reduce((acc: any, cur: any) => acc + +cur.sales, 0))}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="section">
                <table>
                  <colgroup>
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '26.4%' }} />
                    <col style={{ width: '26.4%' }} />
                    <col style={{ width: '11.2%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="sbj" colSpan={2}>
                        구분
                      </th>
                      <th className="sbj">보증금</th>
                      <th className="sbj">월별임대료</th>
                      <th className="sbj">세대수</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="sbj sbj--keep" rowSpan={(data?.salesAnalysis.length || 0) + 1}>
                        {data?.salesAnalysis[0].type}
                      </th>
                    </tr>
                    {data?.salesAnalysis.map((value: any, idx: number) => (
                      <tr key={idx}>
                        <td>{toFormattedNumber(value.division)}</td>
                        <td>{toFormattedNumber(value.pyeongPrice)}</td>
                        <td>{toFormattedNumber(value.generationPrice)}</td>
                        <td>{toFormattedNumber(value.generations)}</td>
                      </tr>
                    ))}
                    <tr className="type2">
                      <th colSpan={2} className="sbj">
                        비고
                      </th>
                      <td className="etc" colSpan={3}>
                        {data?.salesAnalysis[0].note}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
          {type === '부동산' && (
            <>
              <small className="table-area__sub">(단위/원)</small>
              <div className="scroll">
                <table>
                  <colgroup>
                    <col style={{ width: '25%' }} />
                    <col style={{ width: '32%' }} />
                    <col style={{ width: '43%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="sbj">구분</th>
                      <th className="sbj">매출</th>
                      <th className="sbj">비고(가정)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.salesAnalysis.map((value: SalesAnalysisType, idx: number) => (
                      <tr key={idx}>
                        <td>{value.division}</td>
                        <td className="right">{toFormattedNumber(+value.sales)}</td>
                        <td>{value.area}</td>
                      </tr>
                    ))}
                    <tr className="type2">
                      <th className="sbj">합계</th>
                      <td className="total">
                        {toFormattedNumber(
                          data?.salesAnalysis.reduce((acc: number, cur: SalesAnalysisType) => acc + +cur.sales, 0),
                        )}
                      </td>
                      <td></td>
                    </tr>
                    <tr className="type2">
                      <th className="sbj">비고</th>
                      <td className="etc" colSpan={2}>
                        {data?.salesAnalysis[0].note}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SalesAmount;
