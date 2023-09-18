const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const { isEmpty } = require('lodash');

const { pool } = require('../db/queries');
const APIError = require('./APIError');

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBER_ONLY = '0123456789';
const JWT_SECRET = 'T4FB8PH7tFhfGUXFxM3uMVvv';

function toCapitalizeText(str) {
  return str && str.length > 0
    ? str.replace(/\w\S*/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      })
    : str;
}

function generateCode(count) {
  let rtn = '';
  for (let i = 0; i < count; i += 1) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return rtn;
}

function generateNumberCode(count) {
  let rtn = '';
  for (let i = 0; i < count; i += 1) {
    rtn += NUMBER_ONLY.charAt(Math.floor(Math.random() * NUMBER_ONLY.length));
  }
  return rtn;
}

function findUserById(userId) {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM users WHERE id=$1`, [userId], (error, results) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      if (results.rows.length === 0) {
        return reject(new Error('User not found'));
      }
      resolve(results.rows[0]);
    });
  });
}

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[0] === 'Bearer' ? bearer[1] : bearer[0];
    req.token = bearerToken;
    jwt.verify(req.token, JWT_SECRET, function(err, decoded) {
      if (err) {
        next(new APIError('Unauthorized', httpStatus.UNAUTHORIZED, true));
      } else {
        findUserById(decoded.id)
          .then(user => {
            if (user.activated) {
              req.user = user;
              next();
            } else {
              next(new APIError('User is deactivated', httpStatus.UNAUTHORIZED, true));
            }
          })
          .catch(e => {
            console.log(e);
            next(new APIError('Unauthorized', httpStatus.UNAUTHORIZED, true));
          });
      }
    });
  } else {
    next(new APIError('Unauthorized', httpStatus.UNAUTHORIZED, true));
  }
}

function toFormattedNumber(value) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  }).format(value);
}

function getDifferenceBetweenTwoObject(obj1, obj2) {
  const result = {};
  if (Object.is(obj1, obj2)) {
    return {};
  }
  if (!obj2 || typeof obj2 !== 'object') {
    return obj2;
  }
  Object.keys(obj1 || {})
    .concat(Object.keys(obj2 || {}))
    .forEach(key => {
      if (`${obj2[key]}` !== `${obj1[key]}` && !Object.is(obj1[key], obj2[key])) {
        result[key] = obj2[key];
      }
      if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
        const value = getDifferenceBetweenTwoObject(obj1[key], obj2[key]);
        if (value !== undefined && !isEmpty(value)) {
          result[key] = value;
        }
      }
    });
  return result;
}

function removeEmptyValue(obj) {
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined || obj[key] === '') {
      delete obj[key];
    }
  });
  return obj;
}

function leftPad(value) {
  if (value >= 10) {
    return value;
  }
  return `0${value}`;
}

function toStringByFormatting(source, delimiter = '-') {
  const year = source.getFullYear();
  const month = leftPad(source.getMonth() + 1);
  const day = leftPad(source.getDate());

  return [year, month, day].join(delimiter);
}

module.exports = {
  toCapitalizeText,
  generateCode,
  generateNumberCode,
  verifyToken,
  toFormattedNumber,
  getDifferenceBetweenTwoObject,
  removeEmptyValue,
  JWT_SECRET,
  toStringByFormatting,
};
