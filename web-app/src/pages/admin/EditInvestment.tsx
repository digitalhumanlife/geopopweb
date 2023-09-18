import moment from 'moment';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import qs from 'query-string';
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
  getBusinessOverview,
  getBusinessInformation,
  getProductAppeal,
} from '../../utilities/mapingData';
import { emptyInvestment, initFile, NewInvestmentSchema } from '../../constants/newInvestment';
import { toFile } from '../../utilities/changeFile';
import { HouseTypes } from '../../constants/houseTypes';
import HighlightsRegister from '../../components/Register/HighlightsRegister';
import OutlineRegister from '../../components/Register/OutlineRegister';
import SalesAmountRegister from '../../components/Register/SalesAmountRegister';
import PerspectiveDrawingRegister from '../../components/Register/PerspectiveDrawingRegister';
import { UPLOAD_FILE_CONFIG } from '../../constants/fileConfig';
import {
  TypeOptionsType,
  statusLandOptions,
  statusOptions,
  statusRentalOptions,
  typeOptions,
} from '../../constants/projectType';

export default function EditInvestment(props: RouteComponentProps) {
  const query: any = qs.parse(props.location.search);
  const [salesRow, setSalesRow] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [initialValues, setSelectedInvestment] = useState<any>(emptyInvestment);
  const [houseTypeSelected, setHouseTypeSelected] = useState(HouseTypes[0].value);
  const [defaultFile, setDefaultFile] = useState<any>(initFile);
  const [businessType, setBusinessType] = useState<string>('');

  const handleHouseTypeChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setHouseTypeSelected(e.target.value);

  // const selectBusinessType = (type: string) => setBusinessType(type);

  const onKeyDown = (keyEvent: any) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) keyEvent.preventDefault();
  };

  const handleCompleteClick = async (id: string, complete: boolean) => {
    const res = await APIService.completeInvestment(id, complete);
    if (res.success) props.history.push('/investment?status=전체');
  };

  const getInvestment = async (id: string) => {
    const response = await APIService.getInvestment(id);
    if (!response.success && response.data.length === 0) return;
    const thumbnail1 = await toFile(response.data[0].thumbnail1);
    const thumbnail2 = await toFile(response.data[0].thumbnail2);
    const thumbnail3 = await toFile(response.data[0].thumbnail3);
    const panel_image = await toFile(response.data[0].panel_image);
    const expected_schedule_image = await toFile(response.data[0].expected_schedule_image);
    const floor_plan_image = await toFile(response.data[0].floor_plan_image);
    const perspective_drawing_image1 = await toFile(response.data[0].perspective_drawing_image1);
    const perspective_drawing_image2 = await toFile(response.data[0].perspective_drawing_image2);
    const perspective_drawing_image3 = await toFile(response.data[0].perspective_drawing_image3);
    const document1 =
      response.data[0].document1 && response.data[0].document1.includes('Error') === false
        ? await toFile(response.data[0].document1)
        : '';
    const document2 =
      response.data[0].document2 && response.data[0].document2.includes('Error') === false
        ? await toFile(response.data[0].document2)
        : '';
    const document3 =
      response.data[0].document3 && response.data[0].document3.includes('Error') === false
        ? await toFile(response.data[0].document3)
        : '';
    const document4 =
      response.data[0].document4 && response.data[0].document4.includes('Error') === false
        ? await toFile(response.data[0].document4)
        : '';
    const document5 =
      response.data[0].document5 && response.data[0].document5.includes('Error') === false
        ? await toFile(response.data[0].document5)
        : '';

    const appeal = JSON.parse(response.data[0].product_appeal);
    const information = JSON.parse(response.data[0].business_information);
    const overview = JSON.parse(response.data[0].business_overview);
    const analysis = JSON.parse(response.data[0].business_analysis);
    setSelectedInvestment(() => ({
      ...response.data[0],
      panel_image,
      expected_schedule_image,
      thumbnail1,
      thumbnail2,
      thumbnail3,
      floor_plan_image,
      perspective_drawing_image1,
      perspective_drawing_image2,
      perspective_drawing_image3,
      document1,
      document2,
      document3,
      document4,
      document5,
      appealContent1: appeal.first,
      appealContent2: appeal.second,
      appealContent3: appeal.third,
      detailInfo0: information.code,
      detailInfo1: information.fund,
      detailInfo2: information.period,
      detailInfo3: information.accounts,
      detailInfo4: information.endPoint,
      detailInfo5: information.purpose,
      detailInfo6: information.appraisal,
      detailInfo7: information.startParticipate,
      detailInfo8: information.expenditure,
      detailInfo9: information.endParticipate,
      detailInfo10: information.salesPurpose,
      detailSummary0: overview.location,
      detailSummary1: overview.area,
      detailSummary2: overview.areaRatio,
      detailSummary3: overview.usage,
      detailSummary4: overview.scale,
      detailSummary5: overview.parkingLot,
      detailSummary6: overview.note,
      detailSales0: analysis.salesAnalysis[0].division,
      detailSales1: analysis.salesAnalysis[0].sales,
      detailSales2: analysis.salesAnalysis[0].area,
      detailSales3: analysis.salesAnalysis[0].pyeongPrice,
      detailSales4: analysis.salesAnalysis[0].generationPrice,
      detailSales5: analysis.salesAnalysis[0].generations,
      detailSales6: analysis.salesAnalysis[0].note,
      detailSpending0: analysis.expenditureAnalysis.landCost,
      detailSpending1: analysis.expenditureAnalysis.land,
      detailSpending2: analysis.expenditureAnalysis.constructionCost,
      detailSpending3: analysis.expenditureAnalysis.construction,
      detailSpending4: analysis.expenditureAnalysis.designCost,
      detailSpending5: analysis.expenditureAnalysis.design,
      detailSpending6: analysis.expenditureAnalysis.taxCost,
      detailSpending7: analysis.expenditureAnalysis.tax,
      detailSpending8: analysis.expenditureAnalysis.propelCost,
      detailSpending9: analysis.expenditureAnalysis.propel,
      detailSpending10: analysis.expenditureAnalysis.financeCost,
      detailSpending11: analysis.expenditureAnalysis.finance,
      detailSpending12: analysis.expenditureAnalysis.totalCost,
      start_date: moment(response.data[0].start_date).toDate(),
      end_date: moment(response.data[0].end_date).toDate(),
    }));

    setBusinessType(response.data[0].business_type);
    setHouseTypeSelected(analysis.salesAnalysis[0].type);

    if (analysis.salesAnalysis) {
      analysis.salesAnalysis.map((item: any, idx: number) => {
        const a = `detailSales0${idx - 1}`;
        const b = `detailSales1${idx - 1}`;
        const c = `detailSales2${idx - 1}`;
        const d = `detailSales3${idx - 1}`;
        const e = `detailSales4${idx - 1}`;
        const f = `detailSales5${idx - 1}`;
        if (idx !== 0) {
          return setSelectedInvestment((value: any) => ({
            ...value,
            [a]: item.division,
            [b]: item.sales,
            [c]: item.area,
            [d]: item.pyeongPrice,
            [e]: item.generationPrice,
            [f]: item.generations,
          }));
        } else {
          return setSelectedInvestment((value: any) => ({
            ...value,
            detailSales0: item.division,
            detailSales1: item.sales,
            detailSales2: item.area,
            detailSales3: item.pyeongPrice,
            detailSales4: item.generationPrice,
            detailSales5: item.generations,
          }));
        }
      });
      setSalesRow(analysis.salesAnalysis.length - 1);
    }
    setDefaultFile({
      thumbnail1,
      thumbnail2,
      thumbnail3,
      panel_image,
      expected_schedule_image,
      floor_plan_image,
      perspective_drawing_image1,
      perspective_drawing_image2,
      perspective_drawing_image3,
      document1,
      document2,
      document3,
      document4,
      document5,
    });
  };

  const submitHandler = async (values: any) => {
    const appeal = getProductAppeal(values);
    const information = getBusinessInformation(values);
    const overview = getBusinessOverview(values);
    const analysis = getBusinessAnalysis(values, houseTypeSelected, salesRow);
    const { ...rest } = values;

    try {
      const formData = new FormData();
      formData.append('id', query.id);
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
      formData.append('business_information ', JSON.stringify(information));
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
      formData.append('address', rest.detailSummary0);
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
        props.history.push('/investment?status=전체');
      } else {
        setErrorMsg(data.message);
        alert(`상품 수정에 실패하였습니다. ${data.message}`);
      }
    } catch (error) {
      setErrorMsg('Unable to create Edit investment.');
      alert(`상품 수정에 실패하였습니다. ${error}`);
    }
  };

  useEffect(() => {
    getInvestment(query.id);
  }, [query.id]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="new-investment-wrapper">
      <div className="new-investment-content">
        <h1 className="text-center font-black">Edit Investment</h1>

        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          onSubmit={submitHandler}
          validationSchema={NewInvestmentSchema}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form className="form-group" onKeyDown={onKeyDown}>
              <label className="label">투자 아이디(Investment ID)</label>
              <Field className="form-control" type="text" name="invest_id" component={TextInput} />

              <label className="label">투자 제목(Title)</label>
              <Field className="form-control" type="text" name="title" component={TextInput} />

              <label className="label">사업 타입</label>
              <Field
                className="form-control"
                type="text"
                name="business_type"
                value={typeOptions.filter((val: TypeOptionsType) => val.value === businessType)[0]?.label}
                component={TextInput}
                disabled
              />
              {/* <label className="label">투자 개월 수(Invest time, 숫자가 아닌 문자)</label>
              <Field className="form-control" type="text" name="invest_time" component={TextInput} /> */}

              {/* <label className="label">총 모집 금액(Recruitment Amount, 숫자가 아닌 문자)</label>
              <Field className="form-control" type="text" name="recruitment_amount" component={TextInput} /> */}

              {/* <label className="label">투자 이율 (Profit)</label>
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

              {query.id && (
                <>
                  <label className="label">기존 썸네일</label>
                  <Grid>
                    <Row>
                      {values.thumbnail1?.name && values.thumbnail1 === defaultFile.thumbnail1 && (
                        <Col xs={6}>
                          <span style={{ display: 'block', marginBottom: '6px' }}>썸네일 1</span>
                          <a
                            href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${values.thumbnail1?.name}`}
                          >
                            {values.thumbnail1?.name}
                          </a>
                          <button type="reset" className="btn-delete" onClick={() => setFieldValue('thumbnail1', '')}>
                            Reset
                          </button>
                        </Col>
                      )}
                      {values.thumbnail2?.name && values.thumbnail2 === defaultFile.thumbnail2 && (
                        <Col xs={6}>
                          <span style={{ display: 'block', marginBottom: '6px' }}>썸네일 2</span>
                          <a
                            href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${values.thumbnail2?.name}`}
                          >
                            {values.thumbnail2?.name}
                          </a>
                          <button type="reset" className="btn-delete" onClick={() => setFieldValue('thumbnail2', '')}>
                            Reset
                          </button>
                        </Col>
                      )}
                    </Row>
                    <Row>
                      {values.thumbnail3?.name && values.thumbnail3 === defaultFile.thumbnail3 && (
                        <Col xs={6}>
                          <span style={{ display: 'block', marginBottom: '6px' }}>썸네일 3</span>
                          <a
                            href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${values.thumbnail3?.name}`}
                          >
                            {values.thumbnail3?.name}
                          </a>
                          <button type="reset" className="btn-delete" onClick={() => setFieldValue('thumbnail3', '')}>
                            Reset
                          </button>
                        </Col>
                      )}
                      <Col xs={6} />
                    </Row>
                  </Grid>
                </>
              )}

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

              {query.id && (
                <>
                  <label className="label">기존 투자 정보 배경이미지</label>
                  {values.panel_image?.name && values.panel_image === defaultFile.panel_image && (
                    <Col xs={6}>
                      <span style={{ display: 'block', marginBottom: '6px' }}>투자 정보 이미지</span>
                      <a
                        href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${values.panel_image?.name}`}
                      >
                        {values.panel_image?.name}
                      </a>
                      <button type="reset" className="btn-delete" onClick={() => setFieldValue('panel_image', '')}>
                        Reset
                      </button>
                    </Col>
                  )}
                </>
              )}

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

              {businessType !== '부동산' && query.id && (
                <>
                  <label className="label">기존 예상일정 이미지</label>
                  {values.expected_schedule_image?.name &&
                    values.expected_schedule_image === defaultFile.expected_schedule_image && (
                      <Col xs={6}>
                        <span style={{ display: 'block', marginBottom: '6px' }}>예상일정 이미지</span>
                        <a
                          href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${values.expected_schedule_image?.name}`}
                        >
                          {values.expected_schedule_image?.name}
                        </a>
                        <button
                          type="reset"
                          className="btn-delete"
                          onClick={() => setFieldValue('expected_schedule_image', '')}
                        >
                          Reset
                        </button>
                      </Col>
                    )}
                </>
              )}

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
                  {query.id && (
                    <>
                      <label className="label">기존 평면도</label>
                      {values.floor_plan_image?.name && values.floor_plan_image === defaultFile.floor_plan_image && (
                        <Col xs={6}>
                          <span style={{ display: 'block', marginBottom: '6px' }}>투자 정보 이미지</span>
                          <a
                            href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${values.floor_plan_image?.name}`}
                          >
                            {values.floor_plan_image?.name}
                          </a>
                          <button
                            type="reset"
                            className="btn-delete"
                            onClick={() => setFieldValue('floor_plan_image', '')}
                          >
                            Reset
                          </button>
                        </Col>
                      )}
                    </>
                  )}

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

              {query.id && (
                <>
                  {businessType !== '부동산' ? (
                    <label className="label">기존 투시도 이미지 슬라이드</label>
                  ) : (
                    <label className="label">기존 사진 슬라이드</label>
                  )}
                  <Grid>
                    <Row>
                      {values.perspective_drawing_image1?.name &&
                        values.perspective_drawing_image1 === defaultFile.perspective_drawing_image1 && (
                          <Col xs={6}>
                            {businessType !== '부동산' ? (
                              <span style={{ display: 'block', marginBottom: '6px' }}>투시도 1</span>
                            ) : (
                              <span style={{ display: 'block', marginBottom: '6px' }}>사진 1</span>
                            )}
                            <a
                              href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${values.perspective_drawing_image1?.name}`}
                            >
                              {values.perspective_drawing_image1?.name}
                            </a>
                            <button
                              type="reset"
                              className="btn-delete"
                              onClick={() => setFieldValue('perspective_drawing_image1', '')}
                            >
                              Reset
                            </button>
                          </Col>
                        )}
                      {values.perspective_drawing_image2?.name &&
                        values.perspective_drawing_image2 === defaultFile.perspective_drawing_image2 && (
                          <Col xs={6}>
                            {businessType !== '부동산' ? (
                              <span style={{ display: 'block', marginBottom: '6px' }}>투시도 2</span>
                            ) : (
                              <span style={{ display: 'block', marginBottom: '6px' }}>사진 2</span>
                            )}

                            <a
                              href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${values.perspective_drawing_image2?.name}`}
                            >
                              {values.perspective_drawing_image2?.name}
                            </a>
                            <button
                              type="reset"
                              className="btn-delete"
                              onClick={() => setFieldValue('perspective_drawing_image2', '')}
                            >
                              Reset
                            </button>
                          </Col>
                        )}
                    </Row>
                    <Row>
                      {values.perspective_drawing_image3?.name &&
                        values.perspective_drawing_image3 === defaultFile.perspective_drawing_image3 && (
                          <Col xs={6}>
                            {businessType !== '부동산' ? (
                              <span style={{ display: 'block', marginBottom: '6px' }}>투시도 3</span>
                            ) : (
                              <span style={{ display: 'block', marginBottom: '6px' }}>사진 3</span>
                            )}

                            <a
                              href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${values.perspective_drawing_image3?.name}`}
                            >
                              {values.perspective_drawing_image3?.name}
                            </a>
                            <button
                              type="reset"
                              className="btn-delete"
                              onClick={() => setFieldValue('perspective_drawing_image3', '')}
                            >
                              Reset
                            </button>
                          </Col>
                        )}
                      <Col xs={6} />
                    </Row>
                  </Grid>
                </>
              )}

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

              {query.id && (
                <>
                  <label className="label">기존 프로젝트 서류</label>
                  <Grid>
                    <Row>
                      {values.document1?.name && values.document1 === defaultFile.document1 && (
                        <Col xs={6}>
                          <span style={{ display: 'block', marginBottom: '6px' }}>서류 1</span>
                          <a
                            href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${values.document1?.name}`}
                          >
                            {values.document1?.name}
                          </a>
                          <button type="reset" className="btn-delete" onClick={() => setFieldValue('document1', '')}>
                            Reset
                          </button>
                        </Col>
                      )}
                      {values.document2?.name && values.document2 === defaultFile.document2 && (
                        <Col xs={6}>
                          <span style={{ display: 'block', marginBottom: '6px' }}>서류 2</span>
                          <a
                            href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${values.document2?.name}`}
                          >
                            {values.document2?.name}
                          </a>
                          <button type="reset" className="btn-delete" onClick={() => setFieldValue('document2', '')}>
                            Reset
                          </button>
                        </Col>
                      )}
                    </Row>
                    <Row>
                      {values.document3?.name && values.document3 === defaultFile.document3 && (
                        <Col xs={6}>
                          <span style={{ display: 'block', marginBottom: '6px' }}>서류 3</span>
                          <a
                            href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${values.document3?.name}`}
                          >
                            {values.document3?.name}
                          </a>
                          <button type="reset" className="btn-delete" onClick={() => setFieldValue('document3', '')}>
                            Reset
                          </button>
                        </Col>
                      )}
                      {values.document4?.name && values.document4 === defaultFile.document4 && (
                        <Col xs={6}>
                          <span style={{ display: 'block', marginBottom: '6px' }}>서류 4</span>
                          <a
                            href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${values.document4?.name}`}
                          >
                            {values.document4?.name}
                          </a>
                          <button type="reset" className="btn-delete" onClick={() => setFieldValue('document4', '')}>
                            Reset
                          </button>
                        </Col>
                      )}
                    </Row>
                    <Row>
                      {values.document5?.name && values.document5 && values.document5 === defaultFile.document5 && (
                        <Col xs={6}>
                          <span style={{ display: 'block', marginBottom: '6px' }}>서류 5</span>
                          <a
                            href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${values.document5?.name}`}
                          >
                            {values.document5?.name}
                          </a>
                          <button type="reset" className="btn-delete" onClick={() => setFieldValue('document5', '')}>
                            Reset
                          </button>
                        </Col>
                      )}
                      <Col xs={6} />
                    </Row>
                  </Grid>
                </>
              )}
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
              <div className="label">
                모집 상태 (Status)
                {values.recruitment_complete ? (
                  <span>
                    :<span className="complete">결성완료상태</span>
                  </span>
                ) : (
                  values.max_invest === values.current_invest && (
                    <Button
                      type="button"
                      className="label__btn"
                      label="모집상태 결성완료로 변경하기"
                      onClick={() => {
                        handleCompleteClick(values.id, !values.recruitment_complete);
                      }}
                    />
                  )
                )}
              </div>
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
