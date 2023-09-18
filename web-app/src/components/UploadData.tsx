import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import React, { useState } from 'react';
import { Col, Row } from 'react-flexbox-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import FileUploadField from './FileUploadField';
import InputTextField from './InputTextField';
import APIService from '../services/API';

import './UploadData.scss';
import { isEmpty } from 'lodash';
import { RouteComponentProps } from 'react-router';
import { UploadFormSchema } from '../schema/uploadForm';
import { UPLOAD_FILE_CONFIG } from '../constants/fileConfig';

const defaultFormValue = {
  address: '',
  name: '',
  amount: 0,
  doc1: null,
  doc2: null,
  doc3: null,
  doc4: null,
};

export default function UploadData(props: RouteComponentProps) {
  const [address, setAddress] = useState<string>('');
  const [searchCount, setSearchCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [searchResultItems, setSearchResultItems] = useState<any[]>([]);
  const [showSearchResult, setShowSearchResult] = useState<boolean>(false);
  const [isHasMore, setHasMore] = useState<boolean>(false);
  const [searchResultMessage, setSearchResultMessage] = useState<string>();
  const [isLoadingSearchAddress, setLoadingSearchAddress] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>();
  const [initialValues, setInitialValues] = useState<any>(defaultFormValue);
  const [errorMsg, setErrorMsg] = useState<string>();

  const handleAddressChange = (e: any) => {
    setAddress(e.target.value);
    setInitialValues({ ...initialValues, address: e.target.value });
  };

  const handleAddressClick = (e: any) => {
    if (searchResultItems.length > 0) {
      setShowSearchResult(true);
    }
  };

  const getSearchAddressResult = async (params: any) => {
    let countData = 0;
    if (params.page === 0) {
      const countRes = await APIService.countSearchingGrounds(params);
      countData = countRes.data;
      setSearchCount(countData);
    }
    setPage(params.page);
    try {
      const results = await APIService.searchGrounds({ ...params, paging: true, page: params.page });
      if (results && results.data) {
        const newItems = results.data || [];
        if (params.page === 0) {
          setSearchResultItems(newItems);
        } else {
          setSearchResultItems([...searchResultItems, ...newItems]);
        }
        setShowSearchResult(true);
        setHasMore(results.data.length === results.result.itemPerPage);
        setSearchResultMessage(
          `${countData > 0 ? countData : searchCount} 결과 (${(results.time / 1000).toFixed(6)} 초)`,
        );
        setLoadingSearchAddress(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFind = async () => {
    getSearchAddressResult({
      city: address,
      gu: address,
      dong: address,
      type: 0,
      page: 0,
    });
  };

  const handleShowMoreSearchResult = async () => {
    getSearchAddressResult({
      city: address,
      gu: address,
      dong: address,
      type: 0,
      page: page + 1,
    });
  };

  const submitHandler = async (values: any, { setSubmitting, resetForm }: any) => {
    if (selectedItem && !isEmpty(selectedItem.uniqueNum)) {
      await APIService.uploadDocuments({ ...values, uniqueNum: selectedItem.uniqueNum });
      setInitialValues(defaultFormValue);
      setErrorMsg('');
      resetForm();
      props.history.go(0);
    } else {
      setErrorMsg('Please select address from list');
    }
  };

  const renderSearchContent = (item: any) => {
    const handleClickSearchContent = async () => {
      setSelectedItem(item);
      setShowSearchResult(false);
      setAddress(item.address || item.address_name);
      setInitialValues({ ...initialValues, address: item.address || item.address_name });
    };
    return (
      <div className="search-result-item" onClick={handleClickSearchContent}>
        <div className="search-result-icon">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
        </div>
        <div className="search-result-detail w-full">
          <div>{item.address && typeof item.address !== 'object' ? item.address : item.address_name}</div>
          <div>
            {item.usageAreaName
              ? item.usageAreaName
              : item.road_address
              ? item.road_address.address_name
              : item.road_address_name}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="upload-data">
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={submitHandler}
        validationSchema={UploadFormSchema}
      >
        {({ values, isSubmitting }) => {
          return (
            <Form className="form-group">
              <Row>
                <Col xs={3} className="label">
                  Enter Address
                </Col>
                <Col xs={7} className="search-result-wrapper">
                  <Field
                    component={InputTextField}
                    value={values.address}
                    name="address"
                    onChange={handleAddressChange}
                    onClick={handleAddressClick}
                  />
                  {showSearchResult && (
                    <div className="search-result">
                      {!isLoadingSearchAddress && (
                        <div className="search-result-header">
                          <div>{searchResultMessage}</div>
                        </div>
                      )}
                      {isLoadingSearchAddress && (
                        <div className="text-center">
                          <i className="pi-search-icon pi pi-spin pi-spinner fsi-18px"></i>
                        </div>
                      )}

                      <div className="search-result-content">{searchResultItems.map(renderSearchContent)}</div>
                      {isHasMore && (
                        <div className="show-more">
                          <a onClick={handleShowMoreSearchResult}>Show more</a>
                        </div>
                      )}
                    </div>
                  )}
                </Col>
                <Col xs={2} className="flex-self-center">
                  <Button label="Find" type="button" onClick={handleFind} />
                  {selectedItem && (
                    <a
                      className="p-button p-component go-btn"
                      href={`https://groundcontrol.co.kr/?lat=${selectedItem.y}&lng=${selectedItem.x}`}
                      target="_blank"
                    >
                      Go
                    </a>
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs={3} className="label">
                  Full Name
                </Col>
                <Col xs={9} className="search-result-wrapper">
                  <Field component={InputTextField} value={values.name} name="name" />
                </Col>
              </Row>
              <Row>
                <Col xs={3} className="label">
                  Loan Amount
                </Col>
                <Col xs={9} className="flex-self-center">
                  <Field component={InputTextField} type="number" value={values.amount} name="amount" />
                  <span className="pt-20">KRW</span>
                </Col>
              </Row>
              {/* <Row>
                <Col xs={12}>
                  <iframe id="frame" src="http://groundcontrol.co.kr" width="100%" height="800px" />
                </Col>
              </Row> */}
              <Row className="text-bold">
                <Col xs={3} className="label">
                  Document 1
                </Col>
                <Col xs={9}>
                  <Field
                    component={FileUploadField}
                    value={values.doc1}
                    name="doc1"
                    uploadConfig={UPLOAD_FILE_CONFIG}
                    chooseLabel="Choose"
                  />
                </Col>
              </Row>
              <Row className="text-bold">
                <Col xs={3} className="label">
                  Document 2
                </Col>
                <Col xs={9}>
                  <Field
                    component={FileUploadField}
                    value={values.doc2}
                    name="doc2"
                    uploadConfig={UPLOAD_FILE_CONFIG}
                    chooseLabel="Choose"
                  />
                </Col>
              </Row>
              <Row className="text-bold">
                <Col xs={3} className="label">
                  Document 3
                </Col>
                <Col xs={9}>
                  <Field
                    component={FileUploadField}
                    value={values.doc3}
                    name="doc3"
                    uploadConfig={UPLOAD_FILE_CONFIG}
                    chooseLabel="Choose"
                  />
                </Col>
              </Row>
              <Row className="text-bold">
                <Col xs={3} className="label">
                  Document 4
                </Col>
                <Col xs={9}>
                  <Field
                    component={FileUploadField}
                    value={values.doc4}
                    name="doc4"
                    uploadConfig={UPLOAD_FILE_CONFIG}
                    chooseLabel="Choose"
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>{errorMsg && errorMsg.length > 0 && <div className="error-feedback">{errorMsg}</div>}</Col>
              </Row>
              <Row>
                <Col xs={12} className="text-center button-group">
                  {isSubmitting && <i className="pi pi-spin pi-spinner" />}
                  <Button disabled={isSubmitting} label="Submit" type="submit" />
                  <Button className="p-button-warning" disabled={isSubmitting} label="Reset" type="button" />
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
