import moment from 'moment';
import classnames from 'classnames';
import { toLower } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { RouteComponentProps } from 'react-router-dom';
import { isBrowser } from 'react-device-detect';
import { useUser } from '../store/hooks/hooks';
import APIService from '../services/API';

import './Notice.scss';
import TitleNotice from '../statics/images/v3/bg-notice.jpg';
import ConfirmationDialog from '../components/ConfirmationDialog';
import PageNation from '../components/Pagenation';
export default function Notice(props: RouteComponentProps) {
  const [searchText, setSearchText] = useState<string>('');
  const [noticesRaw, setNoticesRaw] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<number>(0);
  const [visibleConfirmDelete, setVisibleConfirmDelete] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const limit = useRef(isBrowser ? 5 : 10);
  const offset = (page - 1) * limit.current;

  const user = useUser();

  const getNotices = async () => {
    const data = await APIService.getNotices();
    if (data.success) {
      setNoticesRaw(data.data);
    }
  };

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleNoticeExpanded = (item: any) => {
    if (selectedNotice !== item.id) {
      setSelectedNotice(item.id);
    } else {
      setSelectedNotice(0);
    }
  };
  const handleEditClick = (e: any, item: any) => {
    props.history.push('/new-notice?id=' + item.id);
    e.stopPropagation();
  };

  const handleRemoveClick = (item: any) => {
    setSelectedNotice(item.id);
    setVisibleConfirmDelete(true);
  };

  const isNewContent = (item: any) => {
    const createDate = moment.duration(moment().diff(moment(item.created_at))).asDays();
    if (createDate >= 10) return false;
    else return true;
  };

  const handleConfirmDialogAccept = async () => {
    await APIService.removeNotice(selectedNotice);
    setVisibleConfirmDelete(false);
    getNotices();
  };

  const handleConfirmDialogDismiss = () => {
    setVisibleConfirmDelete(false);
  };

  useEffect(() => {
    const data = noticesRaw
      .filter((item: any) => {
        return (
          toLower(item['title']).indexOf(toLower(searchText)) >= 0 ||
          toLower(item['content']).indexOf(toLower(searchText)) >= 0
        );
      })
      .map((value, idx) => {
        return (value = { ...value, no: noticesRaw.length - idx });
      });

    setNotices(data);
  }, [searchText, noticesRaw]);

  useEffect(() => {
    getNotices();
  }, []);

  return (
    <div className="notice-wrapper">
      <div className="common-header">
        <img src={TitleNotice} alt="" />
        <h1>공지사항</h1>
      </div>
      <div className="notice-container">
        {user.isAdmin() && (
          <div className="new-notice">
            <Button label="New Notice" onClick={() => props.history.push('/new-notice')} />
          </div>
        )}
        <div className="search-group">
          <div className="search-input">
            <InputText placeholder="검색어를 입력해주세요." onChange={handleSearchChange} />
            <span className="pi pi-search"></span>
          </div>
        </div>
        <div className="notice-content">
          {isBrowser && (
            <div className="notice-content-head">
              <div>NO</div>
              <div>제목</div>
              <div>날짜</div>
            </div>
          )}
          {notices.slice(offset, offset + limit.current).map((item: any, idx: number) => {
            return (
              <div key={idx}>
                <div className="notice-row">
                  <div className="sequence">{item.no}</div>
                  <div className="left-content">
                    {isNewContent(item) && <span className="new-label font-bold">NEW</span>}
                    <span className="font-regular">{item.title}</span>
                  </div>
                  <div className="right-content">
                    <span className="font-regular">{moment(item.created_at).format('YYYY-MM-DD')}</span>
                    {selectedNotice === item.id ? (
                      <span className="btn btn-show" onClick={() => handleNoticeExpanded(item)}></span>
                    ) : (
                      <span className="btn" onClick={() => handleNoticeExpanded(item)}></span>
                    )}
                  </div>
                </div>
                <div
                  className={classnames('notice-content-row', {
                    show: selectedNotice === item.id,
                  })}
                >
                  <p>{item.content}</p>
                  {user.isAdmin() && (
                    <div className="edit-remove-group">
                      <Button icon="pi pi-pencil" onClick={(e) => handleEditClick(e, item)} />
                      <Button className="p-button-danger" icon="pi pi-times" onClick={() => handleRemoveClick(item)} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <PageNation total={notices.length} limit={limit.current} page={page} setPage={setPage} />
      </div>
      <ConfirmationDialog
        header="Confirm"
        visible={visibleConfirmDelete}
        acceptText="Yes"
        dismissText="No"
        onAccept={handleConfirmDialogAccept}
        onDismiss={handleConfirmDialogDismiss}
        message="Remove this notice?"
      />
    </div>
  );
}
