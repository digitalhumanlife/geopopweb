import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

interface PhoneDuplicateCheckModalPropsType {
  setCloseModal: any;
  location?: string;
}

const PhoneDuplicateCheckModal = ({ setCloseModal, location }: PhoneDuplicateCheckModalPropsType) => {
  const handleHideDialog = () => setCloseModal(false);

  const onclickHandler = () => {
    if (location) window.location.href = '/login';
    handleHideDialog();
  };

  return (
    <Dialog
      visible={true}
      onHide={handleHideDialog}
      style={{ width: '500px' }}
      showHeader={false}
      modal={true}
      appendTo={document.body}
      className="common-alert"
    >
      <div className="common-alert__inner">
        <div className="common-alert__head">
          <h1 className="title">휴대폰 명의 중복 확인</h1>
          <button
            type="button"
            className="p-dialog-titlebar-close p-link"
            aria-label="Close"
            onClick={handleHideDialog}
          >
            <span className="p-dialog-titlebar-close-icon pi pi-times"></span>
          </button>
        </div>

        <p className="cmt">
          이미 가입된 명의입니다.
          <br />
          아이디 찾기를 통해 회원가입을 확인해 주시기 바랍니다.
        </p>

        <div className="submit-button">
          <Button className="submit" label="확인" onClick={onclickHandler} />
        </div>
      </div>
    </Dialog>
  );
};

export default PhoneDuplicateCheckModal;
