import { RouteComponentProps } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React from 'react';

import './DialogAlert.scss';

interface Props extends RouteComponentProps {
  visible: boolean;
  onHide: () => void;
}

export default function DialogAlert(props: Props) {
  const onHideWrapper = () => {
    props.onHide();
  };

  return (
    <Dialog
      visible={props.visible}
      style={{ width: '500px' }}
      modal={true}
      showHeader={false}
      appendTo={document.body}
      onHide={onHideWrapper}
      draggable={false}
      resizable={false}
      className="common-alert"
    >
      <div className="common-alert__inner">
        <div className="common-alert__head">
          <h1 className="title">알림</h1>
          <button type="button" className="p-dialog-titlebar-close p-link" aria-label="Close" onClick={onHideWrapper}>
            <span className="p-dialog-titlebar-close-icon pi pi-times"></span>
          </button>
        </div>

        <p className="cmt">
          회원님의 본인인증 성명과
          <br />
          신청자가 입력한 성명이 일치하지 않습니다.
          <br />
          다시 한번 확인해주시기 바랍니다.
        </p>

        <div className="submit-button">
          <Button className="submit" label="확인" onClick={onHideWrapper} />
        </div>
      </div>
    </Dialog>
  );
}
