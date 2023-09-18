import moment from 'moment';
import { isNull, toLower } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { RouteComponentProps } from 'react-router-dom';

import { useUser } from '../store/hooks/hooks';
import APIService from '../services/API';

import './Vote.scss';
import ConfirmationDialog from '../components/ConfirmationDialog';
import qs from 'qs';
import { initializeNicePass } from '../utilities/pass';
import Account from '../services/Account';

const searchTypeItems = [
  { label: '제목', value: 'title' },
  { label: '콘텐츠', value: 'content' },
];

export default function Vote(props: RouteComponentProps) {
  const query: any = qs.parse(props.location.search);
  const [searchType, setSearchType] = useState<string>('title');
  const [searchText, setSearchText] = useState<string>('');
  const [votesRaw, setVotesRaw] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [selectedVote, setSelectedVote] = useState<number>(0);
  const [visibleConfirmDelete, setVisibleConfirmDelete] = useState<boolean>(false);
  const [visibleConfirmVote, setVisibleConfirmVote] = useState<boolean>(false);
  const [investmentName, setInvestmentName] = useState<string>('');
  const [investId, setInvestId] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [record, setRecord] = useState<any>('');
  const [encData, setEncData] = useState<string>('');
  const [tokenVersionId, setTokenVersionId] = useState<string>('');
  const [integrityValue, setIntegrityValue] = useState<string>('');
  const user = useUser();

  const getVotes = async (id: string) => {
    const data = await APIService.getVotes(id);
    if (data.success) {
      setVotesRaw(data.data);
      setVotes(data.data);
    }
  };

  const getInvestmentName = async (id: string) => {
    const data = await APIService.getInvestment(id);
    if (data.success) {
      const { title, id: invest_id } = data.data[0];

      setInvestmentName(title);
      setInvestId(invest_id);
    }
  };

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleConfirmDialogAccept = async () => {
    await APIService.removeVote(selectedVote);
    setVisibleConfirmDelete(false);
    getVotes(investId);
  };

  const handleConfirmDialogDismiss = () => {
    setVisibleConfirmDelete(false);
  };

  const handleConfirmVoteDialogAccpect = async () => {
    const body = {
      invest_id: investId,
      vote_id: id,
      record,
    };

    localStorage.setItem('tmp_request', JSON.stringify(body));

    const form = document.getElementsByName('nice_form')[0] as HTMLFormElement;

    window.open('', 'nice', 'width=475, height=750, toolbar=no, menubar=no, scrollbars=no, resizable=no');
    form.target = 'nice';
    form.submit();
  };

  const sendConfirmVote = async (body: any) => {
    const data = await APIService.saveVoteRecord(body);

    if (data.success) {
      localStorage.removeItem('tmp_request');
      // window.location.href = '/vote?id=' + investId;
      getVotes(investId);
    }
  };

  const handleConfirmVoteDialogDismiss = () => {
    setId('');
    setRecord('');
    setVisibleConfirmVote(false);
  };

  const handleSaveVoteRecord = async (id: string, record: any) => {
    setId(id);
    setRecord(record);
    setVisibleConfirmVote(true);
  };

  const handleShowClick = async (id: string) => {
    const body = {
      vote_id: id,
      status: 'done',
    };

    const data = await APIService.updateVoteStatus(body);

    if (data.success) {
      getVotes(investId);
    }
  };

  const initializePass = async () => {
    const returlUrl = window.location.origin + '/nice';
    const { enc_data, token_version_id, integrity_value } = await initializeNicePass(returlUrl);

    setEncData(enc_data);
    setTokenVersionId(token_version_id);
    setIntegrityValue(integrity_value);
  };

  const validateCi = async (ci: string) => {
    const data = await Account.validateCi(ci);

    if (!data.success) {
      alert('회원님의 휴대폰 명의로 본인인증 해주세요.');
      window.location.href = '/vote?id=' + investId;
    }
  };

  useEffect(() => {
    const data = votesRaw.filter((item: any) => {
      return toLower(item[searchType]).indexOf(toLower(searchText)) >= 0;
    });
    setVotes(data);
  }, [searchType, searchText, votesRaw]);

  useEffect(() => {
    const id = query['?id'];

    setInvestId(id);
    getVotes(id);
    getInvestmentName(id);
    initializePass();

    window.addEventListener('storage', () => {
      const niceData = localStorage.getItem('nicePass');

      if (niceData) {
        const { ci } = JSON.parse(niceData);
        const body = JSON.parse(localStorage.getItem('tmp_request')!);
        const { invest_id, ...rest } = body;

        validateCi(ci);
        setInvestId(invest_id);
        getVotes(invest_id);
        getInvestmentName(invest_id);
        sendConfirmVote(rest);
      }
    });

    return () => {
      localStorage.removeItem('nicePass');
      localStorage.removeItem('tmp_request');
      window.removeEventListener('storage', () => {});
    };
  }, []);

  return (
    <div className="vote-wrapper">
      <div className="vote-container">
        <h1 className="text-center font-black">{investmentName} - 투표</h1>
        {user.isAdmin() && (
          <div className="new-vote">
            <Button label="New Vote" onClick={() => props.history.push(`/new-vote?investmentId=${investId}`)} />
          </div>
        )}
        <div className="search-group">
          <Dropdown value={searchType} options={searchTypeItems} onChange={(e: any) => setSearchType(e.value)} />
          <div className="search-input">
            <InputText placeholder="search" onChange={handleSearchChange} />
            <span className="pi pi-search"></span>
          </div>
        </div>
        <div className="vote-content">
          {votes.map((item: any) => {
            const handleVoteExpanded = () => {
              if (selectedVote !== item.id) {
                setSelectedVote(item.id);
              } else {
                setSelectedVote(0);
              }
            };
            const handleEditClick = (e: any) => {
              props.history.push('/new-vote?id=' + item.id + '&investment_id=' + investId);
              e.stopPropagation();
            };

            const handleRemoveClick = () => {
              setSelectedVote(item.id);
              setVisibleConfirmDelete(true);
            };

            const duration = moment.duration(moment(item.created_at).diff(moment()));

            let file;
            let yes = 0;
            let none = 0;
            let no = 0;

            if (item.file !== 'null' && isNull(item.file)) file = item.file;

            item.all_record.map((record: any) => {
              if (record.record === 'true') yes++;
              else if (record.record === 'false') no++;
              else none++;
            });

            return (
              <>
                <div className="vote-row">
                  <div className="left-content">
                    {duration.asMinutes() <= 7 * 24 * 60 && <span className="new-label font-bold">NEW</span>}
                    <span className="font-regular" onClick={handleVoteExpanded}>
                      {item.title}
                      {item.record &&
                        ` - [${
                          item.record.record === 'true' ? '찬성' : item.record.record === 'false' ? '반대' : '기권'
                        }] 에 투표하셨습니다.`}
                    </span>
                  </div>
                  <div className="right-content">
                    <span className="font-regular">{moment(item.created_at).format('YYYY-MM-DD')}</span>
                    <span className="pi pi-angle-down pointer" onClick={handleVoteExpanded}></span>
                  </div>
                </div>
                {selectedVote === item.id && (
                  <>
                    <div className="vote-content-row">
                      <p>{item.content}</p>
                      <div className="edit-remove-group">
                        {item.record
                          ? null
                          : item.status === 'ongoing' && (
                              <>
                                <Button icon="pi pi-thumbs-up" onClick={() => handleSaveVoteRecord(item.id, true)} />
                                <Button icon="pi pi-flag" onClick={() => handleSaveVoteRecord(item.id, 'none')} />
                                <Button icon="pi pi-thumbs-down" onClick={() => handleSaveVoteRecord(item.id, false)} />
                              </>
                            )}
                        {user.isAdmin() && (
                          <>
                            {item.status === 'ongoing' && (
                              <Button icon="pi pi-eye" onClick={() => handleShowClick(item.id)} />
                            )}
                            <Button icon="pi pi-pencil" onClick={handleEditClick} />
                            <Button className="p-button-danger" icon="pi pi-times" onClick={handleRemoveClick} />
                          </>
                        )}
                      </div>
                      {file && (
                        <div style={{ marginTop: '12px' }}>
                          <a
                            href={`${process.env.REACT_APP_DOCUMENT_API_URL}/content?filename=${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {file}
                          </a>
                        </div>
                      )}
                      {(item.status !== 'ongoing' || user.isAdmin()) && (
                        <div style={{ marginTop: '12px' }}>
                          <p>
                            <strong>투표 결과</strong> <br />
                            찬성: {yes} <br />
                            반대: {no} <br />
                            기권: {none}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            );
          })}
        </div>
        <div className="vote-paginator">
          <button>
            <span className="pi pi-angle-double-left"></span>
          </button>
          <button>
            <span className="pi pi-angle-left"></span>
          </button>
          <div className="paginator-number">
            <div className="active">1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
          </div>
          <button>
            <span className="pi pi-angle-double-right"></span>
          </button>
          <button>
            <span className="pi pi-angle-right"></span>
          </button>
        </div>
      </div>
      <ConfirmationDialog
        header="삭제 확인"
        visible={visibleConfirmDelete}
        acceptText="Yes"
        dismissText="No"
        onAccept={handleConfirmDialogAccept}
        onDismiss={handleConfirmDialogDismiss}
        message="삭제하시겠습니까?"
      />
      <ConfirmationDialog
        header="투표 확인"
        visible={visibleConfirmVote}
        acceptText="Yes"
        dismissText="No"
        onAccept={handleConfirmVoteDialogAccpect}
        onDismiss={handleConfirmVoteDialogDismiss}
        message={record === true ? '찬성하시겠습니까?' : record === false ? '반대하시겠습니까?' : '기권하시겠습니까?'}
      />
      <form
        action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb"
        name="nice_form"
        style={{ display: 'none' }}
      >
        <input type="hidden" id="m" name="m" value="service" />
        <input type="hidden" id="token_version_id" name="token_version_id" value={tokenVersionId} />
        <input type="hidden" id="enc_data" name="enc_data" value={encData} />
        <input type="hidden" id="integrity_value" name="integrity_value" value={integrityValue} />
        <Button style={{ display: 'none' }} type="submit" id="본인인증" label="본인인증" />
      </form>
    </div>
  );
}
