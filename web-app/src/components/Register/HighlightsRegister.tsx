import React from 'react';
import { Field } from 'formik';
import TextInput from '../TextInput';

interface HighlightsRegisterPropsType {
  type: string;
}

const HighlightsRegister = ({ type }: HighlightsRegisterPropsType) => {
  return (
    <ul>
      {type === '부동산' ? (
        <>
          <li className="col4">
            <span className="sbj">명칭 [코드]</span>
            <span className="info info--3">
              <Field className="form-control" type="text" name="detailInfo0" component={TextInput} />
            </span>
          </li>

          <li className="col4">
            <span className="sbj">결성기금</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo1" component={TextInput} />
            </span>

            <span className="sbj">제안매도가</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo4" component={TextInput} />
            </span>
          </li>

          <li className="col4">
            <span className="sbj">계좌수</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo3" component={TextInput} />
            </span>

            <span className="sbj">감정평가</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo6" component={TextInput} />
            </span>
          </li>

          <li className="col4">
            <span className="sbj">기금목적</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo5" component={TextInput} />
            </span>

            <span className="sbj">사업비용</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo8" component={TextInput} />
            </span>
          </li>

          <li className="col4">
            <span className="sbj">참여개시</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo7" component={TextInput} />
            </span>
            <span className="sbj">매출재원</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo10" component={TextInput} />
            </span>
          </li>
        </>
      ) : (
        <>
          <li className="col4">
            <span className="sbj">명칭 [코드]</span>
            <span className="info info--3">
              <Field className="form-control" type="text" name="detailInfo0" component={TextInput} />
            </span>
          </li>
          <li className="col4">
            <span className="sbj">결성기금</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo1" component={TextInput} />
            </span>
            <span className="sbj">수행기간</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo2" component={TextInput} />
            </span>
          </li>
          <li className="col4">
            <span className="sbj">계좌수</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo3" component={TextInput} />
            </span>
            <span className="sbj">종료시점</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo4" component={TextInput} />
            </span>
          </li>
          <li className="col4">
            <span className="sbj">기금목적</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo5" component={TextInput} />
            </span>
            <span className="sbj">감정평가</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo6" component={TextInput} />
            </span>
          </li>
          <li className="col4">
            <span className="sbj">참여개시</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo7" component={TextInput} />
            </span>
            <span className="sbj">사업비용</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo8" component={TextInput} />
            </span>
          </li>
          <li className="col4">
            <span className="sbj">참여종료</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo9" component={TextInput} />
            </span>

            <span className="sbj">매출재원</span>
            <span className="info">
              <Field className="form-control" type="text" name="detailInfo10" component={TextInput} />
            </span>
          </li>
        </>
      )}
    </ul>
  );
};

export default HighlightsRegister;
