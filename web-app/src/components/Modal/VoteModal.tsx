import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import APIService from '../../services/API';

import '../DialogAlert.scss';
interface VoteModalPropsType {
  isVoteModal: boolean;
  setCloseModal: any;
  selectVote: any;
  selectRecord: string | undefined;
  setFlag: any;
  passOnClick: any;
  isNicePass: boolean;
}

const VoteModal = ({
  isVoteModal,
  setCloseModal,
  selectVote,
  selectRecord,
  setFlag,
  passOnClick,
  isNicePass,
}: VoteModalPropsType) => {
  const handleHideDialog = () => setCloseModal(false);

  const setVote = async () => {
    if (selectVote.is_voted === true) {
      alert('이미 투표하셨습니다.');
      return;
    }
    const result = await APIService.saveVoteRecord({
      vote_id: selectVote.id,
      record: selectRecord,
    });
    if (result.success) {
      alert('투표에 성공하였습니다.');
      setFlag((value: number) => value + 1);
      handleHideDialog();
    }
  };

  return (
    <Dialog
      visible={isVoteModal}
      onHide={handleHideDialog}
      style={{ width: '500px' }}
      showHeader={false}
      modal={true}
      appendTo={document.body}
      className="common-alert vote"
    >
      <div className="common-alert__inner">
        <div className="common-alert__head">
          <button
            type="button"
            className="p-dialog-titlebar-close p-link"
            aria-label="Close"
            onClick={handleHideDialog}
          >
            <span className="p-dialog-titlebar-close-icon pi pi-times"></span>
          </button>
        </div>
        <div className="common-alert__cont">
          <h1 className="title">[투표 매각합시다.]</h1>
          <p className="cmt">"{selectRecord === '1' ? '찬성' : selectRecord === '2' ? '반대' : '기권'}"하시겠습니까?</p>

          <div className="submit-button submit-button--auth">
            <Button className="submit" label="본인인증" type="button" onClick={passOnClick} disabled={isNicePass} />
          </div>
          <div className="submit-button">
            <Button
              label={selectRecord === '1' ? '찬성 투표' : selectRecord === '2' ? '반대 투표' : '기권 투표'}
              type="button"
              className={isNicePass ? 'agree' : ''}
              disabled={!isNicePass}
              onClick={setVote}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default VoteModal;
