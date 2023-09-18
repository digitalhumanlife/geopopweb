import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import React, { useState, useLayoutEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Grid, Row } from 'react-flexbox-grid';

import CalendarField from '../../components/CalendarField';
import TextInput from '../../components/TextInput';
import APIService from '../../services/API';
import DropdownField from '../../components/DropdownField';

import './NewInvestment.scss';

import FileUploadField from '../../components/FileUploadField';
import TextAreaField from '../../components/TextAreaField';
import {
  getBusinessAnalysis,
  getBusinessInformation,
  getBusinessOverview,
  getProductAppeal,
} from '../../utilities/mapingData';
import { emptyInvestment, NewInvestmentSchema } from '../../constants/newInvestment';
import { HouseTypes } from '../../constants/houseTypes';
import HighlightsRegister from '../../components/Register/HighlightsRegister';
import OutlineRegister from '../../components/Register/OutlineRegister';
import SalesAmountRegister from '../../components/Register/SalesAmountRegister';
import PerspectiveDrawingRegister from '../../components/Register/PerspectiveDrawingRegister';
import { UPLOAD_FILE_CONFIG } from '../../constants/fileConfig';
import { statusLandOptions, statusOptions, statusRentalOptions, typeOptions } from '../../constants/projectType';

export default function NewInvestment(props: RouteComponentProps) {
  const [salesRow, setSalesRow] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [houseTypeSelected, setHouseTypeSelected] = useState(HouseTypes[0].value);
  const [businessType, setBusinessType] = useState<string>('LH');

  const handleHouseTypeChanged = (e: any) => {
    setHouseTypeSelected(e.target.value);
  };

  // const selectBusinessType = (type: string) => setBusinessType(type);

  const onKeyDown = (keyEvent: any) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) keyEvent.preventDefault();
  };

  const submitHandler = async (values: any, { setSubmitting, resetForm }: any) => {
    const appeal = getProductAppeal(values);
    const information = getBusinessInformation(values);
    const overview = getBusinessOverview(values);
    const analysis = getBusinessAnalysis(values, houseTypeSelected, salesRow);

    const { ...rest } = values;

    try {
      const formData = new FormData();
      formData.append('invest_id', rest.invest_id);
      formData.append('title', rest.title);
      formData.append('max_invest', rest.max_invest);
      formData.append('won_per_account', rest.won_per_account);
      formData.append('start_date', new Date(rest.start_date.setHours(0, 0, 0)).toISOString());
      formData.append('end_date', new Date(rest.end_date.setHours(23, 59, 59)).toISOString());
      formData.append('panel_image', rest.panel_image);
      formData.append('expected_schedule_image', rest.expected_schedule_image);
      formData.append('thumbnail1', rest.thumbnail1);
      formData.append('thumbnail2', rest.thumbnail2);
      formData.append('thumbnail3', rest.thumbnail3);
      formData.append('product_appeal', JSON.stringify(appeal));
      formData.append('business_information', JSON.stringify(information));
      formData.append('latitude', rest.latitude);
      formData.append('longitude', rest.longitude);
      formData.append('business_overview', JSON.stringify(overview));
      formData.append('business_analysis', JSON.stringify(analysis));
      formData.append('floor_plan_image', rest.floor_plan_image);
      formData.append('perspective_drawing_image1', rest.perspective_drawing_image1);
      formData.append('perspective_drawing_image2', rest.perspective_drawing_image2);
      formData.append('perspective_drawing_image3', rest.perspective_drawing_image3);
      formData.append('related_trust_company', rest.related_trust_company);
      formData.append('related_appraisal', rest.related_appraisal);
      formData.append('related_accounting', rest.related_accounting);
      formData.append('related_legal_affairs', rest.related_legal_affairs);
      formData.append('document1', rest.document1);
      formData.append('document2', rest.document2);
      formData.append('document3', rest.document3);
      formData.append('document4', rest.document4);
      formData.append('document5', rest.document5);
      formData.append('status', rest.status);
      formData.append('business_type', rest.business_type);
      formData.append('account_holder', rest.account_holder);
      formData.append('bank_name', rest.bank_name);
      formData.append('bank_account', rest.bank_account);

      // 입력 form 없음
      formData.append('invest_time', rest.invest_time);
      formData.append('profit', rest.profit);
      formData.append('recruitment_amount', rest.recruitment_amount);

      const data = await APIService.saveInvestment(formData);

      if (data.success && data.data === 'ok') {
        resetForm();
        props.history.push('/investment?status=전체');
      } else {
        setErrorMsg(data.message);
        alert(`상품 추가에 실패했습니다. ${data.message}`);
      }
    } catch (error) {
      setSubmitting(false);
      setErrorMsg('Unable to create new investment.');
      alert(`상품 추가에 실패했습니다. ${error}`);
    }
  };

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="new-investment-wrapper">
      <div className="new-investment-content">
        <h1 className="text-center font-black">New Investment</h1>

        <Formik
          initialValues={emptyInvestment}
          enableReinitialize={true}
          onSubmit={submitHandler}
          validationSchema={NewInvestmentSchema}
        >
          {({ values, isSubmitting }) => (
            <Form className="form-group" onKeyDown={onKeyDown}>
              <label className="label">투자 아이디(Investment ID)</label>
              <Field className="form-control" type="text" name="invest_id" component={TextInput} />

              <label className="label">투자 제목(Title)</label>
              <Field className="form-control" type="text" name="title" component={TextInput} />

              <label className="label">사업 타입</label>
              <Field
                className="form-control"
                name="business_type"
                options={typeOptions}
                component={DropdownField}
                onValueChange={setBusinessType}
              />
              {/* <label className="label">투자 개월 수(Invest time, 숫자가 아닌 문자)</label>
              <Field className="form-control" type="text" name="invest_time" component={TextInput} /> */}

              {/* <label className="label">총 모집 금액(Recruitment Amount, 숫자가 아닌 문자)</label>
              <Field className="form-control" type="text" name="recruitment_amount" component={TextInput} /> */}

              {/* 
              <label className="label">투자 이율 (Profit)</label>
              <div className="profit-group">
                <Field className="form-control" type="number" name="profit" component={TextInput} />
                <span> %</span>
              </div> */}

              <label className="label">1개 구좌당 금액(KRW per 1 account)</label>
              <Field className="form-control" type="number" name="won_per_account" component={TextInput} />

              <label className="label">총 구좌 수 (Total Account)</label>
              <Field className="form-control" type="number" name="max_invest" component={TextInput} />

              <label className="label">입금 계좌 정보</label>
              <Grid>
                <Row>
                  <Col xs={3}>
                    <Field
                      className="form-control"
                      type="text"
                      name="account_holder"
                      component={TextInput}
                      placeholder="예금주"
                    />
                  </Col>

                  <Col xs={3}>
                    <Field
                      className="form-control"
                      type="text"
                      name="bank_name"
                      component={TextInput}
                      placeholder="은행명"
                    />
                  </Col>

                  <Col xs={6}>
                    <Field
                      className="form-control"
                      type="number"
                      name="bank_account"
                      component={TextInput}
                      placeholder="은행계좌"
                    />
                  </Col>
                </Row>
              </Grid>

              <label className="label">
                투자 정보 배경이미지 <small> 권장 이미지 사이즈 (937 * 324)</small>
              </label>
              <Field
                component={FileUploadField}
                value={values.panel_image}
                name="panel_image"
                uploadConfig={UPLOAD_FILE_CONFIG}
                chooseLabel="투자 정보 이미지"
              />

              <label className="label">썸네일</label>
              <Grid>
                <Row>
                  <Col xs={6}>
                    <Field
                      component={FileUploadField}
                      value={values.thumbnail1}
                      name="thumbnail1"
                      uploadConfig={UPLOAD_FILE_CONFIG}
                      chooseLabel="썸네일 1"
                    />
                  </Col>
                  <Col xs={6}>
                    <Field
                      component={FileUploadField}
                      value={values.thumbnail2}
                      name="thumbnail2"
                      uploadConfig={UPLOAD_FILE_CONFIG}
                      chooseLabel="썸네일 2"
                    />
                  </Col>
                  <Col xs={6} style={{ marginTop: '10px' }}>
                    <Field
                      component={FileUploadField}
                      value={values.thumbnail3}
                      name="thumbnail3"
                      uploadConfig={UPLOAD_FILE_CONFIG}
                      chooseLabel="썸네일 3"
                    />
                  </Col>
                  <Col xs={6} style={{ marginTop: '10px' }} />
                </Row>
              </Grid>

              <label className="label">상품 어필 내용</label>
              <Grid>
                <Row>
                  <Col xs={6}>
                    <Field
                      className="form-control"
                      type="text"
                      name="appealContent1"
                      placeholder="어필 내용1 "
                      rows={2}
                      component={TextAreaField}
                      style={{ padding: '20px' }}
                    />
                  </Col>
                  <Col xs={6}>
                    <Field
                      className="form-control"
                      type="text"
                      name="appealContent2"
                      placeholder="어필 내용2"
                      rows={2}
                      component={TextAreaField}
                      style={{ padding: '20px' }}
                    />
                  </Col>
                  <Col xs={6} style={{ marginTop: '10px' }}>
                    <Field
                      className="form-control"
                      type="text"
                      name="appealContent3"
                      placeholder="어필 내용3"
                      rows={2}
                      component={TextAreaField}
                      style={{ padding: '20px' }}
                    />
                  </Col>
                </Row>
              </Grid>

              {businessType !== '부동산' && (
                <>
                  <label className="label">예상일정</label>
                  <Field
                    component={FileUploadField}
                    value={values.expected_schedule_image}
                    name="expected_schedule_image"
                    uploadConfig={UPLOAD_FILE_CONFIG}
                    chooseLabel="예상일정 이미지"
                  />
                </>
              )}

              <label className="label">주요사항</label>
              <div className="product-content__grid">
                <HighlightsRegister type={businessType} />
              </div>

              <label className="label">
                부지위치 <small>(위도/경도)</small>
              </label>
              <Grid>
                <Row>
                  <Col xs={6}>
                    <Field
                      className="form-control"
                      type="number"
                      name="latitude"
                      component={TextInput}
                      placeholder="위도"
                    />
                  </Col>

                  <Col xs={6}>
                    <Field
                      className="form-control"
                      type="number"
                      name="longitude"
                      component={TextInput}
                      placeholder="경도"
                    />
                  </Col>
                </Row>
              </Grid>

              <label className="label">건축개요</label>
              <OutlineRegister type={businessType} />

              <label className="label">예상수지분석</label>
              <div className="product-content__table">
                <SalesAmountRegister
                  type={businessType}
                  values={values}
                  salesRow={salesRow}
                  setSalesRow={setSalesRow}
                  houseTypeSelected={houseTypeSelected}
                  handleHouseTypeChanged={handleHouseTypeChanged}
                />

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
                        <td>매입비용</td>
                        <td className="right">
                          <Field className="form-control" type="number" name="detailSpending0" component={TextInput} />
                        </td>
                        <td className="left">
                          <Field
                            className="form-control"
                            type="text"
                            name="detailSpending1"
                            rows={2}
                            component={TextAreaField}
                          />
                        </td>
                      </tr>
                      {businessType !== '부동산' && (
                        <>
                          <tr>
                            <td>공사비</td>
                            <td className="right">
                              <Field
                                className="form-control"
                                type="number"
                                name="detailSpending2"
                                component={TextInput}
                              />
                            </td>
                            <td className="left">
                              <Field
                                className="form-control"
                                type="text"
                                name="detailSpending3"
                                rows={2}
                                component={TextAreaField}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>설계 / 감리</td>
                            <td className="right">
                              <Field
                                className="form-control"
                                type="number"
                                name="detailSpending4"
                                component={TextInput}
                              />
                            </td>
                            <td className="left">
                              <Field
                                className="form-control"
                                type="text"
                                name="detailSpending5"
                                rows={2}
                                component={TextAreaField}
                              />
                            </td>
                          </tr>
                        </>
                      )}
                      {businessType === '부동산' && (
                        <tr>
                          <td>토목비용</td>
                          <td className="right">
                            <Field
                              className="form-control"
                              type="number"
                              name="detailSpending4"
                              component={TextInput}
                            />
                          </td>
                          <td className="left">
                            <Field
                              className="form-control"
                              type="text"
                              name="detailSpending5"
                              rows={2}
                              component={TextAreaField}
                            />
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td>제세비용</td>
                        <td className="right">
                          <Field className="form-control" type="number" name="detailSpending6" component={TextInput} />
                        </td>
                        <td className="left">
                          <Field
                            className="form-control"
                            type="text"
                            name="detailSpending7"
                            rows={2}
                            component={TextAreaField}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>사업추진비</td>
                        <td className="right">
                          <Field className="form-control" type="number" name="detailSpending8" component={TextInput} />
                        </td>
                        <td className="left">
                          <Field
                            className="form-control"
                            type="text"
                            name="detailSpending9"
                            rows={2}
                            component={TextAreaField}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>금융비용</td>
                        <td className="right">
                          <Field className="form-control" type="number" name="detailSpending10" component={TextInput} />
                        </td>
                        <td className="left">
                          <Field
                            className="form-control"
                            type="text"
                            name="detailSpending11"
                            rows={2}
                            component={TextAreaField}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>총계</td>
                        <td className="left">
                          <Field
                            className="form-control"
                            type="number"
                            name="detailSpending12"
                            component={TextInput}
                            value={
                              +values.detailSpending0 +
                              +values.detailSpending2 +
                              +values.detailSpending4 +
                              +values.detailSpending6 +
                              +values.detailSpending8 +
                              +values.detailSpending10
                            }
                          />
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {businessType !== '부동산' && (
                <>
                  <label className="label">평면도</label>
                  <Field
                    component={FileUploadField}
                    value={values.floor_plan_image}
                    name="floor_plan_image"
                    uploadConfig={UPLOAD_FILE_CONFIG}
                    chooseLabel="평면도"
                  />
                </>
              )}

              {/* 투시도 / 사진 */}
              <PerspectiveDrawingRegister
                type={businessType}
                perspective_drawing_image1={values.perspective_drawing_image1}
                perspective_drawing_image2={values.perspective_drawing_image2}
                perspective_drawing_image3={values.perspective_drawing_image3}
              />

              <label className="label">추천 파트너사</label>
              <ul className="product-content__list">
                {businessType !== '부동산' && (
                  <li>
                    <strong>신탁사</strong>
                    <span>
                      <Field className="form-control" type="text" name="related_trust_company" component={TextInput} />
                    </span>
                  </li>
                )}
                <li>
                  <strong>감정평가</strong>
                  <span>
                    <Field className="form-control" type="text" name="related_appraisal" component={TextInput} />
                  </span>
                </li>
                <li>
                  <strong>회계법인</strong>
                  <span>
                    <Field className="form-control" type="text" name="related_accounting" component={TextInput} />
                  </span>
                </li>
                <li>
                  <strong>법무법인</strong>
                  <span>
                    <Field className="form-control" type="text" name="related_legal_affairs" component={TextInput} />
                  </span>
                </li>
              </ul>

              <label className="label">프로젝트 서류</label>
              <Grid>
                <Row>
                  <Col xs={6}>
                    <Field
                      component={FileUploadField}
                      value={values.document1}
                      name="document1"
                      uploadConfig={UPLOAD_FILE_CONFIG}
                      chooseLabel="서류 1"
                    />
                  </Col>
                  <Col xs={6}>
                    <Field
                      component={FileUploadField}
                      value={values.document2}
                      name="document2"
                      uploadConfig={UPLOAD_FILE_CONFIG}
                      chooseLabel="서류 2"
                    />
                  </Col>
                  <Col xs={6} style={{ marginTop: '10px' }}>
                    <Field
                      component={FileUploadField}
                      value={values.document3}
                      name="document3"
                      uploadConfig={UPLOAD_FILE_CONFIG}
                      chooseLabel="서류 3"
                    />
                  </Col>
                  <Col xs={6}>
                    <Field
                      component={FileUploadField}
                      value={values.document4}
                      name="document4"
                      uploadConfig={UPLOAD_FILE_CONFIG}
                      chooseLabel="서류 4"
                    />
                  </Col>
                  <Col xs={6} style={{ marginTop: '10px' }}>
                    <Field
                      component={FileUploadField}
                      value={values.document5}
                      name="document5"
                      uploadConfig={UPLOAD_FILE_CONFIG}
                      chooseLabel="서류 5"
                    />
                  </Col>
                  <Col xs={6} />
                </Row>
              </Grid>

              <label className="label">약관 1</label>

              <label className="label">모집 기간 (Investment Date)</label>
              <div className="date-group">
                <Field
                  className="form-control"
                  name="start_date"
                  dateFormat="yy/mm/dd"
                  showTime={true}
                  component={CalendarField}
                />
                <span> - </span>
                <Field
                  className="form-control"
                  name="end_date"
                  dateFormat="yy/mm/dd"
                  showTime={true}
                  component={CalendarField}
                />
              </div>
              <label className="label">모집 상태 (Status)</label>
              <Field
                className="form-control"
                type="number"
                name="status"
                options={
                  businessType === '부동산'
                    ? statusLandOptions
                    : businessType === '임대'
                    ? statusRentalOptions
                    : statusOptions
                }
                component={DropdownField}
              />
              {errorMsg && <div className="text-error">{errorMsg}</div>}
              <div className="submit-wrapper">
                <Button
                  type="button"
                  className="font-medium btn-1"
                  label="Cancel"
                  onClick={() => props.history.push('/investment?status=전체')}
                />
                <Button disabled={isSubmitting} type="submit" className="font-medium" label="Save" />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
