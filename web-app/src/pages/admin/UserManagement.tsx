import React, { useState, useRef, useEffect } from 'react';
import Moment from 'react-moment';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Row, Col } from 'react-flexbox-grid';
import { Formik, Form, Field } from 'formik';
import { Dialog } from 'primereact/dialog';
import { RouteComponentProps } from 'react-router-dom';
import * as Yup from 'yup';

import APIService from '../../services/API';
import { useUser } from '../../store/hooks/hooks';
import CONSTANTS from '../../constants/constant';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import InputTextField from '../../components/InputTextField';
import DropdownField from '../../components/DropdownField';

import './UserManagement.scss';

const roleItems = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
];

const yesNoItems = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

const emptyUserSchema = {
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  activated: true,
};

const UserSchema = Yup.object().shape({
  email: Yup.string().required('이메일을 입력해주세요.').email('이메일 형식이 아닙니다.'),
  role: Yup.string().required('권한을 선택해주세요. (user, admin)'),
  password: Yup.string().required('비밀번호를 입력해주세요.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], '비밀번호가 일치하지 않습니다.')
    .required('비밀번호를 확인해주세요.'),
});

export default function UserManagement(props: RouteComponentProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [selectedUser, setSelectedUser] = useState<any>(emptyUserSchema);
  const [showAddEdit, setShowAddEdit] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [adminActivities, setAdminActivities] = useState<any[]>([]);

  const tableRef = useRef<any>();
  const user = useUser();

  const getUsers = async () => {
    const usersData = await APIService.getUsers();
    setUsers(usersData.data);
  };

  const getAdminActivities = async () => {
    const data = await APIService.getAdminActivities();
    setAdminActivities(data.data);
  };

  const handleInputChange = (e: any) => {
    setGlobalFilter(e.target.value);
  };

  const handleHideAddEditDialog = () => {
    setShowAddEdit(false);
  };

  const handleAddUser = () => {
    setSelectedUser(emptyUserSchema);
    setShowAddEdit(true);
  };

  const handleConfirmDialogAccept = async () => {
    await APIService.removeUser(selectedUser.id);
    setShowConfirmDelete(false);
    setSelectedUser(emptyUserSchema);
    getUsers();
    getAdminActivities();
  };

  const handleConfirmDialogDismiss = () => {
    setShowConfirmDelete(false);
  };

  const submitUserHandler = async (values: any, { setSubmitting, resetForm }: any) => {
    setSubmitting(true);
    try {
      await APIService.createOrUpdateUser(values);
      setShowAddEdit(false);
      resetForm();
      getUsers();
      getAdminActivities();
    } catch (err) {
      console.log(err);
    }
    setSubmitting(false);
  };

  const formatDateTimeTemplate = (rowData: any, column: any) => {
    return <Moment date={new Date(rowData[column.field])} format="MMM DD YYYY HH:mm:ss" />;
  };

  const formatDateTemplate = (rowData: any, column: any) => {
    return <Moment date={new Date(rowData[column.field])} format="MMM DD YYYY HH:mm:ss" />;
  };

  const activatedTemplate = (rowData: any) => {
    return <Checkbox readOnly={true} checked={rowData.activated} />;
  };

  const dataBodyTemplate = (rowData: any, column: any) => {
    return rowData[column.field] ? <pre>{JSON.stringify(JSON.parse(rowData[column.field]), undefined, 2)}</pre> : '';
  };

  const actionBodyTemplate = (rowData: any) => {
    const handleEditUser = () => {
      setSelectedUser({ ...rowData, password: '******', confirmPassword: '******' });
      setShowAddEdit(true);
    };
    const handleRemoveUser = () => {
      setSelectedUser(rowData);
      setShowConfirmDelete(true);
    };
    return (
      <>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={handleEditUser} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={handleRemoveUser} />
      </>
    );
  };

  const header = (
    <div className="table-header">
      <Button label="Add User" onClick={handleAddUser} />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={handleInputChange} placeholder="Search" />
      </span>
    </div>
  );

  useEffect(() => {
    getUsers();
    getAdminActivities();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user.role !== CONSTANTS.ROLES.ADMIN) {
      props.history.push('/');
    }
  }, [user]);

  return (
    <>
      <div className="user-management-wrapper">
        <Row>
          <Col xs={10} xsOffset={1}>
            <DataTable
              ref={tableRef}
              value={users}
              paginator
              rows={10}
              header={header}
              className="p-datatable-users overflow-auto"
              globalFilter={globalFilter}
              emptyMessage="No records found."
              loading={loading}
              scrollable
            >
              <Column field="email" header="Email" style={{ width: '150px' }}></Column>
              <Column field="role" header="Role" style={{ width: '150px' }}></Column>
              <Column field="activated" header="Activated" body={activatedTemplate} style={{ width: '150px' }}></Column>
              <Column
                field="created_at"
                header="Created At"
                body={formatDateTimeTemplate}
                style={{ width: '150px' }}
              ></Column>
              <Column body={actionBodyTemplate} style={{ width: '150px' }}></Column>
            </DataTable>
          </Col>
        </Row>
        <Row className="mt-40">
          <Col xs={10} xsOffset={1}>
            <DataTable
              value={adminActivities}
              paginator
              rows={10}
              header="Admin Activities"
              className="p-datatable-users"
              globalFilter={globalFilter}
              emptyMessage="No records found."
              loading={loading}
              scrollable
            >
              <Column field="created_at" header="Date" style={{ width: '150px' }} body={formatDateTemplate}></Column>
              <Column field="action_by" header="Action by" style={{ width: '150px' }}></Column>
              <Column field="action_to" header="Effected user" style={{ width: '150px' }}></Column>
              <Column field="event_id" header="Action" style={{ width: '150px' }}></Column>
              <Column field="pre_data" header="Pre Data" body={dataBodyTemplate} style={{ width: '300px' }}></Column>
              <Column field="data" header="Post Data" body={dataBodyTemplate} style={{ width: '300px' }}></Column>
            </DataTable>
          </Col>
        </Row>
      </div>
      <Dialog
        visible={showAddEdit}
        style={{ width: '700px' }}
        header={selectedUser.id ? 'Edit User' : 'Add User'}
        modal={true}
        appendTo={document.body}
        className="p-fluid"
        onHide={handleHideAddEditDialog}
      >
        <Formik
          initialValues={selectedUser}
          enableReinitialize={true}
          validationSchema={UserSchema}
          onSubmit={submitUserHandler}
        >
          {(formikProps: any) => {
            const handlePasswordClick = () => {
              if (formikProps.values.password === '******') {
                setSelectedUser({ ...formikProps.values, password: '' });
              }
            };
            const handlePasswordConfirmClick = () => {
              if (formikProps.values.confirmPassword === '******') {
                setSelectedUser({ ...formikProps.values, confirmPassword: '' });
              }
            };
            return (
              <Form className="form-group user-form">
                <Row>
                  <Col xs={3}>Email</Col>
                  <Col xs={9}>
                    <Field
                      name="email"
                      className="w-full"
                      type="email"
                      disabled={selectedUser.id}
                      value={formikProps.values.email}
                      component={InputTextField}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={3}>Password</Col>
                  <Col xs={9}>
                    <Field
                      name="password"
                      className="w-full"
                      type="password"
                      value={formikProps.values.password}
                      onClick={handlePasswordClick}
                      component={InputTextField}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={3}>Confirm Password</Col>
                  <Col xs={9}>
                    <Field
                      name="confirmPassword"
                      className="w-full"
                      type="password"
                      onClick={handlePasswordConfirmClick}
                      value={formikProps.values.confirmPassword}
                      component={InputTextField}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={3}>Role</Col>
                  <Col xs={9}>
                    <Field
                      name="role"
                      className="w-full"
                      value={formikProps.values.role}
                      component={DropdownField}
                      options={roleItems}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={3}>Activated</Col>
                  <Col xs={9}>
                    <Field
                      name="activated"
                      className="w-full"
                      value={formikProps.values.activated}
                      component={DropdownField}
                      options={yesNoItems}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className="flex-center">
                    <Button label="Save" className="p-button-success" type="submit" />
                    <Button label="Cancel" className="p-button-secondary" onClick={handleHideAddEditDialog} />
                  </Col>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </Dialog>
      <ConfirmationDialog
        header="Confirm"
        visible={showConfirmDelete}
        acceptText="Yes"
        dismissText="No"
        onAccept={handleConfirmDialogAccept}
        onDismiss={handleConfirmDialogDismiss}
        message="이 사용자를 삭제 하시겠습니까?"
      />
    </>
  );
}
