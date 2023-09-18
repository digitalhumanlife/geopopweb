import React, { MouseEvent } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Row, Grid } from 'react-flexbox-grid';

import './ConfirmationDialog.scss';

interface Props {
  appendTo?: HTMLElement;
  header: string;
  acceptText: string;
  dismissText?: string;
  visible: boolean;
  message: string;
  messageAlignment?: string;
  onAccept: (e?: MouseEvent<HTMLButtonElement>) => void;
  onDismiss: (e?: MouseEvent<HTMLButtonElement>) => void;
  width?: string;
  errorMsg?: string;
  closeable?: boolean;
  setVisibleConfirmDelete?: React.Dispatch<React.SetStateAction<boolean>>;
}
const DIALOG_STYLE = { width: '450px' };

export default function ConfirmationDialog(props: Props) {
  return (
    <Dialog
      appendTo={document.body}
      header={props.header}
      visible={props.visible}
      style={props.width ? { width: props.width } : DIALOG_STYLE}
      onHide={props.onDismiss}
      maximizable={false}
      className="confirm-dialog"
      closable={props.closeable !== undefined ? props.closeable : true}
      onClick={(e) => e.stopPropagation()}
    >
      <Grid>
        <Row>
          <p
            className={'w-full text-' + props.messageAlignment || 'center'}
            dangerouslySetInnerHTML={{ __html: props.message }}
          />
        </Row>
        {props.errorMsg && (
          <Row className="error-row">
            <p className={'text-' + props.messageAlignment || 'center'}>{props.errorMsg}</p>
          </Row>
        )}
        <Row center="xs" className="button-group mt-10">
          {props.dismissText && props.onDismiss && (
            <Button label={props.dismissText} className="p-button-secondary p-button-sm" onClick={props.onDismiss} />
          )}
          <Button label={props.acceptText} onClick={props.onAccept} className="p-button-sm" />
        </Row>
      </Grid>
    </Dialog>
  );
}
