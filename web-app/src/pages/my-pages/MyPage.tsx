import moment from 'moment';
import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import classnames from 'classnames';
import { useUser } from '../../store/hooks/hooks';
import APIService from '../../services/API';
import VoteIcon from '../../statics/images/v3/icon/like.svg';

import './MyPage.scss';
import PageNation from '../../components/Pagenation';
import { diffDate } from '../../utilities/date';
import { toFile } from '../../utilities/changeFile';
import DepositAlert from '../../components/DepositAlert';
import VoteModal from '../../components/Modal/VoteModal';
import { initializeNicePass } from '../../utilities/pass';
import DocumentPdfModal from '../../components/Modal/DocumentPdfModal';
import { isBrowser, isMobile } from 'react-device-detect';
import { getPercentage } from '../../utilities/persent';
import { toFormattedNumber } from '../../utilities/common';
import { BankInfoType } from '../../interfaces/bank';
import { IUserInvestMentItem } from '../../interfaces/investment';
import { MyTabValueType, PROJECT_TAB_OPTIONS, myTabValues } from '../../constants/tab';
import { isNull } from 'lodash';

export default function MyPage(props: RouteComponentProps) {
  const [tab, setTab] = useState<string>(PROJECT_TAB_OPTIONS[0].value);
  const [rawInvestmentItems, setRawInvestmentItems] = useState<IUserInvestMentItem[]>([]);
  const [investmentItems, setInvestmentItems] = useState<IUserInvestMentItem[]>([]);
  const [investmentItemLength, setInvestmentItemLength] = useState(1);
  const [selectedAll, setSelectedAll] = useState<number>(0);
  const [selectedNotice, setSelectedNotice] = useState<number>(0);
  const [selectedVote, setSelectedVote] = useState<number>(0);
  const [pageAll, setPageAll] = useState(1);
  const [pageVote, setPageVote] = useState(1);
  const [pageNotice, setPageNotice] = useState(1);
  const [isShowDepositAlert, setShowDepositAlert] = useState<boolean>(false);

  const [isVoteModal, setIsVoteModal] = useState<boolean>(false);
  const [selectVote, setSelectVote] = useState<any>();
  const [selectRecord, setSelectRecord] = useState<string>();
  const [flag, setFlag] = useState<number>(0);

  const curId = useRef<string>('');
  const [bankInfo, setBankInfo] = useState<BankInfoType>();

  const limit = useRef(5);
  const offsetAll = (pageAll - 1) * limit.current;
  const offsetVote = (pageVote - 1) * limit.current;
  const offsetNotice = (pageNotice - 1) * limit.current;

  const [isNicePass, setIsNicePass] = useState<boolean>(false);
  const [encData, setEncData] = useState<string>('');
  const [tokenVersionId, setTokenVersionId] = useState<string>('');
  const [integrityValue, setIntegrityValue] = useState<string>('');

  const [isPdfModal, setIsPdfModal] = useState<boolean>(false);
  const [curFileUrl, setCurFileUrl] = useState<any>();

  const [agreeVoteInfo, setAgreeVoteInfo] = useState<any>({});

  const passButtonRef = useRef<any>(null);

  const onClickOpenPass = () => {
    const form = document.getElementsByName('nice_form')[0] as HTMLFormElement;

    window.open('', 'nice', 'width=475, height=750, toolbar=no, menubar=no, scrollbars=no, resizable=no');
    form.target = 'nice';
    form.submit();

    window.addEventListener('storage', async () => {
      try {
        const niceData = localStorage.getItem('nicePass');

        if (niceData) {
          setIsNicePass(true);
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  const initializePass = async () => {
    const returlUrl = window.location.origin + '/nice';
    const { enc_data, token_version_id, integrity_value } = await initializeNicePass(returlUrl);

    setEncData(enc_data);
    setTokenVersionId(token_version_id);
    setIntegrityValue(integrity_value);
  };

  useEffect(() => {
    initializePass();

    return () => {
      localStorage.removeItem('nicePass');
    };
  }, []);

  const user = useUser();

  const showDepositAlert = async (id: string) => {
    curId.current = id;
    const result = await APIService.getBankInformation(id);
    if (result.success) setBankInfo(result.data);
    else return alert('Error');
    document.getElementsByTagName('body')[0].classList.add('dialog-show');
    setShowDepositAlert(true);
  };

  const handleDepositAlertHide = () => {
    setShowDepositAlert(false);
    document.getElementsByTagName('body')[0].classList.remove('dialog-show');
  };

  const handleTabChange = (e: { value: string }) => {
    if (!e.value) return;

    setTab(e.value);
    if (e.value === '관심 프로젝트') {
      props.history.push('/bookmarks');
    }

    if (e.value === '회원정보') {
      user.type === 'individual' && props.history.push('/individual-info');
      user.type === 'business' && props.history.push('/business-info');
    }
  };

  const handleAllExpanded = (item: any) => {
    if (selectedAll !== item.type_id) {
      setSelectedAll(item.type_id);
    } else {
      setSelectedAll(0);
    }
  };

  const handleNoticeExpanded = (item: any) => {
    if (selectedNotice !== item.id) {
      setSelectedNotice(item.id);
    } else {
      setSelectedNotice(0);
    }
  };

  const handleVoteExpanded = (item: any) => {
    if (selectedVote !== item.id) {
      setSelectedVote(item.id);
    } else {
      setSelectedVote(0);
    }
  };

  const printVoteResult = (investment_id: string, vote_id: string) => {
    window.open(`/vote-result/${investment_id}/${vote_id}/${agreeVoteInfo[`${investment_id}${vote_id}`]}`, '_blank');
  };

  const changeAgreeVoteInfo = (investment_id: string, vote_id: string) => {
    setAgreeVoteInfo((val: any) => ({
      ...val,
      [`${investment_id}${vote_id}`]: !val[`${investment_id}${vote_id}`],
    }));
  };

  const handleTitleClick = (investment_id: string) => {
    props.history.push('/products/' + investment_id);
  };

  const getVoteStatusText = (maxInvestNum: number, user?: any, type: string = 'text') => {
    const voteResult = getVoteResults(user);
    const totalResult = voteResult.agree + voteResult.disagree + voteResult.abstention;

    if (totalResult < maxInvestNum) return type === 'class' ? 'status status--ing' : '투표중';
    if (totalResult === maxInvestNum) return type === 'class' ? 'status status--end' : '투표마감';
  };

  const getVoteResults = (vote: any) => {
    let agree = 0;
    let disagree = 0;
    let abstention = 0;
    if (vote.userInvestment.length !== 0)
      vote.userInvestment.map((item: any) =>
        item.map((data: any) => {
          if (data.title === vote.title) {
            if (data.record === '1') return (agree += +data.amount);
            else if (data.record === '2') return (disagree += +data.amount);
            else if (data.record === '3') return (abstention += +data.amount);
          }
        }),
      );

    return { agree, disagree, abstention };
  };

  const openVoteModal = async (e: any, vote: any, record: string) => {
    e.stopPropagation();
    setSelectVote(vote);
    setSelectRecord(record);
    setIsVoteModal(true);
  };

  const toggleProductList = (e: any) => {
    const target = e.target.closest('li');
    const list = target.querySelector('.product-list__info');
    list.classList.toggle('product-list__info--show');
    if (list.classList.contains('product-list__info--show')) e.target.innerHTML = ' 관련 세부사항 접기';
    else e.target.innerHTML = ' 관련 세부사항 보기';
  };

  const handleDocumentShow = async (pdfUrl: any) => {
    const fileBlob = pdfUrl ? await toFile(pdfUrl) : '';
    const url = window.URL || window.webkitURL;
    const documentPdf = fileBlob ? url.createObjectURL(fileBlob) : null;
    if (documentPdf === '') return;
    setCurFileUrl(documentPdf);
    setIsPdfModal(true);
  };

  const getInvestments = async () => {
    const result = await APIService.getBought();

    if (result.success) {
      const res: any = await Promise.all(
        (result.data as any[])?.map(async (params: any) => {
          return await Promise.all(
            (params.vote as any[])?.map(async (list: any) => {
              setAgreeVoteInfo((val: any) => ({ ...val, [`${params.investment_id}${list.id}`]: true }));
              return APIService.getVoteResult(params.investment_id, list.id, false);
            }),
          );
        }),
      );
      setRawInvestmentItems(
        result.data.map((item: IUserInvestMentItem) => {
          const diff = diffDate(item.end_date).diff;
          const diffDay = diffDate(item.end_date).diffDay;
          const diffHour = diffDate(item.end_date).diffHour;
          const diffMin = diffDate(item.end_date).diffMin;

          item.userInvestment = [];
          if (res.length) {
            res.map((data: any) =>
              data.map((el: any) => {
                if (+el.data.investment[0].id === +item.investment_id)
                  item.userInvestment?.push(el.data.userInvestments);
              }),
            );
          }

          item.voteAndNotices = [];
          if (item.notices) {
            item.notices.map((notice: any) =>
              item.voteAndNotices.push({
                ...notice,
                type: 'notice',
                type_id: `notice${notice.id}`,
              }),
            );
          }

          if (item.vote) {
            item.vote.map(async (vote: any) => {
              const file = await toFile(vote.file);

              vote.file = file;

              item.voteAndNotices.push({
                ...vote,
                file: file,
                type: 'vote',
                type_id: `vote${vote.id}`,
                userInvestment: item.userInvestment,
              });
            });
          }

          if (item.voteAndNotices) {
            item.voteAndNotices.sort((a: any, b: any) => {
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
          }

          const getDocument = () => {
            const document: { fileUrl: string; fileName: string }[] = [];
            if (!isNull(item.document1) && item.document1 !== 'null')
              if (!item.document1.includes('Error'))
                document.push({
                  fileUrl: item.document1,
                  fileName: item.document1_org,
                });

            if (!isNull(item.document2) && item.document2 !== 'null')
              if (!item.document2.includes('Error'))
                document.push({
                  fileUrl: item.document2,
                  fileName: item.document2_org,
                });

            if (!isNull(item.document3) && item.document3 !== 'null')
              if (!item.document3.includes('Error'))
                document.push({
                  fileUrl: item.document3,
                  fileName: item.document3_org,
                });

            if (!isNull(item.document4) && item.document4 !== 'null')
              if (!item.document4.includes('Error'))
                document.push({
                  fileUrl: item.document4,
                  fileName: item.document4_org,
                });

            if (!isNull(item.document5) && item.document5 !== 'null')
              if (!item.document5.includes('Error'))
                document.push({
                  fileUrl: item.document5,
                  fileName: item.document5_org,
                });

            return document;
          };

          const myNotices = item.notices.map((val: any, idx: number) => ({ ...val, no: item.notices.length - idx }));
          const myVote = item.vote.map((val: any) => ({ ...val, userInvestment: item.userInvestment }));
          return {
            id: item.id,
            amount: item.amount,
            created_at: item.created_at,
            document: getDocument().reverse(),
            invest_id: item.invest_id,
            investment_id: item.investment_id,
            paid_status: item.paid_status,
            process_percent: item.process_percent,
            status: item.status,
            title: item.title,
            title_21: diff >= 0 ? `${diffDay} 일` : 'D-0 일',
            title_22: `${diff >= 0 ? diffHour : 0}시간 ${diff >= 0 ? diffMin : 0}분`,
            notices: myNotices,
            vote: myVote,
            voteAndNotices: item.voteAndNotices,
            curTab: 'boardAll',
            total_invest_user_count: item.total_invest_user_count,
            userInvestment: item.userInvestment,
            business_type: item.business_type,
            max_invest: item.max_invest,
          };
        }),
      );
    }
  };

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
    getInvestments();
  }, [user, flag]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="my-page-item">
      <div className="common-header">
        <h1>마이페이지</h1>
      </div>
      <div className="common-tab">
        <SelectButton value={tab} options={PROJECT_TAB_OPTIONS} onChange={handleTabChange}></SelectButton>
      </div>
      <div className="my-page-content">
        <ul className="product-list">
          {investmentItems.map((investment, index) => {
            return (
              <li key={index}>
                <div className="product-list__head">
                  <div className="subject">
                    <button className="subject__title" onClick={() => handleTitleClick(investment.investment_id)}>
                      {investment.title}
                    </button>
                    {/* {user.isAdmin() && isMobile && <button className="btn-print">증빙자료 출력</button>} */}
                  </div>

                  <button
                    className="time"
                    onClick={() => {
                      showDepositAlert(investment.investment_id);
                    }}
                  >
                    납입기한
                    <mark>
                      {investment.title_21} {investment.title_22}
                    </mark>
                    남음
                  </button>
                </div>
                <div className="product-list__status">
                  {(investment.business_type === 'LH' || investment.business_type === '분양') && (
                    <ul>
                      <li
                        className={classnames({
                          active:
                            investment.status === '토지매매계약' ||
                            investment.status === '세부계획결정' ||
                            investment.status === '착공' ||
                            investment.status === '준공' ||
                            investment.status === '매매 / 해산',
                          select: investment.status === '결성',
                        })}
                      >
                        <i>1</i>
                        결성
                      </li>
                      <li
                        className={classnames({
                          active:
                            investment.status === '세부계획결정' ||
                            investment.status === '착공' ||
                            investment.status === '준공' ||
                            investment.status === '매매 / 해산',

                          select: investment.status === '토지매매계약',
                        })}
                      >
                        <i>2</i>
                        토지매매계약
                      </li>
                      <li
                        className={classnames({
                          active:
                            investment.status === '착공' ||
                            investment.status === '준공' ||
                            investment.status === '매매 / 해산',
                          select: investment.status === '세부계획결정',
                        })}
                      >
                        <i>3</i>
                        세부계획결정
                      </li>
                      <li
                        className={classnames({
                          active: investment.status === '준공' || investment.status === '매매 / 해산',
                          select: investment.status === '착공',
                        })}
                      >
                        <i>4</i>
                        착공
                      </li>
                      <li
                        className={classnames({
                          active: investment.status === '매매 / 해산',
                          select: investment.status === '준공',
                        })}
                      >
                        <i>5</i>
                        준공
                      </li>
                      <li className={classnames({ select: investment.status === '매매 / 해산' })}>
                        <i>6</i>
                        매매 / 해산
                      </li>
                    </ul>
                  )}
                  {investment.business_type === '부동산' && (
                    <ul className="land">
                      <li
                        className={classnames({
                          active:
                            investment.status === '토지매매계약' ||
                            investment.status === '임대' ||
                            investment.status === '매매 / 해산',
                          select: investment.status === '결성',
                        })}
                      >
                        <i>1</i>
                        결성
                      </li>
                      <li
                        className={classnames({
                          active: investment.status === '임대' || investment.status === '매매 / 해산',
                          select: investment.status === '토지매매계약',
                        })}
                      >
                        <i>2</i>
                        토지매매계약
                      </li>
                      <li
                        className={classnames({
                          active: investment.status === '매매 / 해산',
                          select: investment.status === '임대',
                        })}
                      >
                        <i>3</i>
                        임대
                      </li>
                      <li className={classnames({ select: investment.status === '매매 / 해산' })}>
                        <i>4</i>
                        매매 / 해산
                      </li>
                    </ul>
                  )}
                  {investment.business_type === '임대' && (
                    <ul className="lease">
                      <li
                        className={classnames({
                          active:
                            investment.status === '토지매매계약' ||
                            investment.status === '세부계획결정' ||
                            investment.status === '착공' ||
                            investment.status === '준공' ||
                            investment.status === '임대' ||
                            investment.status === '매매 / 해산',
                          select: investment.status === '결성',
                        })}
                      >
                        <i>1</i>
                        결성
                      </li>
                      <li
                        className={classnames({
                          active:
                            investment.status === '세부계획결정' ||
                            investment.status === '착공' ||
                            investment.status === '준공' ||
                            investment.status === '임대' ||
                            investment.status === '매매 / 해산',

                          select: investment.status === '토지매매계약',
                        })}
                      >
                        <i>2</i>
                        토지매매계약
                      </li>
                      <li
                        className={classnames({
                          active:
                            investment.status === '착공' ||
                            investment.status === '준공' ||
                            investment.status === '임대' ||
                            investment.status === '매매 / 해산',
                          select: investment.status === '세부계획결정',
                        })}
                      >
                        <i>3</i>
                        세부계획결정
                      </li>
                      <li
                        className={classnames({
                          active:
                            investment.status === '준공' ||
                            investment.status === '임대' ||
                            investment.status === '매매 / 해산',
                          select: investment.status === '착공',
                        })}
                      >
                        <i>4</i>
                        착공
                      </li>
                      <li
                        className={classnames({
                          active: investment.status === '임대' || investment.status === '매매 / 해산',
                          select: investment.status === '준공',
                        })}
                      >
                        <i>5</i>
                        준공
                      </li>
                      <li
                        className={classnames({
                          active: investment.status === '매매 / 해산',
                          select: investment.status === '임대',
                        })}
                      >
                        <i>6</i>
                        임대
                      </li>
                      <li
                        className={classnames({
                          select: investment.status === '매매 / 해산',
                        })}
                      >
                        <i>7</i>
                        매매 / 해산
                      </li>
                    </ul>
                  )}
                </div>

                <div className="product-list__info">
                  <button className="btn-vote" onClick={toggleProductList}>
                    관련 세부사항 보기
                  </button>
                  <ul className="my-boardtab">
                    {myTabValues.map((item: MyTabValueType, idx: number) => {
                      return (
                        <li key={idx}>
                          <button
                            className={classnames('', {
                              selected: investment.curTab === item.id,
                            })}
                            onClick={() => {
                              setInvestmentItems((val: any) =>
                                val.map((data: any, idx: number) =>
                                  idx === index ? { ...data, curTab: item.id } : data,
                                ),
                              );
                            }}
                          >
                            <span className="subject">{item.sbj}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {/* {user.isAdmin() && isBrowser && (
                    <button className="btn-print" onClick={() => printEvidenceData('test', 'test')}>
                      증빙자료 출력
                    </button>
                  )} */}

                  {investment.curTab === 'boardAll' && (
                    <div className="my-infopanel">
                      <div className="my-infopanel__board">
                        <div className="board">
                          {user.isAdmin() && (
                            <div className="new-notice">
                              <Button
                                label="New Notice"
                                onClick={() => props.history.push(`/new-my-notice/${investment.investment_id}`)}
                              />
                            </div>
                          )}
                          <ul className="board-grid">
                            <li className="board-grid__head">
                              <div className="type">분류</div>
                              <div className="title">제목</div>
                              <div className="date">날짜</div>
                            </li>
                            {investment.voteAndNotices
                              .slice(offsetAll, offsetAll + limit.current)
                              .map((item: any, idx: number) => {
                                return item.type === 'notice' ? (
                                  <li
                                    key={idx}
                                    className={classnames('board-grid__cont', {
                                      show: selectedAll === item.type_id,
                                    })}
                                  >
                                    <div className="type">공지사항</div>
                                    <div className="title">
                                      <span className="text">{item.title}</span>
                                    </div>
                                    <div className="date">
                                      {moment(item.created_at).format(isBrowser ? 'YYYY - MM - DD' : 'YY - MM - DD')}
                                    </div>
                                    <button
                                      type="button"
                                      className={classnames('btn', {
                                        'btn-show': selectedAll === item.type_id,
                                      })}
                                      onClick={() => handleAllExpanded(item)}
                                    >
                                      열기
                                    </button>
                                    <div className="detail">
                                      <p className="detail__text">{item.content}</p>
                                    </div>
                                  </li>
                                ) : (
                                  <li
                                    key={idx}
                                    className={classnames('board-grid__cont', {
                                      show: selectedAll === item.type_id,
                                    })}
                                  >
                                    <div className="type">투표</div>
                                    <div className="title">
                                      <mark className={getVoteStatusText(+investment.max_invest, item, 'class')}>
                                        {getVoteStatusText(+investment.max_invest, item)}
                                      </mark>
                                      {item.is_voted && isMobile && <mark className="flag">투표 완료</mark>}
                                      <span className="text">{item.title}</span>
                                      {item.is_voted && isBrowser && <mark className="flag">투표 완료</mark>}
                                    </div>
                                    <div className="date">
                                      {moment(item.created_at).format(isBrowser ? 'YYYY - MM - DD' : 'YY - MM - DD')}
                                    </div>
                                    <button
                                      type="button"
                                      className={classnames('btn', {
                                        'btn-show': selectedAll === item.type_id,
                                      })}
                                      onClick={() => handleAllExpanded(item)}
                                    >
                                      열기
                                    </button>

                                    <div className="detail">
                                      <p className="detail__text">{item.content}</p>
                                      <div className="detail__info">
                                        {item.file?.name && (
                                          <a
                                            className="file"
                                            href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${item.file?.name}`}
                                            download
                                          >
                                            {item.file?.name}
                                          </a>
                                        )}
                                        <div className="btns">
                                          <button
                                            className="agree"
                                            disabled={item.is_voted === true}
                                            onClick={(e) => {
                                              openVoteModal(e, item, '1');
                                            }}
                                          >
                                            찬성
                                            <i className="ic">
                                              <img src={VoteIcon} alt="" />
                                            </i>
                                          </button>
                                          <button
                                            className="oppose"
                                            disabled={item.is_voted === true}
                                            onClick={(e) => {
                                              openVoteModal(e, item, '2');
                                            }}
                                          >
                                            반대
                                            <i className="ic">
                                              <img src={VoteIcon} alt="" />
                                            </i>
                                          </button>
                                          <button
                                            className="drop"
                                            disabled={item.is_voted === true}
                                            onClick={(e) => {
                                              openVoteModal(e, item, '3');
                                            }}
                                          >
                                            기권
                                          </button>
                                          <form
                                            action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb"
                                            name="nice_form"
                                          >
                                            <input type="hidden" id="m" name="m" value="service" />
                                            <input
                                              type="hidden"
                                              id="token_version_id"
                                              name="token_version_id"
                                              value={tokenVersionId}
                                            />
                                            <input type="hidden" id="enc_data" name="enc_data" value={encData} />
                                            <input
                                              type="hidden"
                                              id="integrity_value"
                                              name="integrity_value"
                                              value={integrityValue}
                                            />
                                            <Button
                                              ref={passButtonRef}
                                              type="button"
                                              onClick={() => onClickOpenPass()}
                                              className="btn-hidden"
                                            />
                                          </form>
                                        </div>
                                        {user.isAdmin() && (
                                          <div className="print">
                                            <button
                                              className="btn-print"
                                              onClick={() => printVoteResult(investment.investment_id, item.id)}
                                            >
                                              투표 결과 출력
                                            </button>
                                            <div className="input-check">
                                              <input
                                                type="checkbox"
                                                id={'display' + idx}
                                                onClick={() => changeAgreeVoteInfo(investment.investment_id, item.id)}
                                              />
                                              <label htmlFor={'display' + idx} className="p-checkbox-label">
                                                <i className="input-check__icon"></i>
                                                개인정보 표시
                                              </label>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <dl
                                        className={classnames('detail__vote', { 'detail__vote--admin': user.isAdmin })}
                                      >
                                        <dt>
                                          투표 결과<>(가결 / 부결)</>
                                        </dt>
                                        <dd className="total">
                                          총 투표권수 : {toFormattedNumber(+investment.max_invest)}개
                                        </dd>
                                        <dd>
                                          찬성 : {getVoteResults(item).agree} (
                                          {getPercentage(getVoteResults(item).agree, +investment.max_invest)}
                                          %)
                                        </dd>
                                        <dd>
                                          반대 : {getVoteResults(item).disagree} (
                                          {getPercentage(getVoteResults(item).disagree, +investment.max_invest)}
                                          %)
                                        </dd>
                                        <dd>
                                          기권 : {getVoteResults(item).abstention} (
                                          {getPercentage(getVoteResults(item).abstention, +investment.max_invest)}
                                          %)
                                        </dd>
                                        <dd>
                                          불참 :
                                          {+investment.max_invest -
                                            getVoteResults(item).agree -
                                            getVoteResults(item).disagree -
                                            getVoteResults(item).abstention}
                                          (
                                          {getPercentage(
                                            +investment.max_invest -
                                              getVoteResults(item).agree -
                                              getVoteResults(item).disagree -
                                              getVoteResults(item).abstention,
                                            +investment.max_invest,
                                          )}
                                          %)
                                        </dd>
                                      </dl>
                                    </div>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                      {investment.voteAndNotices.length !== 0 && (
                        <PageNation
                          total={investment.voteAndNotices.length}
                          limit={limit.current}
                          page={pageAll}
                          setPage={setPageAll}
                        />
                      )}
                    </div>
                  )}
                  {investment.curTab === 'boardNotice' && (
                    <div className="my-infopanel">
                      <div className="my-infopanel__board">
                        <div className="board">
                          {user.isAdmin() && (
                            <div className="new-notice">
                              <Button
                                label="New Notice"
                                onClick={() => props.history.push(`/new-my-notice/${investment.investment_id}`)}
                              />
                            </div>
                          )}
                          <ul className="board-grid">
                            <li className="board-grid__head">
                              <div className="type">No</div>
                              <div className="title">제목</div>
                              <div className="date">날짜</div>
                            </li>
                            {investment.notices
                              .slice(offsetNotice, offsetNotice + limit.current)
                              .map((item: any, index: number) => {
                                return (
                                  <li
                                    key={index}
                                    className={classnames('board-grid__cont', {
                                      show: selectedNotice === item.id,
                                    })}
                                  >
                                    <div className="type">{item.no}</div>
                                    <div className="title">
                                      <span className="text">{item.title}</span>
                                    </div>
                                    <div className="date">
                                      {moment(item.created_at).format(isBrowser ? 'YYYY - MM - DD' : 'YY - MM - DD')}
                                    </div>
                                    <button
                                      type="button"
                                      className={classnames('btn', {
                                        'btn-show': selectedNotice === item.id,
                                      })}
                                      onClick={() => handleNoticeExpanded(item)}
                                    >
                                      열기
                                    </button>
                                    <div className="detail">
                                      <p className="detail__text">{item.content}</p>
                                    </div>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                      {investment.notices.length !== 0 && (
                        <PageNation
                          total={investment.notices.length}
                          limit={limit.current}
                          page={pageNotice}
                          setPage={setPageNotice}
                        />
                      )}
                    </div>
                  )}
                  {investment.curTab === 'boardVote' && (
                    <div className="my-infopanel">
                      <div className="my-infopanel__board">
                        <div className="board">
                          <ul className="board-grid">
                            <li className="board-grid__head">
                              <div className="type">투표상태</div>
                              <div className="title">제목</div>
                              <div className="date">날짜</div>
                            </li>
                            {investment.vote
                              .slice(offsetVote, offsetVote + limit.current)
                              .map((item: any, index: number) => {
                                return (
                                  <li
                                    key={index}
                                    className={classnames('board-grid__cont', {
                                      show: selectedVote === item.id,
                                    })}
                                  >
                                    <div className="type">
                                      <mark className={getVoteStatusText(+investment.max_invest, item, 'class')}>
                                        {getVoteStatusText(+investment.max_invest, item)}
                                      </mark>
                                    </div>
                                    <div className="title">
                                      {item.is_voted && isMobile && <mark className="flag">투표 완료</mark>}
                                      <span className="text">{item.title}</span>
                                      {item.is_voted && isBrowser && <mark className="flag">투표 완료</mark>}
                                    </div>
                                    <div className="date">
                                      {moment(item.created_at).format(isBrowser ? 'YYYY - MM - DD' : 'YY - MM - DD')}
                                    </div>
                                    <button
                                      type="button"
                                      className={classnames('btn', {
                                        'btn-show': selectedVote === item.id,
                                      })}
                                      onClick={() => handleVoteExpanded(item)}
                                    >
                                      열기
                                    </button>
                                    {/* 버튼 클릭시 노출되는 상세 */}
                                    <div className="detail">
                                      <p className="detail__text">{item.content}</p>
                                      <div className="detail__info">
                                        {item.file?.name && (
                                          <a
                                            className="file"
                                            href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${item.file?.name}`}
                                            download
                                          >
                                            {item.file?.name} <span className="tag">관련 서류</span>
                                          </a>
                                        )}
                                        <div className="btns">
                                          <button
                                            className="agree"
                                            disabled={item.is_voted === true}
                                            onClick={(e) => {
                                              openVoteModal(e, item, '1');
                                            }}
                                          >
                                            찬성
                                            <i className="ic">
                                              <img src={VoteIcon} alt="" />
                                            </i>
                                          </button>
                                          <button
                                            className="oppose"
                                            disabled={item.is_voted === true}
                                            onClick={(e) => {
                                              openVoteModal(e, item, '2');
                                            }}
                                          >
                                            반대
                                            <i className="ic">
                                              <img src={VoteIcon} alt="" />
                                            </i>
                                          </button>
                                          <button
                                            className="drop"
                                            disabled={item.is_voted === true}
                                            onClick={(e) => {
                                              openVoteModal(e, item, '3');
                                            }}
                                          >
                                            기권
                                          </button>
                                          <form
                                            action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb"
                                            name="nice_form"
                                          >
                                            <input type="hidden" id="m" name="m" value="service" />
                                            <input
                                              type="hidden"
                                              id="token_version_id"
                                              name="token_version_id"
                                              value={tokenVersionId}
                                            />
                                            <input type="hidden" id="enc_data" name="enc_data" value={encData} />
                                            <input
                                              type="hidden"
                                              id="integrity_value"
                                              name="integrity_value"
                                              value={integrityValue}
                                            />
                                            <Button
                                              ref={passButtonRef}
                                              type="button"
                                              onClick={() => onClickOpenPass()}
                                              className="btn-hidden"
                                            />
                                          </form>
                                        </div>
                                        {user.isAdmin() && (
                                          <div className="print">
                                            <button
                                              className="btn-print"
                                              onClick={() => printVoteResult(investment.investment_id, item.id)}
                                            >
                                              투표 결과 출력
                                            </button>
                                            <div className="input-check">
                                              <input
                                                type="checkbox"
                                                id={'displayVote' + index}
                                                onClick={() => changeAgreeVoteInfo(investment.investment_id, item.id)}
                                              />
                                              <label htmlFor={'displayVote' + index} className="p-checkbox-label">
                                                <i className="input-check__icon"></i>
                                                개인정보 표시
                                              </label>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <dl
                                        className={classnames('detail__vote', { 'detail__vote--admin': user.isAdmin })}
                                      >
                                        <dt>
                                          투표 결과<>(가결 / 부결)</>
                                        </dt>
                                        <dd className="total">
                                          총 투표권수 : {toFormattedNumber(+investment.max_invest)}개
                                        </dd>
                                        <dd>
                                          찬성 : {getVoteResults(item).agree} (
                                          {getPercentage(getVoteResults(item).agree, +investment.max_invest)}
                                          %)
                                        </dd>
                                        <dd>
                                          반대 : {getVoteResults(item).disagree} (
                                          {getPercentage(getVoteResults(item).disagree, +investment.max_invest)}
                                          %)
                                        </dd>
                                        <dd>
                                          기권 : {getVoteResults(item).abstention} (
                                          {getPercentage(getVoteResults(item).abstention, +investment.max_invest)}
                                          %)
                                        </dd>
                                        <dd>
                                          불참 : {'불참인원'}
                                          {`(0%)`}
                                        </dd>
                                      </dl>
                                    </div>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                      {investment.vote.length !== 0 && (
                        <PageNation
                          total={investment.vote.length}
                          limit={limit.current}
                          page={pageVote}
                          setPage={setPageVote}
                        />
                      )}
                    </div>
                  )}
                  {investment.curTab === 'boardData' && (
                    <div className="my-infopanel">
                      <div className="my-infopanel__board">
                        <div className="board board--file">
                          <ul className="board-grid">
                            <li className="board-grid__head">
                              <div className="order">No</div>
                              <div className="title">파일명</div>
                              <div className="btns"></div>
                            </li>
                            {!!investment.document.length &&
                              investment.document.map(({ fileUrl, fileName }, idx: number) => (
                                <li className="board-grid__cont" key={idx}>
                                  <div className="order">{investment.document.length - idx}</div>
                                  <div className="title">
                                    <span>{fileName}</span>
                                  </div>
                                  <div className="btns">
                                    <button onClick={() => handleDocumentShow(fileUrl)}>보기</button>
                                    <a
                                      className="download"
                                      href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${fileUrl}`}
                                    >
                                      다운로드
                                    </a>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

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
      </div>
      {isPdfModal && <DocumentPdfModal fileUrl={curFileUrl} setCloseModal={setIsPdfModal} />}
      {isShowDepositAlert && (
        <DepositAlert visible={true} onHide={handleDepositAlertHide} id={curId} bankInfo={bankInfo} {...props} />
      )}
      {isVoteModal && (
        <VoteModal
          isVoteModal={isVoteModal}
          setCloseModal={setIsVoteModal}
          selectVote={selectVote}
          selectRecord={selectRecord}
          setFlag={setFlag}
          isNicePass={isNicePass}
          passOnClick={() => {
            passButtonRef.current?.click();
          }}
        />
      )}
    </div>
  );
}
