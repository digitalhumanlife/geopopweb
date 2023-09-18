import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

interface IdDuplicateCheckModalPropsType {
  isIdDuplicated: boolean;
  setCloseModal: any;
}

const IdDuplicateCheckModal = ({ isIdDuplicated, setCloseModal }: IdDuplicateCheckModalPropsType) => {
  const handleHideDialog = () => setCloseModal(false);
  return (
    <Dialog
      visible={true}
      style={{ width: '500px' }}
      showHeader={false}
      modal={true}
      appendTo={document.body}
      className="common-alert"
      onHide={handleHideDialog}
    >
      <div className="common-alert__inner">
        <div className="common-alert__head">
          <h1 className="title">아이디 중복 확인</h1>
          <button
            type="button"
            className="p-dialog-titlebar-close p-link"
            aria-label="Close"
            onClick={handleHideDialog}
          >
            <span className="p-dialog-titlebar-close-icon pi pi-times"></span>
          </button>
        </div>
        {isIdDuplicated ? (
          <p className="cmt">이미 사용중인 아이디 입니다.</p>
        ) : (
          <p className="cmt">사용 가능한 아이디 입니다.</p>
        )}

        <div className="submit-button">
          <Button className="submit" label="확인" onClick={handleHideDialog} />
        </div>
      </div>
    </Dialog>
  );
};

export default IdDuplicateCheckModal;
