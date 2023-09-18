import classnames from 'classnames';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import React, { useState } from 'react';
import { Col, Grid, Row } from 'react-flexbox-grid';
import { isEmpty } from 'lodash';
import { RouteComponentProps } from 'react-router';
import * as Yup from 'yup';

import CalendarField from '../components/CalendarField';
import DropdownField from '../components/DropdownField';
import InputTextField from '../components/InputTextField';
import RadioButtonField from '../components/RadioButtonField';
import FileUploadField from '../components/FileUploadField';
import CheckboxField from '../components/CheckboxField';
import { useUser } from '../store/hooks/hooks';
import APIService from '../services/API';

import './Loan.scss';
import { NavLink } from 'react-router-dom';
import { UPLOAD_FILE_CONFIG } from '../constants/fileConfig';

const defaultFormValue = {
  groundAddress: '',
  amount: 1000,
  purpose: '',
  term: '',
  firstName: '',
  lastName: '',
  gender: '',
  maritalStatus: '',
  dependants: '0',
  birthday: '',
  email: '',
  phone: '',
  address: '',
  employmentStatus: '',
  employmentYear: '',
  employmentMonth: '',
  employmentPay: '',
  employmentIndustry: '',
  employerName: '',
  netIncome: 0,
  rentalPayments: 0,
  monthlyLoan: 0,
  otherExpenses: 0,
  doc1: null,
  doc2: null,
  doc3: null,
  doc4: null,
  isAgree: false,
};

const FormSchema = Yup.object().shape({
  groundAddress: Yup.string().required('Address is required'),
  amount: Yup.number().required('Amount is required').min(1),
  purpose: Yup.string().required('Loan Purpose is required'),
  term: Yup.string().required('Term is required'),
  address: Yup.string().required('Address is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  gender: Yup.string().required('Gender is required'),
  maritalStatus: Yup.string().required('Marital status is required'),
  dependants: Yup.string().required('Dependants is required'),
  phone: Yup.string().required('Phone number is required'),
  doc1: Yup.mixed().required('Doc 1 is required'),
  doc2: Yup.mixed().required('Doc 2 is required'),
  doc3: Yup.mixed().required('Doc 3 is required'),
  doc4: Yup.mixed().required('Doc 4 is required'),
  isAgree: Yup.boolean().oneOf([true], 'Must Accept Terms and Conditions'),
});

const loanTermOptions = [
  { label: 'Please select...', value: '' },
  { label: 'Less than a year', value: 'Less than a year' },
  { label: '1 year', value: '1 year' },
  { label: '2 years', value: '2 years' },
  { label: '3 years', value: '3 years' },
  { label: '4 years', value: '4 years' },
  { label: '5+ years', value: '5+ years' },
];

const loanPurposeOptions = [
  { label: 'Please select...', value: '' },
  { label: 'Car Lease', value: 'Car Lease' },
  { label: 'Car Other', value: 'Car Other' },
  { label: 'Car Purchase', value: 'Car Purchase' },
  { label: 'Debt consolidation', value: 'Debt consolidation' },
  { label: 'Everyday or Personal expenses', value: 'Everyday or Personal expenses' },
  { label: 'Family or Special Occasion', value: 'Family or Special Occasion' },
  { label: 'Holiday', value: 'Holiday' },
  { label: 'Home Improvements', value: 'Home Improvements' },
  { label: 'Household Goods', value: 'Household Goods' },
  { label: 'Medical Bill', value: 'Medical Bill' },
  { label: 'Motorbike', value: 'Motorbike' },
  { label: 'One-off Purchase', value: 'One-off Purchase' },
  { label: 'Other', value: 'Other' },
  { label: 'Pay Bills', value: 'Pay Bills' },
  { label: 'Rent Mortgage', value: 'Rent Mortgage' },
  { label: 'Short Term Loan', value: 'Short Term Loan' },
  { label: 'Temporary Reduction in Income', value: 'Temporary Reduction in Income' },
  { label: 'Unexpected Expenses', value: 'Unexpected Expenses' },
  { label: 'Vehicle Other', value: 'Vehicle Other' },
];

const employmentStatusOptions = [
  { label: 'Please select...', value: '' },
  { label: 'Full Time Employed', value: 'Full Time Employed' },
  { label: 'Part Time Employed', value: 'Part Time Employed' },
  { label: 'Self Employed', value: 'Self Employed' },
  { label: 'Temporarily Employed', value: 'Temporarily Employed' },
  { label: 'Student', value: 'Student' },
  { label: 'Pension', value: 'Pension' },
  { label: 'Disability Benefits', value: 'Disability Benefits' },
  { label: 'Unemployed', value: 'Unemployed' },
];

const employmentYearOptions = [
  { label: 'Years', value: '' },
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10+', value: '10+' },
];

const employmentMonthOptions = [
  { label: 'Months', value: '' },
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
];

const employmentPayOptions = [
  { label: 'Please select...', value: '' },
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Every 2 weeks', value: 'Every 2 weeks' },
  { label: 'Twice a month', value: 'Twice a month' },
  { label: 'Monthly', value: 'Monthly' },
];

const employmentIndustryOptions = [
  { label: 'Please select...', value: '' },
  { label: 'Accountancy', value: 'Accountancy' },
  { label: 'Advertising/Media', value: 'Advertising/Media' },
  { label: 'Business Consultancy', value: 'Business Consultancy' },
  { label: 'Call Centre Operations', value: 'Call Centre Operations' },
  { label: 'Cleaning Services', value: 'Cleaning Services' },
  { label: 'Computer Services', value: 'Computer Services' },
  { label: 'Construction', value: 'Construction' },
  { label: 'Education', value: 'Education' },
  { label: 'Electricity/Gas/Water', value: 'Electricity/Gas/Water' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Health', value: 'Health' },
  { label: 'Hotels/Restaurants', value: 'Hotels/Restaurants' },
  { label: 'Insurance', value: 'Insurance' },
  { label: 'Legal Services', value: 'Legal Services' },
  { label: 'Leisure/Culture', value: 'Leisure/Culture' },
  { label: 'Manufacturing', value: 'Manufacturing' },
  { label: 'Military', value: 'Military' },
  { label: 'Mining/Quarrying', value: 'Mining/Quarrying' },
  { label: 'Public Administration', value: 'Public Administration' },
  { label: 'Publishing', value: 'Publishing' },
  { label: 'Real Estate/Property', value: 'Real Estate/Property' },
  { label: 'Research/Development', value: 'Research/Development' },
  { label: 'Retail', value: 'Retail' },
  { label: 'Telecoms/Internet', value: 'Telecoms/Internet' },
  { label: 'Transportation', value: 'Transportation' },
  { label: 'Other', value: 'Other' },
];

const maritalStatusOptions = [
  { label: 'Please select...', value: '' },
  { label: 'Married', value: 'Married' },
  { label: 'Partner', value: 'Partner' },
  { label: 'Single', value: 'Single' },
  { label: 'Co-habiting', value: 'Co-habiting' },
  { label: 'Separated', value: 'Separated' },
  { label: 'Divorced', value: 'Divorced' },
  { label: 'Civil Union', value: 'Civil Union' },
  { label: 'Widowed', value: 'Widowed' },
];

const dependantOptions = [
  { label: 'Please select...', value: '' },
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5+', value: '5+' },
];

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export default function Loan(props: RouteComponentProps) {
  const [initialValues, setInitialValues] = useState<any>(defaultFormValue);
  const [groundAddress, setGroundAddress] = useState<string>('');
  const [searchCount, setSearchCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [searchResultItems, setSearchResultItems] = useState<any[]>([]);
  const [showSearchResult, setShowSearchResult] = useState<boolean>(false);
  const [isHasMore, setHasMore] = useState<boolean>(false);
  const [searchResultMessage, setSearchResultMessage] = useState<string>();
  const [isLoadingSearchAddress, setLoadingSearchAddress] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>();
  const [errorMsg, setErrorMsg] = useState<string>();

  const user = useUser();

  const handleGroundAddressChange = (e: any) => {
    setGroundAddress(e.target.value);
  };

  const handleGroundAddressClick = (e: any) => {
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
    } catch (e) {
      console.log(e);
    }
  };

  const handleFind = async () => {
    getSearchAddressResult({
      city: groundAddress,
      gu: groundAddress,
      dong: groundAddress,
      type: 0,
      page: 0,
    });
  };

  const handleShowMoreSearchResult = async () => {
    getSearchAddressResult({
      city: groundAddress,
      gu: groundAddress,
      dong: groundAddress,
      type: 0,
      page: page + 1,
    });
  };

  const renderSearchContent = (item: any, values: any) => {
    const handleClickSearchContent = async () => {
      setSelectedItem(item);
      setShowSearchResult(false);
      setGroundAddress(item.address || item.address_name);
      setInitialValues({ ...values, groundAddress: item.address || item.address_name });
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

  const submitHandler = async (values: any, { setSubmitting, resetForm }: any) => {
    if (selectedItem && !isEmpty(selectedItem.uniqueNum)) {
      const result = await APIService.uploadDocuments({ ...values, uniqueNum: selectedItem.uniqueNum });
      setInitialValues(defaultFormValue);
      setErrorMsg('');
      resetForm();
      localStorage.setItem('loan-submitted', 'true');
      props.history.push(`/result/${result.data}`);
    } else {
      setErrorMsg('Please select address from list');
    }
  };

  return user && user.isLoggedIn() ? (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={submitHandler}
      validationSchema={FormSchema}
    >
      {({ values, isSubmitting }) => {
        return (
          <Form className="form-group loan-wrapper">
            <Grid>
              <Row>
                <Col xs={12} className="flex-between group-title">
                  <div>
                    <h1>Your loan details</h1>
                    <p>Help us narrow down which lending partners can help you.</p>
                  </div>
                  <p className="flex-self-center">1 of 7</p>
                </Col>
                <Col xs={12}>
                  <hr />
                </Col>
              </Row>
              <Row className="mt-10">
                <Col xs={4}>
                  <h4>Loan Amount</h4>
                  <Field
                    className="w-full"
                    type="number"
                    component={InputTextField}
                    value={values.amount}
                    name="amount"
                  />
                </Col>
                <Col xs={4}>
                  <h4>Loan Purpose</h4>
                  <Field
                    name="purpose"
                    placeholder="Purpose"
                    component={DropdownField}
                    value={values.purpose}
                    options={loanPurposeOptions}
                  />
                </Col>
                <Col xs={4}>
                  <h4>Loan Term</h4>
                  <Field
                    name="term"
                    placeholder="Term"
                    value={values.term}
                    component={DropdownField}
                    options={loanTermOptions}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} className="flex-between group-title">
                  <div>
                    <h1>Your ground details</h1>
                    <p>We will check your assets.</p>
                  </div>
                  <p className="flex-self-center">2 of 7</p>
                </Col>
                <Col xs={12}>
                  <hr />
                </Col>
              </Row>
              <Row>
                <Col xs={10} className="search-result-wrapper">
                  <h4>Ground Address</h4>
                  <Field
                    component={InputTextField}
                    value={values.groundAddress}
                    name="groundAddress"
                    onChange={handleGroundAddressChange}
                    onClick={handleGroundAddressClick}
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

                      <div className="search-result-content">
                        {searchResultItems.map((item: any) => renderSearchContent(item, values))}
                      </div>
                      {isHasMore && (
                        <div className="show-more">
                          <a onClick={handleShowMoreSearchResult}>Show more</a>
                        </div>
                      )}
                    </div>
                  )}
                </Col>
                <Col xs={2}>
                  <h4>&nbsp;</h4>
                  <div className="mt-10">
                    <Button
                      label="Find"
                      type="button"
                      onClick={handleFind}
                      className={classnames({ 'w-full': !selectedItem, 'w-40': selectedItem })}
                    />
                    {selectedItem && (
                      <a
                        className="p-button p-component go-btn w-40"
                        href={`https://groundcontrol.co.kr/?lat=${selectedItem.y}&lng=${selectedItem.x}`}
                        target="_blank"
                      >
                        Go
                      </a>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} className="flex-between group-title">
                  <div>
                    <h1>Your ground documents</h1>
                    <p>We need some documents for verification.</p>
                  </div>
                  <p className="flex-self-center">3 of 7</p>
                </Col>
                <Col xs={12}>
                  <hr />
                </Col>
              </Row>
              <Row className="mt-10">
                <Col xs={6}>
                  <h4>Document 1</h4>
                  <Field
                    component={FileUploadField}
                    value={values.doc1}
                    name="doc1"
                    uploadConfig={UPLOAD_FILE_CONFIG}
                    chooseLabel="Choose"
                  />
                </Col>
                <Col xs={6}>
                  <h4>Document 2</h4>
                  <Field
                    component={FileUploadField}
                    value={values.doc2}
                    name="doc2"
                    uploadConfig={UPLOAD_FILE_CONFIG}
                    chooseLabel="Choose"
                  />
                </Col>
                <Col xs={6}>
                  <h4>Document 3</h4>
                  <Field
                    component={FileUploadField}
                    value={values.doc3}
                    name="doc3"
                    uploadConfig={UPLOAD_FILE_CONFIG}
                    chooseLabel="Choose"
                  />
                </Col>
                <Col xs={6}>
                  <h4>Document 4</h4>
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
                <Col xs={12} className="flex-between group-title">
                  <div>
                    <h1>Your personal details</h1>
                    <p>We take security very seriously. Your details will remain secure.</p>
                  </div>
                  <p className="flex-self-center">4 of 7</p>
                </Col>
                <Col xs={12}>
                  <hr />
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <h4>First name</h4>
                  <Field
                    className="w-full"
                    type="text"
                    component={InputTextField}
                    value={values.firstName}
                    name="firstName"
                  />
                </Col>
                <Col xs={4}>
                  <h4>Last name</h4>
                  <Field
                    className="w-full"
                    type="text"
                    name="lastName"
                    component={InputTextField}
                    value={values.lastName}
                  />
                </Col>
                <Col xs={4}>
                  <h4>Gender</h4>
                  <Field name="gender" value={values.gender} component={RadioButtonField} options={genderOptions} />
                </Col>
                <Col xs={4}>
                  <h4>Marital Status</h4>
                  <Field
                    name="maritalStatus"
                    value={values.maritalStatus}
                    component={DropdownField}
                    options={maritalStatusOptions}
                  />
                </Col>
                <Col xs={4}>
                  <h4>Number of dependants</h4>
                  <Field
                    name="dependants"
                    value={values.dependants}
                    component={DropdownField}
                    options={dependantOptions}
                  />
                </Col>
                <Col xs={4}>
                  <h4>Date of birth</h4>
                  <Field name="birthday" value={values.birthday} component={CalendarField} />
                </Col>
                <Col xs={4}>
                  <h4>Email</h4>
                  <Field name="email" value={values.email} component={InputTextField} className="w-full" type="text" />
                </Col>
                <Col xs={4}>
                  <h4>Mobile phone</h4>
                  <Field name="phone" value={values.phone} component={InputTextField} className="w-full" type="text" />
                </Col>
                <Col xs={4}>
                  <h4>Address</h4>
                  <Field
                    name="address"
                    value={values.address}
                    component={InputTextField}
                    className="w-full"
                    type="text"
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} className="flex-between group-title">
                  <div>
                    <h1>Your employment details</h1>
                    <p>
                      We will never contact your employer. Lenders just need to understand how you generate an income.
                    </p>
                  </div>
                  <p className="flex-self-center">5 of 7</p>
                </Col>
                <Col xs={12}>
                  <hr />
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <h4>Employment status</h4>
                  <Field
                    name="employmentStatus"
                    value={values.employmentStatus}
                    component={DropdownField}
                    options={employmentStatusOptions}
                  />
                </Col>
                <Col xs={4}>
                  <h4>Length of employment status</h4>
                  <Row className="two-cols">
                    <Col xs={6}>
                      <Field
                        name="employmentYear"
                        value={values.employmentYear}
                        component={DropdownField}
                        options={employmentYearOptions}
                      />
                    </Col>
                    <Col xs={6}>
                      <Field
                        name="employmentMonth"
                        value={values.employmentMonth}
                        component={DropdownField}
                        options={employmentMonthOptions}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col xs={4}>
                  <h4>Pay frequency</h4>
                  <Field
                    name="employmentPay"
                    value={values.employmentPay}
                    component={DropdownField}
                    options={employmentPayOptions}
                  />
                </Col>
                <Col xs={4}>
                  <h4>Employment industry</h4>
                  <Field
                    name="employmentIndustry"
                    value={values.employmentIndustry}
                    component={DropdownField}
                    options={employmentIndustryOptions}
                  />
                </Col>
                <Col xs={4}>
                  <h4>Employer Name</h4>
                  <Field
                    name="employerName"
                    value={values.employerName}
                    component={InputTextField}
                    className="w-full"
                    type="text"
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} className="flex-between group-title">
                  <div>
                    <h1>Your finances</h1>
                    <p>Please enter accurate information. It will improve your chances of being approved.</p>
                  </div>
                  <p className="flex-self-center">6 of 7</p>
                </Col>
                <Col xs={12}>
                  <hr />
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <h4>Net monthly income</h4>
                  <Field
                    className="w-full"
                    type="number"
                    component={InputTextField}
                    value={values.netIncome}
                    name="netIncome"
                  />
                </Col>
                <Col xs={4}>
                  <h4>Monthly rental/mortgage payments</h4>
                  <Field
                    className="w-full"
                    type="number"
                    component={InputTextField}
                    value={values.rentalPayments}
                    name="rentalPayments"
                  />
                </Col>
                <Col xs={4}>
                  <h4>Monthly loan payments</h4>
                  <Field
                    className="w-full"
                    type="number"
                    component={InputTextField}
                    value={values.monthlyLoan}
                    name="monthlyLoan"
                  />
                </Col>
                <Col xs={4}>
                  <h4>Other expenses</h4>
                  <Field
                    className="w-full"
                    type="number"
                    component={InputTextField}
                    value={values.otherExpenses}
                    name="otherExpenses"
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} className="flex-between group-title">
                  <div>
                    <h1>Last step – almost there!</h1>
                    <p>Please complete this final step so we can get your results.</p>
                  </div>
                  <p className="flex-self-center">7 of 7</p>
                </Col>
                <Col xs={12}>
                  <hr />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Field
                    component={CheckboxField}
                    value={values.isAgree}
                    name="isAgree"
                    label="I confirm I have read and agree to the Terms & Conditions and Privacy Policy and I understand as
                    part of my application my data may be shared with Ground control system."
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>{errorMsg && errorMsg.length > 0 && <div className="error-feedback">{errorMsg}</div>}</Col>
              </Row>
              <Row>
                <Col xs={12} className="text-right button-group">
                  {isSubmitting && <i className="pi pi-spin pi-spinner" />}
                  <Button disabled={isSubmitting} label="Submit Your Request" type="submit" />
                </Col>
              </Row>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  ) : (
    <Grid className="loan-require-login-wrapper">
      <Row>
        <Col xs={12} className="text-center">
          <div>
            <h1>Please sign in / sign up to submit new request</h1>
          </div>
          <div className="mt-40">
            <NavLink to="/register" className="login-btn fsi-14 mr-20">
              <i className="pi pi-sign-in" />
              <span className="pl-8">Sign Up</span>
            </NavLink>
            <NavLink to="/login" className="login-btn fsi-14 mr-20">
              <i className="pi pi-sign-in" />
              <span className="pl-8">Sign In</span>
            </NavLink>
          </div>
        </Col>
      </Row>
    </Grid>
  );
}
