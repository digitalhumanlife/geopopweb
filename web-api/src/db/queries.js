const { isEmpty } = require('lodash');
const Pool = require('pg').Pool;

const config = require('../../config');

const pool = new Pool({
  user: config.postgres.user,
  host: config.postgres.host,
  database: config.postgres.database,
  password: config.postgres.password,
  port: config.postgres.port,
});

function select(table, conditions, fields, orderBy) {
  return new Promise((resolve, reject) => {
    let query = `SELECT ${fields.length === 0 ? '*' : fields.join(',')} FROM ${table}`;
    const values = [];
    const cdtions = [];
    const keys = Object.keys(conditions);
    if (keys.length > 0) {
      for (let i = 0; i < keys.length; i++) {
        if (conditions[keys[i]].value == null) {
          cdtions.push(`${keys[i]} ${conditions[keys[i]].operator || 'is'} null`);
        } else {
          cdtions.push(`${keys[i]} ${conditions[keys[i]].operator || '='} $${i + 1}`);
          values.push(conditions[keys[i]].value);
        }
      }

      query += ` WHERE ${cdtions.join(' AND ')}`;
    }

    if (!isEmpty(orderBy)) {
      query += ` ORDER BY ${orderBy}`;
    }
    // console.log(query, values);

    pool.query(query, values, (error, results) => {
      if (error) {
        console.log(table, conditions, fields, orderBy, error);
        return reject(error);
      }
      resolve(results.rows);
    });
  });
}

function insert(table, params) {
  return new Promise((resolve, reject) => {
    const fields = [];
    const indexes = [];
    const values = [];
    const keys = Object.keys(params);
    for (let i = 0; i < keys.length; i++) {
      fields.push(keys[i]);
      indexes.push(`$${i + 1}`);
      values.push(params[keys[i]]);
    }
    const query = `INSERT INTO ${table}(${fields.join(',')}) VALUES (${indexes.join(',')}) RETURNING id`;
    pool.query(query, values, (error, results) => {
      if (error) {
        console.log(table, params, error);
        return reject(error);
      }
      const id = results.rows[0].id;
      resolve(id);
    });
  });
}

function update(table, params, conditions) {
  return new Promise((resolve, reject) => {
    const cdtions = [];
    const indexes = [];
    const values = [];
    const paramKeys = Object.keys(params);
    for (let i = 0; i < paramKeys.length; i++) {
      indexes.push(`${paramKeys[i]}=$${i + 1}`);
      values.push(params[paramKeys[i]]);
    }
    const conditionKeys = Object.keys(conditions);
    for (let i = 0; i < conditionKeys.length; i++) {
      cdtions.push(`${conditionKeys[i]}=$${i + 1 + paramKeys.length}`);
      values.push(conditions[conditionKeys[i]]);
    }
    let query = `UPDATE ${table} SET ${indexes.join(',')}`;
    if (cdtions.length > 0) {
      query += ` WHERE ${cdtions.join(' AND ')}`;
    }
    pool.query(query, values, (error, results) => {
      if (error) {
        console.log(table, params, conditions, error);
        return reject(error);
      }
      resolve(results.rowCount);
    });
  });
}

function remove(table, conditions) {
  return new Promise((resolve, reject) => {
    const cdtions = [];
    const values = [];
    const conditionKeys = Object.keys(conditions);
    for (let i = 0; i < conditionKeys.length; i++) {
      cdtions.push(`${conditionKeys[i]}=$${i + 1}`);
      values.push(conditions[conditionKeys[i]]);
    }
    let query = `DELETE FROM ${table}`;
    if (cdtions.length > 0) {
      query += ` WHERE ${cdtions.join(' AND ')}`;
    }

    pool.query(query, values, (error) => {
      if (error) {
        console.log(table, conditions, error);
        return reject(error);
      }
      resolve();
    });
  });
}

function softDelete(table, conditions) {
  return new Promise((resolve, reject) => {
    const cdtions = [];
    const values = [];
    const conditionKeys = Object.keys(conditions);
    for (let i = 0; i < conditionKeys.length; i++) {
      cdtions.push(`${conditionKeys[i]}=$${i + 1}`);
      values.push(conditions[conditionKeys[i]]);
    }
    let query = `UPDATE ${table} set disabled_at = now() `;
    if (cdtions.length > 0) {
      query += ` WHERE ${cdtions.join(' AND ')}`;
    }

    pool.query(query, values, (error) => {
      if (error) {
        console.log(table, conditions, error);
        return reject(error);
      }
      resolve();
    });
  });
}

function executeQuery(query, values) {
  return new Promise((resolve, reject) => {
    pool.query(query, values, (error, results) => {
      if (error) {
        console.log(query, error);
        return reject(error);
      }
      resolve(results.rows);
    });
  });
}

function getInvestmentVoteResult(investmentId, voteId, masked) {
  try {
    return new Promise((resolve, reject) => {
      const values = [];
      let query = `SELECT `;
      query += ` vote.title as title, `;

      if (masked !== 'true') {
        // 이름, 주민번호, 주소, 연락처 마스킹
        query += ` users.name as name, `;
        query += ` users.year as year, `;
        query += ` users.month as month, `;
        query += ` users.day as day, `;
        query += ` users.address as address, `;
        query += ` users.phone2 as phone2, `;
      } else {
        query += ` REGEXP_REPLACE(users.name, '(?<=.{'|| 2 || '}).', '*', 'g') as name, `;
        query += ` users.year as year, `;
        query += ` users.month as month, `;
        query += ` users.day as day, `;
        query += ` CONCAT(REGEXP_REPLACE(address, '(?<=.{'|| 7 || '}).', '', 'g'), '***') as address, `;
        query += ` REGEXP_REPLACE(users.phone2, '^(\\d{3})?(\\d{3,4})(\\d{4})$', '\\1'||'****'||'\\3', 'g') as phone2,`;
      }
      query += ` users.gender as gender, `;
      query += ` users.type as type, `;
      query += ` users.business_number as business_number, `;
      query += ` user_investments.amount as amount, `; // 구매수량
      query += ` vote_record.record as record, `; // 찬성 반대

      query += ` (select count(*) from user_investments uis where uis.investment_id = ${investmentId}) as total_invest_user_count `; // 전체 참여 인원수

      // query += ` FROM users`;
      // query += ` left join vote on vote.created_by = users.id`;
      // query += ` left join user_investments on user_investments.created_by = users.id`;
      // query += ` left join vote_record on vote.id = CAST(vote_record.vote_id AS INTEGER)`;
      // query += ` WHERE vote.investment_id = ${investmentId}`;
      // query += ` AND vote.id = ${voteId}`;
      query += ` from vote_record `;
      query += ` left join vote on vote.id = CAST(vote_record.vote_id AS INTEGER) `;
      query += ` left join users on users.id = vote_record.created_by `;
      query += ` left join user_investments on user_investments.created_by = users.id and user_investments.investment_id = ${investmentId} `;
      query += ` where vote.id = ${voteId} `;
      query += ` and user_investments.amount > 0 `;
      query += ` and users.activated = true `;
      query += ` ; `;
      console.log('query : ', query);
      pool.query(query, values, (error, results) => {
        if (error) {
          console.log('getInvestmentVoteResult ', error);
          return reject(error);
        }
        resolve(results.rows);
      });
    });
  } catch (e) {
    console.log(e);
  }
}

function getInvestmentPrice(investmentId, userId) {
  return new Promise((resolve, reject) => {
    let query = `SELECT `;
    query += ` user_investments.amount, `;
    query += ` investments.won_per_account `;

    query += ` FROM user_investments `;
    query += ` left join investments on investments.id = user_investments.investment_id `;

    query += ` WHERE user_investments.investment_id = ${investmentId} `;
    query += ` AND user_investments.created_by = ${userId} `;
    query += ` AND user_investments.paid_status != 'paid' `;
    query += ` ; `;

    const values = [];
    pool.query(query, values, (error, results) => {
      if (error) {
        console.log('getInvestmentPrice ', error);
        return reject(error);
      }
      resolve(results.rows);
    });
  });
}

function getMyInvestment(userId) {
  return new Promise((resolve, reject) => {
    let query = `SELECT `;
    query += ` investments.* `;
    query += ` FROM investments `;
    query += ` left join user_investments on user_investments.investment_id = investments.id `;
    query += ` WHERE user_investments.created_by = ${userId} `;
    query += ` AND investments.disabled_at is null `;
    // query += ` OR investments.created_by = ${userId} `;
    query += ` ORDER BY investments.id DESC `;
    const values = [];
    pool.query(query, values, (error, results) => {
      if (error) {
        console.log('getMyInvestment ', error);
        return reject(error);
      }
      resolve(results.rows);
    });
  });
}

function getAdminUserInvestment() {
  return new Promise((resolve, reject) => {
    let query = `SELECT `;
    query += ` 0 as id, `;
    query += ` i.invest_id as invest_id, `;
    query += ` i.title as title, `;
    query += ` 0 as process_percent, `;
    query += ` 0 as amount, `;
    query += ` i.created_by as created_by, `;
    query += ` i.created_at as created_at, `;
    query += ` i.id as investment_id, `;
    query += ` '' as sign_name, `;
    query += ` '' as paid_status `;
    query += ` FROM investments i `;
    query += ` WHERE i.disabled_at is null `;
    query += ` ORDER BY i.id DESC `;
    const values = [];
    pool.query(query, values, (error, results) => {
      if (error) {
        console.log('getAdminUserInvestment ', error);
        return reject(error);
      }
      resolve(results.rows);
    });
  });
}

function getNotifications(date, type) {
  /*
  select
    DISTINCT ON (
    n.user_id,
    n.investment_id,
    n.type )
    n.user_id as user_id,
    n.investment_id as investment_id,
    n.type as type,
    n.to_target as to_target,
    i.title as title,
    u.name as name
from notification n
    left join users u on n.user_id = u.id
    left join investments i on n.investment_id = i.id
where to_char(i.start_date, 'YYYY-MM-DD') = '2023-03-16'
AND n.type = 'sms'
;
   */
  return new Promise((resolve, reject) => {
    let query = `SELECT `;
    query += ` DISTINCT ON (n.user_id, n.investment_id, n.type) `;
    query += ` n.user_id as user_id, `;
    query += ` n.investment_id as investment_id, `;
    query += ` n.type as type, `;
    query += ` n.to_target as to_target, `;
    query += ` i.title as title, `;
    query += ` u.name as name `;
    query += ` FROM notification n `;
    query += ` LEFT JOIN users u on n.user_id = u.id `;
    query += ` LEFT JOIN investments i on n.investment_id = i.id `;
    query += ` WHERE to_char(i.start_date, 'YYYY-MM-DD') = '${date}' `;
    query += ` AND n.type = '${type}' `;
    query += ` AND n.disabled_at IS NULL `;
    query += ` AND i.disabled_at IS NULL `;
    query += ` ; `;

    const values = [];
    pool.query(query, values, (error, results) => {
      if (error) {
        console.log('getNotifications ', error);
        return reject(error);
      }
      resolve(results.rows);
    });
  });
}

async function updateSendNotification(user_id, investment_id, type) {
  return new Promise((resolve, reject) => {
    let query = `UPDATE notification SET disabled_at = now() `;
    query += ` WHERE user_id = ${user_id} `;
    query += ` AND investment_id = ${investment_id} `;
    query += ` AND type = ${type} `;
    query += ` ; `;

    const values = [];
    pool.query(query, values, (error, results) => {
      if (error) {
        console.log('updateSendNotification ', error);
        return reject(error);
      }
      resolve(results.rows);
    });
  });
}

async function getUserInvestmentFromUserAndVote(userId, voteId) {
  return new Promise((resolve, reject) => {
    let query = `SELECT `;
    query += ` user_investments.* `;
    query += ` FROM user_investments `;
    query += ` left join vote on vote.investment_id = user_investments.investment_id `;
    query += ` WHERE user_investments.created_by = ${userId} `;
    query += ` AND vote.id = ${voteId} `;
    query += ` ; `;

    const values = [];
    pool.query(query, values, (error, results) => {
      if (error) {
        console.log('getUserInvestmentFromUserAndVote ', error);
        return reject(error);
      }
      resolve(results.rows);
    });
  });
}

module.exports = {
  pool,
  select,
  insert,
  update,
  remove,
  softDelete,
  executeQuery,
  getInvestmentVoteResult,
  getInvestmentPrice,
  getMyInvestment,
  getNotifications,
  updateSendNotification,
  getAdminUserInvestment,
  getUserInvestmentFromUserAndVote,
};
