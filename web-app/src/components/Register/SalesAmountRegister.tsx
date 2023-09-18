import React, { useEffect } from 'react';
import { Field } from 'formik';
import { Button } from 'primereact/button';
import { HouseTypes, HouseTypesType } from '../../constants/houseTypes';
import TextInput from '../TextInput';
import TextAreaField from '../../components/TextAreaField';
interface SalesAmountRegisterPropsType {
  type: string;
  values: any;
  salesRow: number;
  setSalesRow: any;
  houseTypeSelected: string;
  handleHouseTypeChanged: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SalesAmountRegister = ({
  type,
  values,
  salesRow,
  setSalesRow,
  houseTypeSelected,
  handleHouseTypeChanged,
}: SalesAmountRegisterPropsType) => {
  useEffect(() => {
    setSalesRow(0);
  }, [type]);

  return (
    <div className="table-area">
      <h3 className="table-area__title">매출액</h3>
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
                <th className="sbj sbj--keep" rowSpan={2 + salesRow}>
                  <select className="form-select" onChange={handleHouseTypeChanged} value={houseTypeSelected}>
                    {HouseTypes.map((item: HouseTypesType) => (
                      <option value={item.value} key={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </th>
                <td>
                  <span className="info">
                    <Field className="form-control" type="text" name="detailSales0" component={TextInput} />
                  </span>
                </td>
                <td>
                  <span className="info">
                    <Field className="form-control" type="number" name="detailSales1" component={TextInput} />
                  </span>
                </td>
                <td>
                  <span className="info">
                    <Field className="form-control" type="number" name="detailSales2" component={TextInput} />
                  </span>
                </td>
                <td>
                  <span className="info">
                    <Field className="form-control" type="number" name="detailSales3" component={TextInput} />
                  </span>
                </td>
                <td>
                  <span className="info">
                    <Field className="form-control" type="number" name="detailSales4" component={TextInput} />
                  </span>
                </td>
                <td>
                  <span className="info">
                    <Field className="form-control" type="number" name="detailSales5" component={TextInput} />
                  </span>
                </td>
              </tr>
              {salesRow > 0 &&
                Array(salesRow)
                  .fill('')
                  .map((_, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className="info">
                          <Field
                            className="form-control"
                            type="text"
                            name={`detailSales0${idx}`}
                            component={TextInput}
                          />
                        </span>
                      </td>
                      <td>
                        <span className="info">
                          <Field
                            className="form-control"
                            type="number"
                            name={`detailSales1${idx}`}
                            component={TextInput}
                          />
                        </span>
                      </td>
                      <td>
                        <span className="info">
                          <Field
                            className="form-control"
                            type="number"
                            name={`detailSales2${idx}`}
                            component={TextInput}
                          />
                        </span>
                      </td>
                      <td>
                        <span className="info">
                          <Field
                            className="form-control"
                            type="number"
                            name={`detailSales3${idx}`}
                            component={TextInput}
                          />
                        </span>
                      </td>
                      <td>
                        <span className="info">
                          <Field
                            className="form-control"
                            type="number"
                            name={`detailSales4${idx}`}
                            component={TextInput}
                          />
                        </span>
                      </td>
                      <td>
                        <span className="info">
                          <Field
                            className="form-control"
                            type="number"
                            name={`detailSales5${idx}`}
                            component={TextInput}
                          />
                        </span>
                      </td>
                    </tr>
                  ))}
              <tr>
                <td colSpan={6}>
                  <Button
                    type="button"
                    onClick={() => {
                      setSalesRow(() => salesRow + 1);
                    }}
                  >
                    + 주택 구분 추가하기
                  </Button>
                </td>
              </tr>
              <tr>
                <th className="sbj" colSpan={2}>
                  합계
                </th>
                <td style={{ textAlign: 'left' }} colSpan={5}>
                  {!!salesRow
                    ? +values.detailSales1 +
                      Array(salesRow)
                        .fill('')
                        .reduce(
                          (acc, el, idx) =>
                            acc + ((values[`detailSales1${idx}`] as any) ? (+values[`detailSales1${idx}`] as any) : 0),
                          0,
                        )
                    : +values.detailSales1}
                </td>
              </tr>
              <tr>
                <th className="sbj" colSpan={2}>
                  비고
                </th>
                <td colSpan={5} className="etc">
                  <Field
                    className="form-control"
                    type="text"
                    name="detailSales6"
                    placeholder="매출액 비고"
                    rows={2}
                    component={TextAreaField}
                    style={{ padding: '20px' }}
                  />
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
                <th className="sbj sbj--keep" rowSpan={2 + salesRow}>
                  <select className="form-select" onChange={handleHouseTypeChanged} value={houseTypeSelected}>
                    {HouseTypes.map((item: HouseTypesType) => (
                      <option value={item.value} key={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </th>
                <td>
                  <span className="info">
                    <Field className="form-control" type="text" name="detailSales0" component={TextInput} />
                  </span>
                </td>
                <td>
                  <span className="info">
                    <Field className="form-control" type="number" name="detailSales1" component={TextInput} />
                  </span>
                </td>
                <td>
                  <span className="info">
                    <Field className="form-control" type="number" name="detailSales2" component={TextInput} />
                  </span>
                </td>
                <td>
                  <span className="info">
                    <Field className="form-control" type="number" name="detailSales3" component={TextInput} />
                  </span>
                </td>
                <td>
                  <span className="info">
                    <Field className="form-control" type="number" name="detailSales4" component={TextInput} />
                  </span>
                </td>
                <td>
                  <span className="info">
                    <Field className="form-control" type="number" name="detailSales5" component={TextInput} />
                  </span>
                </td>
              </tr>
              {salesRow > 0 &&
                Array(salesRow)
                  .fill('')
                  .map((_, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className="info">
                          <Field
                            className="form-control"
                            type="text"
                            name={`detailSales0${idx}`}
                            component={TextInput}
                          />
                        </span>
                      </td>
                      <td>
                        <span className="info">
                          <Field
                            className="form-control"
                            type="number"
                            name={`detailSales1${idx}`}
                            component={TextInput}
                          />
                        </span>
                      </td>
                      <td>
                        <span className="info">
                          <Field
                            className="form-control"
                            type="number"
                            name={`detailSales2${idx}`}
                            component={TextInput}
                          />
                        </span>
                      </td>
                      <td>
                        <span className="info">
                          <Field
                            className="form-control"
                            type="number"
                            name={`detailSales3${idx}`}
                            component={TextInput}
                          />
                        </span>
                      </td>
                      <td>
                        <span className="info">
                          <Field
                            className="form-control"
                            type="number"
                            name={`detailSales4${idx}`}
                            component={TextInput}
                          />
                        </span>
                      </td>
                      <td>
                        <span className="info">
                          <Field
                            className="form-control"
                            type="number"
                            name={`detailSales5${idx}`}
                            component={TextInput}
                          />
                        </span>
                      </td>
                    </tr>
                  ))}
              <tr>
                <td colSpan={6}>
                  <Button
                    type="button"
                    onClick={() => {
                      setSalesRow(() => salesRow + 1);
                    }}
                  >
                    + 주택 구분 추가하기
                  </Button>
                </td>
              </tr>
              <tr>
                <th className="sbj" colSpan={2}>
                  합계
                </th>
                <td style={{ textAlign: 'left' }} colSpan={5}>
                  {!!salesRow
                    ? +values.detailSales1 +
                      Array(salesRow)
                        .fill('')
                        .reduce(
                          (acc, el, idx) =>
                            acc + ((values[`detailSales1${idx}`] as any) ? (+values[`detailSales1${idx}`] as any) : 0),
                          0,
                        )
                    : +values.detailSales1}
                </td>
              </tr>
              <tr>
                <th className="sbj" colSpan={2}>
                  비고
                </th>
                <td colSpan={5} className="etc">
                  <Field
                    className="form-control"
                    type="text"
                    name="detailSales6"
                    placeholder="매출액 비고"
                    rows={2}
                    component={TextAreaField}
                    style={{ padding: '20px' }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
      {type === '부동산' && (
        <>
          <small className="table-area__sub">(단위/원)</small>
          <div className="scroll">
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
                <tr>
                  <td>
                    <span className="info">
                      <Field className="form-control" type="text" name="detailSales0" component={TextInput} />
                    </span>
                  </td>
                  <td>
                    <span className="info">
                      <Field className="form-control" type="number" name="detailSales1" component={TextInput} />
                    </span>
                  </td>
                  <td>
                    <span className="info">
                      <Field className="form-control" type="text" name="detailSales2" component={TextInput} />
                    </span>
                  </td>
                </tr>
                {salesRow > 0 &&
                  Array(salesRow)
                    .fill('')
                    .map((_, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className="info">
                            <Field
                              className="form-control"
                              type="text"
                              name={`detailSales0${idx}`}
                              component={TextInput}
                            />
                          </span>
                        </td>
                        <td>
                          <span className="info">
                            <Field
                              className="form-control"
                              type="number"
                              name={`detailSales1${idx}`}
                              component={TextInput}
                            />
                          </span>
                        </td>
                        <td>
                          <span className="info">
                            <Field
                              className="form-control"
                              type="text"
                              name={`detailSales2${idx}`}
                              component={TextInput}
                            />
                          </span>
                        </td>
                      </tr>
                    ))}
                <tr>
                  <td colSpan={3}>
                    <Button
                      type="button"
                      onClick={() => {
                        setSalesRow(() => salesRow + 1);
                      }}
                    >
                      + 추가하기
                    </Button>
                  </td>
                </tr>
                <tr>
                  <th className="sbj">합계</th>
                  <td className="total">
                    {!!salesRow
                      ? +values.detailSales1 +
                        Array(salesRow)
                          .fill('')
                          .reduce(
                            (acc, el, idx) =>
                              acc +
                              ((values[`detailSales1${idx}`] as any) ? (+values[`detailSales1${idx}`] as any) : 0),
                            0,
                          )
                      : +values.detailSales1}{' '}
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <th className="sbj">비고</th>
                  <td colSpan={2} className="etc">
                    <Field
                      className="form-control"
                      type="text"
                      name="detailSales6"
                      placeholder="매출액 비고"
                      rows={2}
                      component={TextAreaField}
                      style={{ padding: '20px' }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesAmountRegister;
