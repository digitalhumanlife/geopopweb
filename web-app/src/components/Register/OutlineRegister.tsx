import { Field } from 'formik';
import React from 'react';
import TextInput from '../TextInput';
import TextAreaField from '../../components/TextAreaField';

interface OutlineRegisterPropsType {
  type: string;
}

const OutlineRegister = ({ type }: OutlineRegisterPropsType) => {
  return (
    <div className="product-content__grid">
      {type === '부동산' ? (
        <>
          <ul data-type="land">
            <li className="col4">
              <span className="sbj">대지위치</span>
              <span className="info info--3">
                <Field className="form-control" type="text" name="detailSummary0" component={TextInput} />
              </span>
            </li>
            <li className="col4">
              <span className="sbj">대지면적 / 용도</span>
              <span className="info info--3">
                <Field className="form-control" type="text" name="detailSummary1" component={TextInput} />
              </span>
            </li>
            <li className="col4">
              <span className="sbj">비고</span>
              <span className="info info--3 info--textarea">
                <Field
                  className="form-control"
                  type="text"
                  name="detailSummary6"
                  placeholder="건축개요 비고"
                  rows={2}
                  component={TextAreaField}
                  style={{ padding: '20px' }}
                />
              </span>
            </li>
          </ul>
        </>
      ) : (
        <>
          <ul data-type="outline">
            <li className="col4">
              <span className="sbj">대지위치</span>
              <span className="info">
                <Field className="form-control" type="text" name="detailSummary0" component={TextInput} />
              </span>
              <span className="sbj">용도</span>
              <span className="info">
                <Field className="form-control" type="text" name="detailSummary3" component={TextInput} />
              </span>
            </li>
            <li className="col4">
              <span className="sbj">대지면적 / 용도</span>
              <span className="info">
                <Field className="form-control" type="text" name="detailSummary1" component={TextInput} />
              </span>
              <span className="sbj">규모</span>
              <span className="info">
                <Field className="form-control" type="text" name="detailSummary4" component={TextInput} />
              </span>
            </li>
            <li className="col4">
              <span className="sbj">연면적 / 용적률</span>
              <span className="info">
                <Field className="form-control" type="text" name="detailSummary2" component={TextInput} />
              </span>
              <span className="sbj">주차장</span>
              <span className="info">
                <Field className="form-control" type="text" name="detailSummary5" component={TextInput} />
              </span>
            </li>
            <li className="col4">
              <span className="sbj">비고</span>
              <span className="info info--3 info--textarea">
                <Field
                  className="form-control"
                  type="text"
                  name="detailSummary6"
                  placeholder="건축개요 비고"
                  rows={2}
                  component={TextAreaField}
                  style={{ padding: '20px' }}
                />
              </span>
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default OutlineRegister;
