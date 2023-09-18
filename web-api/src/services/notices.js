const {select, insert, remove, update} = require('../db/queries');
const CONSTANT = require('../utils/constant');

async function getNotices(id) {
  let query = {investment_id: {value: null}};
  if (id !== '') {
    query = {id: {value: id}, investment_id: {value: null}};
  }
  return await select(CONSTANT.TABLE.NOTICES, query, [], 'id DESC');
}

async function saveNotice(user, payload) {
  if (!payload.id) {
    payload.created_by = user.id;
    payload.created_at = new Date();
    delete payload.investment_id;

    await insert(CONSTANT.TABLE.NOTICES, payload);
  } else {
    await update(CONSTANT.TABLE.NOTICES, payload, {id: payload.id});
  }
}

async function saveInvestmentNotice(user, payload) {
  if (!payload.id) {
    payload.created_by = user.id;
    payload.created_at = new Date();
    await insert(CONSTANT.TABLE.NOTICES, payload);
  } else {
    await update(CONSTANT.TABLE.NOTICES, payload, {id: payload.id});
  }
}

async function removeNotice(id) {
  await remove(CONSTANT.TABLE.NOTICES, {id: id});
}

module.exports = {
  saveNotice,
  saveInvestmentNotice,
  getNotices,
  removeNotice,
};
