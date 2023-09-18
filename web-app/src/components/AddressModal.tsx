import React from 'react';
import DaumPostcode from 'react-daum-postcode';
import { Dialog } from 'primereact/dialog';

interface AddressModalPropsType {
  setState: React.Dispatch<React.SetStateAction<string>>;
  closeModal: () => void;
}

const AddressModal = ({ setState, closeModal }: AddressModalPropsType) => {
  const onCompletePost = (data: any) => {
    let fullAddr = data.address;
    let extraAddr = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddr += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddr += extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddr += extraAddr !== '' ? ` (${extraAddr})` : '';
    }

    setState(fullAddr);
    closeModal();
  };

  return (
    <Dialog
      visible={true}
      onHide={closeModal}
      style={{ width: '480px', height: '527px' }}
      modal={true}
      showHeader={false}
      className="common-alert address"
      appendTo={document.body}
    >
      <div className="common-alert__head">
        <h1 className="title">우편번호 찾기</h1>
        <button type="button" className="p-dialog-titlebar-close p-link" aria-label="Close" onClick={closeModal}>
          <span className="p-dialog-titlebar-close-icon pi pi-times"></span>
        </button>
      </div>

      <DaumPostcode style={{ height: 'calc(100% - 69px)' }} onComplete={onCompletePost} />
    </Dialog>
  );
};

export default AddressModal;
