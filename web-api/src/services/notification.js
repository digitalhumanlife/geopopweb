const {select, insert, update, updateSendNotification} = require('../db/queries');
const CONSTANT = require('../utils/constant');

/*
investment에 대해서 사용자가 알림 설정을 한 경우
 */

async function getEmailNotifications() {
  return await select(CONSTANT.TABLE.NOTIFICATION, {type: {value: "email"}, disabled_at: {value: null}}, [], '');
}

async function getSmsNotifications() {
  return await select(CONSTANT.TABLE.NOTIFICATION, {type: {value: "sms"}, disabled_at: {value: null}}, [], '');
}

async function getNotification(investment_id, user_id) {
  return await select(CONSTANT.TABLE.NOTIFICATION, {user_id: {value: user_id}, investment_id: {value: investment_id}, disabled_at: {value: null}}, [], '');
}

async function addNotification(payload) {
  if (!payload.id) {
    payload.created_at = new Date();
    delete payload.disabled_at;

    await insert(CONSTANT.TABLE.NOTIFICATION, payload);
  } else {
    await update(CONSTANT.TABLE.NOTIFICATION, payload, { id: payload.id });
  }
}

async function removeNotification(id) {
  await update(CONSTANT.TABLE.NOTIFICATION, {disabled_at: new Date()}, { id: id });
}

async function setSendNotification(user_id, investment_id, type) {
  await updateSendNotification(user_id, investment_id, type);
}


module.exports = {
  addNotification,
  getEmailNotifications,
  getSmsNotifications,
  getNotification,
  removeNotification,
  setSendNotification,
};