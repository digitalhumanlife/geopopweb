const jwt = require('jsonwebtoken');
const { isEmpty } = require('lodash');
const { select, insert, softDelete, update, getMyInvestment } = require('../db/queries');
const CONSTANT = require('../utils/constant');
const { JWT_SECRET } = require('../utils/utils');

/*
상태
=> 상품이 프론트에 표시되는 '예정', '진행중', '완료' 와는 관계가 없음
=> 프론트에서 시작날짜와 종료날짜를 사용해서 직접 분류중임

상태는 투표 등에서 사용되는 것으로 보임
const statusOptions = [
  { label: '모집', value: '모집' },
  { label: '토지계약/잔금', value: '토지계약/잔금' },
  { label: '착공', value: '착공' },
  { label: '판매', value: '판매' },
  { label: '이익배분', value: '이익배분' },
];
 */

async function getInvestments(id, token) {
  let query = { disabled_at: { value: null } };
  if (id !== '') {
    query = { id: { value: id }, disabled_at: { value: null } };
  }
  const investments = await select(CONSTANT.TABLE.INVESTMENTS, query, [], 'id DESC');

  if (!isEmpty(token)) {
    const user = await jwt.verify(token, JWT_SECRET);
    const bookmarks = await select(CONSTANT.TABLE.BOOKMARKS, { user_id: { value: user.id } }, [], 'id DESC');
    for (let i = 0; i < investments.length; i++) {
      for (let j = 0; j < bookmarks.length; j++) {
        if (Number(investments[i].id) === Number(bookmarks[j].investment_id)) {
          investments[i].is_bookmarked = true;
        }
      }
      const hasInvested = await select(
        CONSTANT.TABLE.USER_INVESTMENTS,
        { created_by: { value: user.id }, investment_id: { value: investments[i].id } },
        [],
        '',
      );
      investments[i].has_invested = hasInvested.length > 0;

      const hasBookmarked = await select(
        CONSTANT.TABLE.BOOKMARKS,
        { user_id: { value: user.id }, investment_id: { value: investments[i].id } },
        [],
        '',
      );
      investments[i].is_bookmarked = hasBookmarked.length > 0;

      const notices = await select(
        CONSTANT.TABLE.NOTICES,
        { investment_id: { value: investments[i].id } },
        [],
        'id DESC',
      );
      if (notices.length > 0) {
        investments[i].notices = notices;
      } else {
        investments[i].notices = [];
      }
    }
  }
  return investments;
}

async function getMyInvestments(user) {
  let investments;
  if (user.role === 'admin') {
    investments = await select(CONSTANT.TABLE.INVESTMENTS, { disabled_at: { value: null } }, [], 'id DESC');
    for (let i = 0; i < investments.length; i++) {
      const votes = await select(CONSTANT.TABLE.VOTE, { investment_id: { value: investments[i].id } }, [], 'id DESC');
      if (votes.length > 0) {
        for (let j = 0; j < votes.length; j++) {
          const voteRecords = await select(
            CONSTANT.TABLE.VOTE_RECORD,
            { vote_id: { value: votes[j].id } },
            [],
            'id DESC',
          );
          votes[j].is_voted = voteRecords.length > 0;
        }
        investments[i].votes = votes;
      } else {
        investments[i].votes = [];
      }
      const notices = await select(
        CONSTANT.TABLE.NOTICES,
        { investment_id: { value: investments[i].id } },
        [],
        'id DESC',
      );
      if (notices.length > 0) {
        investments[i].notices = notices;
      } else {
        investments[i].notices = [];
      }
    }
  } else {
    investments = await getMyInvestment(user.id);
    for (let i = 0; i < investments.length; i++) {
      const votes = await select(CONSTANT.TABLE.VOTE, { investment_id: { value: investments[i].id } }, [], 'id DESC');
      if (votes.length > 0) {
        for (let j = 0; j < votes.length; j++) {
          const voteRecords = await select(
            CONSTANT.TABLE.VOTE_RECORD,
            { vote_id: { value: votes[j].id }, created_by: { value: user.id } },
            [],
            'id DESC',
          );
          votes[j].is_voted = voteRecords.length > 0;
        }
        investments[i].votes = votes;
      } else {
        investments[i].votes = [];
      }

      const notices = await select(
        CONSTANT.TABLE.NOTICES,
        { investment_id: { value: investments[i].id } },
        [],
        'id DESC',
      );
      if (notices.length > 0) {
        investments[i].notices = notices;
      } else {
        investments[i].notices = [];
      }
    }
  }
  return investments;
}

async function saveInvestment(user, payload) {
  console.log(payload);
  if (!payload.id) {
    payload.created_by = user.id;
    payload.created_at = new Date();
    payload.max_invest = payload.max_invest || 0;
    payload.current_invest = payload.current_invest || 0;
    await insert(CONSTANT.TABLE.INVESTMENTS, payload);
  } else {
    delete payload.is_bookmarked;
    await update(CONSTANT.TABLE.INVESTMENTS, payload, { id: payload.id });
  }
}

async function removeInvestment(id) {
  // await remove(CONSTANT.TABLE.INVESTMENTS, {id: id});
  await softDelete(CONSTANT.TABLE.INVESTMENTS, { id: id });
}

async function updateRecruitmentComplete(id, complete) {
  await update(CONSTANT.TABLE.INVESTMENTS, { recruitment_complete: complete }, { id: id });
}

async function getInvestBanking(id) {
  // 입금 계좌 관련 정보 획득
  const investment = await select(
    CONSTANT.TABLE.INVESTMENTS,
    { id: { value: id }, disabled_at: { value: null } },
    [],
    'id DESC',
  );
  if (investment && investment.length > 0) {
    const result = {
      account_holder: investment[0].account_holder,
      bank_name: investment[0].bank_name,
      bank_account: investment[0].bank_account,
    };
    return result;
  }
  return investment;
}

module.exports = {
  saveInvestment,
  getInvestments,
  removeInvestment,
  getMyInvestments,
  updateRecruitmentComplete,
  getInvestBanking,
};
