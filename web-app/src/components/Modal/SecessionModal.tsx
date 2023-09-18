import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Field, Formik } from 'formik';
import { Button } from 'primereact/button';
import TextInput from '../TextInput';
import AccountService from '../../services/Account';
import { RouteComponentProps } from 'react-router-dom';
import { SecessionSchema } from '../../schema/secession';

interface SecessionModalPropsType extends RouteComponentProps {
  setCloseModal: any;
  setOpenCompleteModal: any;
}

const emptyData = {
  password: '',
};

const SecessionModal = (props: SecessionModalPropsType) => {
  const handleHideLeave = () => {
    props.setCloseModal(false);
  };

  const onClickLeave = async (values: any, error: any) => {
    const { password } = values;
    if (!password) return alert('비밀번호를 입력해주세요');
    if (Object.keys(error).length > 0) return alert('양식을 확인해주세요');

    const data = await AccountService.removeUser(password);
    if (data.success) {
      handleHideLeave();
      props.setOpenCompleteModal(true);
    } else {
      alert('비밀번호가 틀렸습니다');
    }
  };

  return (
    <Dialog
      visible={true}
      style={{ width: '500px' }}
      showHeader={false}
      modal={true}
      className="common-alert leave"
      onHide={handleHideLeave}
    >
      <div className="common-alert__inner">
        <div className="common-alert__head">
          <h1 className="title">회원탈퇴</h1>
          <button type="button" className="p-dialog-titlebar-close p-link" aria-label="Close" onClick={handleHideLeave}>
            <span className="p-dialog-titlebar-close-icon pi pi-times"></span>
          </button>
        </div>
        <h2 className="sub-title">정말 탈퇴 하시겠습니까?</h2>
        <p className="cmt">
          탈퇴 시 계정은 삭제되며 복구되지 않습니다.
          <br />
          이후 7일 동안 재가입이 불가능 합니다.
        </p>
        <Formik initialValues={emptyData} onSubmit={() => {}} validationSchema={SecessionSchema}>
          {({ values, errors }) => (
            <>
              <div className="input-pw">
                <Field
                  className="form-control"
                  type="password"
                  name="password"
                  component={TextInput}
                  placeholder="비밀번호 입력"
                />
              </div>

              <div className="submit-button">
                <Button className="submit submit--black" label="탈퇴" onClick={() => onClickLeave(values, errors)} />
                <Button label="취소" onClick={handleHideLeave} />
              </div>
            </>
          )}
        </Formik>
      </div>
    </Dialog>
  );
};

export default SecessionModal;
