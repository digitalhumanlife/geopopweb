import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'react-flexbox-grid';
import { FormattedNumber } from 'react-intl';
import { RouteComponentProps } from 'react-router';

import { config } from '../../config';
import APIService from '../../services/API';

export default function DocumentApproval(props: RouteComponentProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [requests, setRequests] = useState<any[]>([]);

  const tableRef = useRef<any>();

  const getDocuments = async () => {
    const data = await APIService.getP2PRequest();
    setRequests(data.data);
  };

  const idBodyTemplate = (rowData: any) => {
    return <a href={`/result/${rowData.id}`}>{rowData.id}</a>;
  };

  const requesterBodyTemplate = (rowData: any) => {
    return <a href={`/result/${rowData.id}`}>{`${rowData.data.firstName} ${rowData.data.lastName}`}</a>;
  };

  const amountBodyTemplate = (rowData: any) => {
    return (
      <span>
        <FormattedNumber value={rowData.data.amount} /> KRW
      </span>
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    const handleApprove = async () => {
      await APIService.updateP2PStatus(rowData.id, 'approved');
      getDocuments();
    };
    const handleReject = async () => {
      await APIService.updateP2PStatus(rowData.id, 'rejected');
      getDocuments();
    };
    const handleDetail = () => {
      props.history.push(`/result/${rowData.id}`);
    };
    return rowData.status === 'pending' ? (
      <>
        <Button className="p-button-success" label="Approve" style={{ marginRight: '10px' }} onClick={handleApprove} />
        <Button className="p-button-danger" style={{ marginRight: '10px' }} label="Reject" onClick={handleReject} />
        <Button className="p-button-primary" label="Detail" onClick={handleDetail} />
      </>
    ) : (
      <>
        <Button className="p-button-primary" label="Detail" onClick={handleDetail} />
      </>
    );
  };

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <div className="document-approval-wrapper mt-20">
      <Row>
        <Col xs={10} xsOffset={1}>
          <DataTable
            ref={tableRef}
            value={requests}
            paginator
            rows={10}
            globalFilter={globalFilter}
            emptyMessage="No records found."
            loading={loading}
          >
            <Column field="id" header="ID" body={idBodyTemplate}></Column>
            <Column field="data.firstName" header="Requester" body={requesterBodyTemplate}></Column>
            <Column field="data.groundAddress" header="Ground Address"></Column>
            <Column field="data.amount" header="Loan amount" body={amountBodyTemplate}></Column>
            <Column field="data.price" header="Price"></Column>
            <Column field="status" header="Status"></Column>
            <Column body={actionBodyTemplate} style={{ width: '300px' }}></Column>
          </DataTable>
        </Col>
      </Row>
    </div>
  );
}
