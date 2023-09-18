const {
  select,
  insert,
  remove,
  update,
  getInvestmentVoteResult,
  getUserInvestmentFromUserAndVote,
} = require('../db/queries');
const CONSTANT = require('../utils/constant');

/**
 * Vote 를 user id 와 vote id 를 기준으로 가져옵니다.
 * @param {string} id vote ID
 * @param {string} token JWT Token
 * @returns {Promise<*>}
 */
async function getVoteById(id, user) {
  let query = {};
  if (id !== '') {
    query = { id: { value: id } };
  }
  const vote = await select(CONSTANT.TABLE.VOTE, query, [], 'id DESC');

  const voteRecord = await select(CONSTANT.TABLE.VOTE_RECORD, { created_by: { value: user.id } }, [], 'id DESC');

  for (let i = 0; i < vote.length; i++) {
    for (let j = 0; j < voteRecord.length; j++) {
      if (Number(vote[i].id) === Number(voteRecord[j].vote_id)) {
        vote[i].is_voted = true;
        vote[i].record = voteRecord[j];
      }
    }
  }

  return vote;
}

async function getVotes(id, user) {
  let vote = await select(CONSTANT.TABLE.VOTE, { investment_id: { value: id } }, [], 'id DESC');

  const voteRecord = await select(CONSTANT.TABLE.VOTE_RECORD, { created_by: { value: user.id } }, [], 'id DESC');

  for (let i = 0; i < vote.length; i++) {
    const allVoteRecord = await select(CONSTANT.TABLE.VOTE_RECORD, { vote_id: { value: vote[i].id } }, [], 'id DESC');

    vote[i].all_record = allVoteRecord;

    for (let j = 0; j < voteRecord.length; j++) {
      if (Number(vote[i].id) === Number(voteRecord[j].vote_id)) {
        vote[i].is_voted = true;
        vote[i].record = voteRecord[j];
      }
    }
  }

  return vote;
}

/**
 * Vote Record 를 가져옵니다.
 * @param {string} id vote ID
 * @param {string} token JWT Token
 * @returns {Promise<*>}
 */
async function getVoteRecordById(id, user) {
  let query = {};
  if (id !== '') {
    query = { id: { value: id }, user_id: { value: user.id } };
  }

  const voteRecord = await select(CONSTANT.TABLE.VOTE_RECORD, query, [], 'id DESC');

  return voteRecord;
}

/**
 * Vote Record 를 저장합니다.
 * @param {object} user user object
 * @param {object} payload vote object
 */
async function saveVoteRecord(payload, user) {
  // 유저가 user_investments 테이블에 있는지 확인
  const userInvestment = await getUserInvestmentFromUserAndVote(user.id, payload.vote_id);
  if (userInvestment.length === 0) {
    throw new Error('투표할 권한이 없습니다.');
  }

  if (!payload.id) {
    payload.created_by = user.id;
    payload.created_at = new Date();
    await insert(CONSTANT.TABLE.VOTE_RECORD, payload);
  } else {
    delete payload.is_voted;
    await update(CONSTANT.TABLE.VOTE_RECORD, payload, { id: payload.id });
  }
}

/**
 * Vote 를 저장합니다.
 * @param {object} user user object
 * @param {object} payload vote object
 * @returns {Promise<void>}
 * @constructor
 * @example
 */
async function saveVote(payload, user) {
  if (!payload.id) {
    payload.created_by = user.id;
    payload.created_at = new Date();
    await insert(CONSTANT.TABLE.VOTE, payload);
  } else {
    delete payload.is_voted;
    await update(CONSTANT.TABLE.VOTE, payload, { id: payload.id });
  }
}

/**
 * Vote 를 삭제합니다.
 * @param {string} id vote ID
 * @returns {Promise<void>}
 */
async function removeVote(id) {
  await remove(CONSTANT.TABLE.VOTE, { id });
}

async function updateVoteStatus(payload) {
  const { vote_id, status } = payload;
  const result = await update(CONSTANT.TABLE.VOTE, { status }, { id: vote_id });

  return result;
}

/**
 * 투표 결과를 처리하기 위해 investment_id 를 기준으로 투표 결과를 가져옵니다.
 * @param {string} id investment ID
 * @returns {Promise<unknown>}
 */
async function getVoteByInvestmentId(id, vote_id, masked) {
  // if (id !== '') {
  //   query = { investment_id: { value: id }, status: { value: 'Y' } };
  // }
  // const vote = await select(CONSTANT.TABLE.VOTE, query, [], 'id DESC');

  // vote record의 record 값이 true/false로 찬성 반대를 기록하고 있음

  /*
  제목, 날짜, 안건 -> investments 테이블
  성명, 주민번호, 주소, 연락처 -> users 테이블
  구좌수 -> user_investments 테이블
  찬/반 ->vote_record 테이블

  investments - vote - vote_record
              - user_investments - users
  * created_by : user_id
   */
  // user.id
  const investment = await select(
    CONSTANT.TABLE.INVESTMENTS,
    { id: { value: id }, disabled_at: { value: null } },
    [],
    'id DESC',
  );
  const userInvestments = await getInvestmentVoteResult(id, vote_id, masked);
  return { investment, userInvestments };
  // return await getInvestmentVoteResult(id);
}

module.exports = {
  getVoteById,
  getVotes,
  getVoteRecordById,
  saveVoteRecord,
  saveVote,
  removeVote,
  updateVoteStatus,
  getVoteByInvestmentId,
};
