import { Button } from 'primereact/button';
import React, { useState, MouseEvent } from 'react';
import Carousel from 'nuka-carousel';
import { RouteComponentProps } from 'react-router-dom';
import { useUser } from '../store/hooks/hooks';
import ConfirmationDialog from './ConfirmationDialog';
import ScheduleAlert from '../components/ScheduleAlert';

import APIService from '../services/API';

import './InvestmentItem.scss';
import InvestmentsComplete from '../statics/images/v3/common/flag-complete.png';
import InvestmentsSchedule from '../statics/images/v3/common/ic-notification.png';
import moment from 'moment';

interface Props extends RouteComponentProps {
  data: any;
  showEdit: boolean;
  tab: string;
  onReload: () => void;
}

export default function InvestmentItem(props: Props) {
  const [visibleConfirmDelete, setVisibleConfirmDelete] = useState<boolean>(false);
  const [isShowSchedule, setShowSchedule] = useState<boolean>(false);

  const user = useUser();

  const handleVoteClick = (e: MouseEvent) => {
    e.stopPropagation();
    props.history.push('/new-vote?investment_id=' + props.data.id);
  };

  const handleEditClick = (e: MouseEvent) => {
    e.stopPropagation();
    props.history.push('/edit-investment?id=' + props.data.id);
  };

  const handleRemoveClick = async (e: MouseEvent) => {
    e.stopPropagation();
    setVisibleConfirmDelete(true);
  };

  const handleConfirmDialogAccept = async (e: MouseEvent) => {
    e.stopPropagation();
    await APIService.removeInvestment(props.data.id);
    setVisibleConfirmDelete(false);
    props.onReload();
  };

  const handleConfirmDialogDismiss = (e: MouseEvent) => {
    if (!e) return setVisibleConfirmDelete(false);

    e.stopPropagation();
    setVisibleConfirmDelete(false);
  };
  const handleInvestmentClick = (e: MouseEvent) => {
    // if (e.target.matches('.btn-alarm') || e.target.matches('img')) return;
    props.history.push('/products/' + props.data.id);
  };

  const showScheduleAlert = () => {
    document.getElementsByTagName('body')[0].classList.add('dialog-show');
    setShowSchedule(true);
  };

  const handleScheduleAlertHide = () => {
    setShowSchedule(false);
    document.getElementsByTagName('body')[0].classList.remove('dialog-show');
  };
  return (
    <div className="investment-item pointer">
      {props.tab === '예정' && (
        <div className="alarm">
          <div className="alarm-left-side">
            <strong>COMING SOON</strong>
            <p>{moment(props.data.start_date).format('MM')}월 중 모집예정</p>
          </div>

          <div className="alarm-right-side">
            <button onClick={showScheduleAlert} className="btn-alarm">
              알림설정
              <img src={InvestmentsSchedule} alt="" />
            </button>
          </div>
        </div>
      )}

      <div className="left-side" onClick={(e) => handleInvestmentClick(e)}>
        <div className="date-group">
          <div className="pointer">{props.data.date_1}</div>
          <div className="pointer">{props.data.date_2}</div>
        </div>
        <div className="content-wrapper">
          <div className="content-left">
            <div className="title-1 pointer">{props.data.title_1}</div>
          </div>

          <div className="content-right">
            <div className="title-2 pointer">
              <strong>
                <span className="day">{props.data.title_21}일</span>
                {props.data.title_22}
              </strong>
            </div>
          </div>
        </div>
        <ul className="data-info">
          <li>
            <dl>
              <dt>결성기금</dt>
              <dd>{props.data.business_information.fund}</dd>
            </dl>
            {props.data.business_type !== '부동산' && (
              <dl>
                <dt>수행기간</dt>
                <dd>
                  {props.data.business_information.period}
                  <small>(예상)</small>
                </dd>
              </dl>
            )}
          </li>
          <li>
            <dl>
              <dt>감정평가</dt>
              <dd>{props.data.business_information.appraisal}</dd>
            </dl>
            <dl>
              <dt>사업비용</dt>
              <dd>
                {props.data.business_information.expenditure}
                <small>(예상)</small>
              </dd>
            </dl>
          </li>
        </ul>
        <div className="custom-progress">
          <div className="bg">
            <div className="bar" style={{ width: props.data.percentage }}>
              <div className="percentage pointer">
                <span>{props.data.percentage}</span>
              </div>
            </div>
          </div>
          <div className="value">
            <span className="d-flex">
              <span className="progress-value pointer">{props.data.progress_1}</span>
            </span>
            <span className="progress-value pointer">{props.data.progress_2}</span>
          </div>
        </div>
      </div>
      <div className="pointer">
        <Carousel
          className="slider-frame carousel"
          defaultControlsConfig={{
            pagingDotsStyle: {
              display: 'none',
            },
          }}
          renderCenterLeftControls={({
            previousDisabled,
            previousSlide,
          }: {
            previousDisabled: boolean;
            previousSlide: () => void;
          }) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                previousSlide();
              }}
              disabled={previousDisabled}
              style={{
                backgroundColor: 'transparent',
                border: '0px',
                color: 'white',
                padding: '10px',
                textTransform: 'uppercase',
                opacity: '1',
                cursor: 'pointer',
              }}
            />
          )}
          renderCenterRightControls={({
            nextDisabled,
            nextSlide,
          }: {
            nextDisabled: boolean;
            nextSlide: () => void;
          }) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              disabled={nextDisabled}
              style={{
                backgroundColor: 'transparent',
                border: '0px',
                color: 'white',
                padding: '10px',
                textTransform: 'uppercase',
                opacity: '1',
                cursor: 'pointer',
              }}
            />
          )}
        >
          <div className="slider-frame__thumb" onClick={(e) => handleInvestmentClick(e)}>
            <img
              src={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${props.data.thumbnail1}`}
              alt="썸네일"
              draggable="false"
            />
          </div>
          {props.data.thumbnail2 && (
            <div className="slider-frame__thumb" onClick={(e) => handleInvestmentClick(e)}>
              <img
                src={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${props.data.thumbnail2}`}
                alt="썸네일"
                draggable="false"
              />
            </div>
          )}
          {props.data.thumbnail3 && (
            <div className="slider-frame__thumb" onClick={(e) => handleInvestmentClick(e)}>
              <img
                src={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${props.data.thumbnail3}`}
                alt="썸네일"
                draggable="false"
              />
            </div>
          )}
        </Carousel>
        {props.tab === '완료' && (
          <div className="investment-overlay-item">
            <span className="flag">
              <img src={InvestmentsComplete} alt="" />
            </span>
            <p className="notice">
              관련 일정 등 자세한 내용은
              <br />
              '마이페이지' - '나의 프로젝트' 에서
              <br />
              확인 할 수 있습니다.
            </p>
          </div>
        )}
      </div>
      {props.showEdit && user.isAdmin() && (
        <div className="edit-remove-group">
          <Button icon="pi pi-inbox" onClick={handleVoteClick} />
          <Button icon="pi pi-pencil" onClick={handleEditClick} />
          <Button className="p-button-danger" icon="pi pi-times" onClick={handleRemoveClick} />
        </div>
      )}
      <ConfirmationDialog
        header="Confirm"
        visible={visibleConfirmDelete}
        acceptText="Yes"
        dismissText="No"
        onAccept={(e: any) => handleConfirmDialogAccept(e)}
        onDismiss={(e: any) => handleConfirmDialogDismiss(e)}
        setVisibleConfirmDelete={setVisibleConfirmDelete}
        message="Remove this investment?"
      />
      <ScheduleAlert
        visible={isShowSchedule}
        onHide={handleScheduleAlertHide}
        id={props.data.id}
        title={props.data.title_1}
        {...props}
      />
    </div>
  );
}
