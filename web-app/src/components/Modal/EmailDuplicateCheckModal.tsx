import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { isMobile } from 'react-device-detect';

interface EmailDuplicateCheckModalPropsType {
  isEmailDuplicated: boolean;
  setCloseModal: any;
}

const EmailDuplicateCheckModal = ({ isEmailDuplicated, setCloseModal }: EmailDuplicateCheckModalPropsType) => {
  const handleHideDialog = () => setCloseModal(false);
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
          <h1 className="title">이메일 중복 확인</h1>
          <button
            type="button"
            className="p-dialog-titlebar-close p-link"
            aria-label="Close"
            onClick={handleHideDialog}
          >
            <span className="p-dialog-titlebar-close-icon pi pi-times"></span>
          </button>
        </div>

        {isEmailDuplicated ? (
          <p className="cmt">
            이미 사용중인 이메일 입니다.
            <br />
            이메일을 확인하시거나 아이디 찾기를 통해
            <br /> 아이디를 확인하시기 바랍니다.
          </p>
        ) : (
          <p className="cmt">
            사용 가능한 이메일 입니다.
            <br />
            다음 단계로 이동하여 {isMobile && <br />}회원정보 수정을 완료하시기 바랍니다.
          </p>
        )}

        <div className="submit-button">
          <Button className="submit" label="확인" onClick={handleHideDialog} />
        </div>
      </div>
    </Dialog>
  );
};

export default EmailDuplicateCheckModal;
