import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import './ScheduleAlert.scss';
import { useUser } from '../store/hooks/hooks';
import API from '../services/API';
import { AlarmType } from '../interfaces/alarm';

interface Props extends RouteComponentProps {
  visible: boolean;
  id?: string;
  title?: string;
  onHide: () => void;
}

export default function ScheduleAlert(props: Props) {
  const [isRegisteredAlarm, setIsRegisteredAlarm] = useState<boolean>(false);

  const [inputEmailValue, setInputEmailValue] = useState('');
  const [inputSMSValue, setInputSMSValue] = useState('');

  const [responseAlarmData, setResponseAlarmData] = useState<AlarmType>();

  const [isEmail, setIsEmail] = useState(true);
  const user = useUser();

  const onHideWrapper = () => props.onHide();

  const isAlarmProduct = async () => {
    if (!user.isLoggedIn()) return;
    if (!props.id) return;
    try {
      const response = await API.getNotification(props.id);
      if (response.success) {
        setIsRegisteredAlarm(response.data.length !== 0);
        setResponseAlarmData(response.data[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onSettingAlarm = async () => {
    if (!user.isLoggedIn()) return props.history.push('/login');

    const response = await API.postNotification({
      investment_id: props.id,
      type: isEmail ? 'email' : 'sms',
      to_target: isEmail ? inputEmailValue : inputSMSValue,
    });

    if (response.success && response.data === 'ok') isAlarmProduct();
  };

  const onDeleteAlarm = async () => {
    const response = await API.deleteNotification(responseAlarmData!.id);
    if (response.success && response.data === 'ok') isAlarmProduct();
  };

  useEffect(() => {
    isAlarmProduct();
  }, [user]);

  useEffect(() => {
    setInputEmailValue(user.email);
    setInputSMSValue(user.phone2);
  }, [user]);

  return (
    <Dialog
      visible={props.visible}
      style={{ width: '500px' }}
      modal={true}
      showHeader={false}
      appendTo={document.body}
      onHide={onHideWrapper}
      className="common-dialog common-dialog--schedule"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="common-dialog__inner">
        <button type="button" className="p-dialog-titlebar-close p-link" aria-label="Close" onClick={onHideWrapper}>
          <span className="p-dialog-titlebar-close-icon pi pi-times"></span>
        </button>
        <h1 className="title">[{props.title}]</h1>
        <p className="sub-sbj">프로젝트 참여 개시</p>

        {isRegisteredAlarm ? (
          <>
            <p className="cmt">알림 설정이 완료 되었습니다.</p>
            <dl className="result">
              <dt>{responseAlarmData?.type}</dt>
              <dd>{responseAlarmData?.to_target}</dd>
            </dl>
          </>
        ) : (
          <>
            <ul>
              <li>
                <div className="input-select">
                  <input
                    id="email"
                    type="radio"
                    name="selectAlarm"
                    checked={isEmail}
                    onClick={() => {
                      setIsEmail((value) => !value);
                    }}
                  />
                  <label htmlFor="email">
                    Email
                    <i className="icon-check"></i>
                  </label>
                </div>
              </li>
              <li>
                <div className="input-select">
                  <input
                    id="SMS"
                    type="radio"
                    name="selectAlarm"
                    checked={!isEmail}
                    onClick={() => {
                      setIsEmail((value) => !value);
                    }}
                  />
                  <label htmlFor="SMS">
                    SMS
                    <i className="icon-check"></i>
                  </label>
                </div>
              </li>
            </ul>
            <InputText
              placeholder={isEmail ? '이메일 입력' : 'SMS 입력'}
              value={isEmail ? inputEmailValue : inputSMSValue}
              onChange={(e) => (isEmail ? setInputEmailValue(e.target.value) : setInputSMSValue(e.target.value))}
            />
          </>
        )}

        <div className="submit-button">
          {isRegisteredAlarm ? (
            <>
              <Button className="submit" label="확인" onClick={onHideWrapper} />
              <Button className="reset" label="알림취소" onClick={onDeleteAlarm} />
            </>
          ) : (
            <>
              <Button className="submit" label="알림설정" onClick={onSettingAlarm} />
              <Button className="cancel" label="취소" onClick={onHideWrapper} />
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}
