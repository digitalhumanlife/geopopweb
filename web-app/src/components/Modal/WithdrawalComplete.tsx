import React from 'react';
import { Dialog } from 'primereact/dialog';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/user/actions';

interface WithdrawalCompletePropsType extends RouteComponentProps {
  setCloseModal: any;
}

const WithdrawalComplete = (props: WithdrawalCompletePropsType) => {
  const dispatch = useDispatch();

  const handleHideModal = () => {
    props.setCloseModal(false);
    dispatch(setUser(null));
    props.history.push('/');
  };

  return (
    <Dialog
      visible={true}
      style={{ width: '500px' }}
      showHeader={false}
      modal={true}
      className="common-alert"
      onHide={handleHideModal}
    >
      <div className="common-alert__inner">
        <div className="common-alert__head">
          <h1 className="title">회원탈퇴</h1>
          <button type="button" className="p-dialog-titlebar-close p-link" aria-label="Close" onClick={handleHideModal}>
            <span className="p-dialog-titlebar-close-icon pi pi-times"></span>
          </button>
        </div>
        <p className="cmt">
          <strong>탈퇴가 정상적으로 처리되었습니다.</strong>
        </p>
        <div className="submit-button">
          <Button className="submit" label="확인" onClick={handleHideModal} />
        </div>
      </div>
    </Dialog>
  );
};

export default WithdrawalComplete;
