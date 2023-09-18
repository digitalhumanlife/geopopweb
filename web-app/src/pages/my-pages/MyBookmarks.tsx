import moment from 'moment';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SelectButton } from 'primereact/selectbutton';

import InvestmentItem from '../../components/InvestmentItem';
import APIService from '../../services/API';
import { toFormattedNumber } from '../../utilities/common';

import './MyBookmarks.scss';
import Part2Img3 from '../../statics/images/v2/part2/part2_3.png';
import { useUser } from '../../store/hooks/hooks';

// 임시
import ScheduleAlert from '../../components/ScheduleAlert';
import { IUserInvestMentItem } from '../../interfaces/investment';
import { PROJECT_TAB_OPTIONS } from '../../constants/tab';
import { isNull } from 'lodash';

export default function MyBookmarks(props: RouteComponentProps) {
  const [tab, setTab] = useState<string>(PROJECT_TAB_OPTIONS[1].value);
  const [investmentItems, setInvestmentItems] = useState<any[]>([]);
  const [investmentItemLength, setInvestmentItemLength] = useState(1);
  const [rawInvestmentItems, setRawInvestmentItems] = useState<IUserInvestMentItem[]>([]);
  const [isShowSchedule, setShowSchedule] = useState<boolean>(false);
  const user = useUser();

  const handleScheduleAlertHide = () => {
    setShowSchedule(false);
    document.getElementsByTagName('body')[0].classList.remove('dialog-show');
  };

  const handleTabChange = (e: any) => {
    if (!e.value) return;

    setTab(e.value);
    if (e.value === '나의 프로젝트') {
      props.history.push('/my-page');
    }

    if (e.value === '회원정보') {
      user.type === 'individual' && props.history.push('/individual-info');
      user.type === 'business' && props.history.push('/business-info');
    }
  };

  const getBookmarks = async () => {
    const bookmarks = await APIService.getBookmarks();
    setRawInvestmentItems(
      bookmarks.data.map((item: any) => {
        const duration = moment.duration(moment(item.end_date).diff(moment()));
        const hourDuration = duration.asHours() - Math.floor(duration.asDays()) * 24;
        const minuteDuration =
          duration.asMinutes() - Math.floor(duration.asDays()) * 24 * 60 - Math.floor(hourDuration) * 60;
        const thumbnails = [];
        if (item.thumbnail1) thumbnails.push(item.thumbnail1);
        if (item.thumbnail2 !== 'null' && isNull(item.thumbnail2)) thumbnails.push(item.thumbnail2);
        if (item.thumbnail3 !== 'null' && isNull(item.thumbnail3)) thumbnails.push(item.thumbnail3);

        return {
          id: item.id,
          date_1: `[${item.invest_id}]`,
          date_2: '종료일　' + moment(item.end_date).format('YYYY - MM - DD　hh:mm A'),
          title_1: item.title,
          title_21: duration.asDays() >= 0 ? `D-${duration.asDays().toFixed(0)}` : 'D-0',
          title_22:
            hourDuration >= 0 && minuteDuration >= 0
              ? `${hourDuration.toFixed(0)}시간 ${minuteDuration.toFixed(0)}분`
              : '0시간 0분',
          // invest_time: item.invest_time,
          // recruitment_amount: item.recruitment_amount,
          // profit: item.profit + '%',
          percentage: ((Number(item.current_invest) * 100) / Number(item.max_invest)).toFixed(0) + '%',
          progress_1: toFormattedNumber(Number(item.current_invest)),
          progress_2: toFormattedNumber(Number(item.max_invest)),
          process_percent: ((Number(item.current_invest) * 100) / Number(item.max_invest)).toFixed(0),
          start_date: item.start_date,
          end_date: item.end_date,
          image: Part2Img3,
          thumbnail1: thumbnails[0],
          thumbnail2: thumbnails[1],
          thumbnail3: thumbnails[2],
          business_information: JSON.parse(item.business_information),
          business_type: item.business_type,
        };
      }),
    );
  };

  useEffect(() => {
    getBookmarks();
  }, []);

  useEffect(() => {
    setInvestmentItems([]);
    let investmentItemResult: IUserInvestMentItem[] = [];

    investmentItemResult = rawInvestmentItems;

    if (investmentItemResult.length > 0) {
      setInvestmentItems(investmentItemResult.slice(0, investmentItemLength * 5)); // 5개씩 보여줌
    } else {
      setInvestmentItems([]);
    }
  }, [rawInvestmentItems, investmentItemLength]);

  useEffect(() => {
    getBookmarks();
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bookmarks-wrapper">
      <div className="common-header">
        <h1>마이페이지</h1>
      </div>
      <div className="common-tab">
        <SelectButton value={tab} options={PROJECT_TAB_OPTIONS} onChange={handleTabChange}></SelectButton>
      </div>
      <div className="bookmarks-content">
        <div className="investments-content">
          {investmentItems.map((item, index) => {
            return (
              <InvestmentItem {...props} data={item} showEdit={true} onReload={getBookmarks} key={index} tab={''} />
            );
          })}
        </div>
        {rawInvestmentItems.length / 5 > investmentItemLength ? (
          <div
            onClick={() => setInvestmentItemLength((oldLength) => oldLength + 1)}
            className="investment-view-more pointer"
          >
            더보기
          </div>
        ) : (
          ''
        )}
        <ScheduleAlert visible={isShowSchedule} onHide={handleScheduleAlertHide} {...props} />
      </div>
    </div>
  );
}
