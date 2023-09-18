import React from 'react';
import TextInput from '../TextInput';
import { Dialog } from 'primereact/dialog';
import { Field, Formik } from 'formik';
import { Button } from 'primereact/button';
import Account from '../../services/Account';
import { ChangePasswordSchema } from '../../schema/changePassword';

const emptyData = {
  password: '',
  newPassword: '',
  confirmPassword: '',
};

interface ChangePasswordModalPropsType {
  setCloseModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChangePasswordModal = ({ setCloseModal }: ChangePasswordModalPropsType) => {
  const handleHidePw = () => setCloseModal(false);

  const submitHandler = async (values: any, errors: any) => {
    const { password, newPassword } = values;
    if (Object.keys(errors).length > 0) return alert('비밀번호를 확인 해주세요');
    try {
      const response = await Account.changePassword(password, newPassword);
      if (response.success && response.data) {
        alert('비밀번호 변경이 완료 되었습니다');
        setCloseModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog
      visible={true}
      style={{ width: '500px' }}
      showHeader={false}
      modal={true}
      className="common-alert"
      onHide={handleHidePw}
    >
      <div className="common-alert__inner">
        <div className="common-alert__head">
          <h1 className="title">비밀번호 변경</h1>
          <button type="button" className="p-dialog-titlebar-close p-link" aria-label="Close" onClick={handleHidePw}>
            <span className="p-dialog-titlebar-close-icon pi pi-times"></span>
          </button>
        </div>
        <div className="common-alert__cont">
          <Formik initialValues={emptyData} onSubmit={submitHandler} validationSchema={ChangePasswordSchema}>
            {({ values, errors }) => (
              <>
                <ul className="input-list">
                  <li>
                    <label className="label">현재 비밀번호</label>
                    <div className="content">
                      <Field className="form-control" type="password" name="password" component={TextInput} />
                    </div>
                  </li>
                  <li>
                    <label className="label">새 비밀번호</label>
                    <div className="content">
                      <Field
                        className="form-control"
                        type="password"
                        name="newPassword"
                        component={TextInput}
                        placeholder="대, 소문자, 특수기호 포함 6자리 이상 입력​"
                      />
                    </div>
                  </li>
                  <li>
                    <label className="label">새 비밀번호 확인</label>
                    <div className="content">
                      <Field
                        className="form-control"
                        type="password"
                        name="confirmPassword"
                        component={TextInput}
                        placeholder="비밀번호 재입력"
                      />
                    </div>
                  </li>
                </ul>
                <div className="submit-button">
                  <Button
                    className="submit"
                    label="변경하기"
                    type="button"
                    onClick={() => submitHandler(values, errors)}
                  />
                </div>
              </>
            )}
          </Formik>
        </div>
      </div>
    </Dialog>
  );
};

export default ChangePasswordModal;
