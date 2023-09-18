const { insert, executeQuery, select } = require('../db/queries');
const CONSTANT = require('../utils/constant');

async function getAuditLogs() {
  const logs = await executeQuery(`SELECT * FROM ${CONSTANT.TABLE.LOG} ORDER BY id DESC`, []);
  const users = await select(CONSTANT.TABLE.USER, {}, ['id', 'email']);
  const userObj = users.reduce((obj, item) => {
    obj[item.id] = item.email;
    return obj;
  }, {});
  logs.forEach(element => {
    element.action_by = userObj[Number(element.admin_id)];
    element.action_to = userObj[Number(element.user_id)];
  });
  return logs;
}

async function countAuditLogs() {
  const logs = await executeQuery(`SELECT COUNT(*) AS count FROM ${CONSTANT.TABLE.LOG}`, []);
  return logs[0].count;
}

async function saveAuditLogs(params) {
  await insert(CONSTANT.TABLE.LOG, {
    admin_id: params.admin_id,
    user_id: params.user_id,
    event_id: params.event_id,
    pre_data: params.pre_data ? JSON.stringify(params.pre_data) : null,
    post_data: params.post_data ? JSON.stringify(params.post_data) : null,
    data: JSON.stringify(params.data),
  });
}

module.exports = { saveAuditLogs, countAuditLogs, getAuditLogs };
