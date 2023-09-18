const { select, insert, update, getInvestmentPrice, getAdminUserInvestment } = require('../db/queries');
const CONSTANT = require('../utils/constant');

async function getBought(user) {
  let userInvestments;
  if (user.role === 'admin') {
    userInvestments = await getAdminUserInvestment();
  } else {
    userInvestments = await select(CONSTANT.TABLE.USER_INVESTMENTS, { created_by: { value: user.id } }, [], 'id DESC');
  }
  for (let i = 0; i < userInvestments.length; i++) {
    const investments = await select(
      CONSTANT.TABLE.INVESTMENTS,
      { id: { value: userInvestments[i].investment_id }, disabled_at: { value: null } },
      [],
      '',
    );
    let investmentId;
    if (investments.length === 0) {
      console.log('investment not found');
      investmentId = 0;
    } else {
      investmentId = investments[0].id;
    }
    const notices = await select(
      CONSTANT.TABLE.NOTICES,
      { investment_id: { value: investmentId } },
      [],
      'created_at DESC',
    );
    if (notices.length > 0) {
      userInvestments[i].notices = notices;
    } else {
      userInvestments[i].notices = [];
    }

    const currentUserInvestments = await select(
      CONSTANT.TABLE.USER_INVESTMENTS,
      { investment_id: { value: investments[0].id } },
      [],
      'id DESC',
    );

    // 참여인원 카운트
    userInvestments[i].total_invest_user_count = currentUserInvestments.length ? currentUserInvestments.length : 0;

    // 전체 구좌수 카운트
    // 참여 구좌수 전체 카운트 (전체구좌수 - 불참구좌수)
    // 불참 구좌수 전체 카운트
    // 기권 구좌수 전체 카운트 (기권투표된 구좌수)

    const votes = await getUserInvestVotes(investmentId, user.id);
    if (votes.length > 0) {
      for (let j = 0; j < votes.length; j++) {
        // 참여구좌수 카운트
        votes[j].amount_count = 0;
        for (let k = 0; k < votes[j].all_record.length; k++) {
          for (let l = 0; l < currentUserInvestments.length; l++) {
            if (votes[j].all_record[k].created_by === currentUserInvestments[l].created_by) {
              const oldAmount = parseInt(votes[j].amount_count ? votes[j].amount_count : '0');
              const userInvestmentAmount = parseInt(
                currentUserInvestments[l].amount ? currentUserInvestments[l].amount : '0',
              );
              votes[j].amount_count = oldAmount + userInvestmentAmount;
            }
          }
        }
      }
      userInvestments[i].vote = votes;
    } else {
      userInvestments[i].vote = [];
    }
    if (investments.length > 0) {
      userInvestments[i].title = investments[0].title;
      userInvestments[i].status = investments[0].status;
      userInvestments[i].document1 = investments[0].document1;
      userInvestments[i].document1_org = investments[0].document1_org;
      userInvestments[i].document2 = investments[0].document2;
      userInvestments[i].document2_org = investments[0].document2_org;
      userInvestments[i].document3 = investments[0].document3;
      userInvestments[i].document3_org = investments[0].document3_org;
      userInvestments[i].document4 = investments[0].document4;
      userInvestments[i].document4_org = investments[0].document4_org;
      userInvestments[i].document5 = investments[0].document5;
      userInvestments[i].document5_org = investments[0].document5_org;
      userInvestments[i].end_date = investments[0].end_date;
      userInvestments[i].max_invest = investments[0].max_invest;
      userInvestments[i].business_type = investments[0].business_type;
    }
  }

  // console.log(userInvestments)
  return userInvestments;
}

async function getUserInvestVotes(investmentId, userId) {
  const votes = await select(CONSTANT.TABLE.VOTE, { investment_id: { value: investmentId } }, [], 'id DESC');

  for (let i = 0; i < votes.length; i++) {
    // const voteRecord = await select(CONSTANT.TABLE.VOTE_RECORD, { created_by: { value: userId } }, [], 'id DESC');

    const allVoteRecord = await select(CONSTANT.TABLE.VOTE_RECORD, { vote_id: { value: votes[i].id } }, [], 'id DESC');
    if (allVoteRecord.length > 0) {
      votes[i].all_record = allVoteRecord;
    } else {
      votes[i].all_record = [];
    }

    for (let j = 0; j < allVoteRecord.length; j++) {
      if (Number(allVoteRecord[j].created_by) === Number(userId)) {
        votes[i].is_voted = true;
        votes[i].record = allVoteRecord[j];
      }
    }
  }
  return votes;
}

async function saveBuy(user, payload) {
  const investments = await select(CONSTANT.TABLE.INVESTMENTS, { id: { value: payload.investment_id } }, [], '');
  if (investments.length === 0) {
    throw new Error('Not found');
  }
  if (Number(investments[0].current_invest) + Number(payload.amount) > Number(investments[0].max_invest)) {
    throw new Error('Over total account');
  }
  payload.created_by = user.id;
  payload.created_at = new Date();
  await insert(CONSTANT.TABLE.USER_INVESTMENTS, payload);
  await update(
    CONSTANT.TABLE.INVESTMENTS,
    { current_invest: Number(investments[0].current_invest) + Number(payload.amount) },
    { id: payload.investment_id },
  );
}

async function getAllBought() {
  const userInvestments = await select(CONSTANT.TABLE.USER_INVESTMENTS, {}, [], 'id DESC');
  for (let i = 0; i < userInvestments.length; i++) {
    const investments = await select(
      CONSTANT.TABLE.INVESTMENTS,
      { id: { value: userInvestments[i].investment_id }, disabled_at: { value: null } },
      [],
      '',
    );
    if (investments.length > 0) {
      userInvestments[i].title = investments[0].title;
      userInvestments[i].status = investments[0].status;
    }
    const users = await select(CONSTANT.TABLE.USER, { id: { value: userInvestments[i].created_by } }, ['email'], '');
    if (users.length > 0) {
      userInvestments[i].email = users[0].email;
    }
  }
  return userInvestments;
}

async function getBoughtById(id) {
  const userInvestments = await select(CONSTANT.TABLE.USER_INVESTMENTS, { investment_id: { value: id } }, [], '');
  if (userInvestments.length > 0) {
    const investments = await select(
      CONSTANT.TABLE.INVESTMENTS,
      { id: { value: userInvestments[0].investment_id }, disabled_at: { value: null } },
      [],
      '',
    );
    if (investments.length > 0) {
      userInvestments[0].title = investments[0].title;
      userInvestments[0].status = investments[0].status;
    }
    const users = await select(CONSTANT.TABLE.USER, { id: { value: userInvestments[0].created_by } }, ['email'], '');
    if (users.length > 0) {
      userInvestments[0].email = users[0].email;
    }
  }
  return userInvestments;
}

async function confirmPaid(id) {
  await update(CONSTANT.TABLE.USER_INVESTMENTS, { paid_status: 'paid' }, { id: id });
  return 'ok';
}

async function getPrice(user, investmentId) {
  if (!investmentId) {
    throw new Error('Bad request');
  }
  const prices = await getInvestmentPrice(investmentId, user.id);
  if (prices.length === 0) {
    throw new Error('Not found');
  }
  const price = prices[0];
  if (price.amount && price.won_per_account) {
    return price.amount * price.won_per_account;
  }
  throw new Error('Not found');
}

module.exports = {
  saveBuy,
  getBought,
  getAllBought,
  confirmPaid,
  getBoughtById,
  getPrice,
};
