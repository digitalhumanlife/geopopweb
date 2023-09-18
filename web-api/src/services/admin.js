const Bcrypt = require('bcrypt');
const { cloneDeep, isEmpty } = require('lodash');

const { select, update, insert } = require('../db/queries');
const CONSTANT = require('../utils/constant');
const { saveAuditLogs } = require('./audit-log');
const { getDifferenceBetweenTwoObject, removeEmptyValue } = require('../utils/utils');

async function getUsers() {
  const users = await select(CONSTANT.TABLE.USER, {}, [], '');
  return users;
}

async function createOrUpdateUser(user, payload) {
  const updatedId = payload.id || 0;
  const updatePayload = {
    email: payload.email,
    role: payload.role,
    activated: payload.activated,
  };
  if (payload.password !== '********') {
    updatePayload.password = await Bcrypt.hash(payload.password, 2);
  }

  if (updatedId > 0) {
    const oldUsers = await select(CONSTANT.TABLE.USER, { id: { value: updatedId } }, [], '');
    await update(CONSTANT.TABLE.USER, updatePayload, { id: updatedId });
    const data = getDifferenceBetweenTwoObject(
      { email: oldUsers[0].email, role: oldUsers[0].role, activated: oldUsers[0].activated },
      cloneDeep(updatePayload),
    );
    const logData = removeEmptyValue({
      EMAIL: data.email,
      ROLE: data.role,
      ACTIVATED: data.activated,
    });
    if (!isEmpty(logData)) {
      await saveAuditLogs({
        admin_id: user.id,
        user_id: updatedId,
        event_id: 'UPDATE USER',
        pre_data: {
          EMAIL: oldUsers[0].email,
          ROLE: oldUsers[0].role,
          ACTIVATED: oldUsers[0].activated,
        },
        data: {
          EMAIL: updatePayload.email,
          ROLE: updatePayload.role,
          ACTIVATED: updatePayload.activated,
        },
      });
    }
  } else {
    const oldUsers = await select(CONSTANT.TABLE.USER, { email: { value: payload.email } }, [], '');

    if (oldUsers.length > 0) {
      throw new Error('User existed');
    }
    await insert(CONSTANT.TABLE.USER, updatePayload);
    await saveAuditLogs({
      admin_id: user.id,
      user_id: updatedId,
      event_id: 'CREATE USER',
      data: {
        EMAIL: payload.email,
        ROLE: payload.role,
        ACTIVATED: payload.activated,
      },
    });
  }

  return payload;
}

module.exports = { getUsers, createOrUpdateUser };
