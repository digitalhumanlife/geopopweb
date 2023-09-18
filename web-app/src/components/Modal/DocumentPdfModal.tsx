import React from 'react';
import { Dialog } from 'primereact/dialog';

const DocumentPdfModal = ({ setCloseModal, fileUrl }: any) => {
  const closeModal = () => setCloseModal(false);

  return (
    <Dialog
      visible={true}
      style={{ width: '1000px', height: '1000px' }}
      showHeader={false}
      modal={true}
      className="common-alert"
      onHide={closeModal}
    >
      <div className="common-alert__head">
        <button type="button" className="p-dialog-titlebar-close p-link" aria-label="Close" onClick={closeModal}>
          <span className="p-dialog-titlebar-close-icon pi pi-times"></span>
        </button>
      </div>
      <div className="common-alert__cont" style={{ height: 'calc(100% - 80px)' }}>
        <iframe
          title="pdf"
          src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </Dialog>
  );
};

export default DocumentPdfModal;
