const { select, insert, update, remove, executeQuery } = require('../db/queries');
const Bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

// const twilioService = require('./twilio');
const supportService = require('./support');
const CONSTANT = require('../utils/constant');
const { generateNumberCode } = require('../utils/utils');
// const {del} = require('express/lib/application');

const JWT_EXPIRED_PERIOD = 3 * 24 * 60 * 60 * 1000; // 3 days
const JWT_SECRET = 'T4FB8PH7tFhfGUXFxM3uMVvv';
const SENT_CODE = {};

async function login(email, password) {
  // const pass = await Bcrypt.hash(password, 2);
  // console.log('password:', password, ', hash:', pass);

  const users = await select(CONSTANT.TABLE.USER, { user_id: { value: email } }, [], '');
  if (users.length === 0) {
    throw new Error('Invalid email or password');
  }
  if (!users[0].activated) {
    throw new Error('Invalid email or password');
  }

  if (!Bcrypt.compareSync(password, users[0].password)) {
    throw new Error('Invalid email or password');
  }
  users[0].token = generateJWT(users[0]);
  return users[0];
}

async function register(data) {
  const leavedUser = await select(CONSTANT.TABLE.LEAVED_USER, { ci: { value: data.ci } }, [], 'leaved_at DESC');
  if (leavedUser.length > 0 && leavedUser[0].leaved_at > new Date() - 1000 * 60 * 60 * 24 * 7) {
    throw new Error('탈퇴 후 7일 이내 재가입하실 수 없습니다.');
  }

  const usersCis = await select(CONSTANT.TABLE.USER, { ci: { value: data.ci } }, [], '');

  if (usersCis.length > 0) {
    throw new Error('이미 가입된 회원입니다');
  }

  const userEmails = await select(CONSTANT.TABLE.USER, { email: { value: data.email } }, [], '');
  if (userEmails.length > 0) {
    throw new Error('이메일이 중복된 회원이 존재합니다.');
  }
  const userUserIds = await select(CONSTANT.TABLE.USER, { user_id: { value: data.user_id } }, [], '');
  if (userUserIds.length > 0) {
    throw new Error('아이디가 중복된 회원이 존재합니다.');
  }

  let phoneNum;
  if (data.phone2) {
    phoneNum = data.phone2.replace(/-/g, '').trim();
    const userUserPhones = await select(CONSTANT.TABLE.USER, { phone2: { value: phoneNum } }, [], '');
    if (userUserPhones.length > 0) {
      throw new Error('전화번호가 중복된 회원이 존재합니다.');
    }
  }

  if (data.password !== '') {
    data.password = await Bcrypt.hash(data.password, 2);
  }
  const insertedId = await insert(CONSTANT.TABLE.USER, {
    email: data.email,
    password: data.password,
    created_at: new Date(),
    role: 'user',
    activated: true,
    user_id: data.user_id,
    name: data.name,
    day: data.day,
    month: data.month,
    year: data.year,
    gender: data.gender,
    phone1: data.phone1,
    phone2: phoneNum,
    phone3: data.phone3,
    ci: data.ci,
    address: data.address,
    address_detail: data.address_detail,
    type: data.type,
    file: data.file,
    business_number: data.business_number,
    company_name: data.company_name,
    business_confirm: data.business_confirm,
    bank_name: data.bank_name,
    account_num: data.account_num,
    bankbook: data.bankbook,
    id_card: data.id_card,
    auth_document: data.auth_document,
  });
  return insertedId;
}

async function leave(user, password) {
  const users = await select(CONSTANT.TABLE.USER, { id: { value: user.id } }, [], '');
  if (users.length === 0) {
    throw new Error('Invalid user');
  }
  if (!users[0].activated) {
    throw new Error('Invalid user');
  }

  if (!Bcrypt.compareSync(password, users[0].password)) {
    throw new Error('Invalid password');
  }

  const leaveUser = users[0];
  leaveUser.user_seq = user.id;
  leaveUser.leaved_at = new Date();
  delete leaveUser.id;

  await insert(CONSTANT.TABLE.LEAVED_USER, { ...leaveUser });

  await remove(CONSTANT.TABLE.USER, { id: user.id });
  return 'ok';
}

async function updateUser(user, data) {
  if (data.password !== '') {
    data.password = await Bcrypt.hash(data.password, 2);
  } else {
    delete data.password;
    delete data.confirmPassword;
  }
  await update(CONSTANT.TABLE.USER, data, { id: user.id });

  const users = await select(CONSTANT.TABLE.USER, { id: { value: user.id } }, [], '');

  users[0].token = generateJWT(users[0]);

  return users[0];
}

function generateJWT(user) {
  return JWT.sign(
    {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      expiredDate: new Date().getTime() + JWT_EXPIRED_PERIOD,
    },
    JWT_SECRET,
  );
}

async function sendSmsCode(postal, phone) {
  if (phone[0] === '0') {
    phone = phone.substr(1);
  }
  const twilioPhone = `${postal}${phone}`;
  const code = generateNumberCode(6);
  console.log(code);
  // twilioService.sendSmsCode(twilioPhone, code);
  const codeMessase = `인증번호는 ${code} 입니다.`;
  await supportService.sendSms(phone, codeMessase);
  SENT_CODE[twilioPhone] = code;
  return 'ok';
}

async function loginByPhone(postal, phone, code) {
  if (phone[0] === '0') {
    phone = phone.substr(1);
  }
  const twilioPhone = `${postal}${phone}`;
  if (SENT_CODE[twilioPhone] !== code) {
    throw new Error('Invalid code');
  }

  const users = await executeQuery(
    `SELECT * FROM ${CONSTANT.TABLE.USER} WHERE phone2 IN ('${phone}', '0${phone}')`,
    [],
  );
  if (users.length === 0) {
    throw new Error('Invalid user');
  }
  if (!users[0].activated) {
    throw new Error('Invalid user');
  }
  users[0].token = generateJWT(users[0]);
  return users[0];
}

async function idDuplicateCheck(id) {
  const users = await select(CONSTANT.TABLE.USER, { user_id: { value: id } }, [], '');

  if (users.length > 0) {
    return true;
  }

  return false;
}

async function emailDuplicateCheck(email) {
  const users = await select(CONSTANT.TABLE.USER, { email: { value: email } }, [], '');

  if (users.length > 0) {
    return true;
  }

  return false;
}

async function phoneDuplicateCheck(phone) {
  if (phone) {
    console.log(phone);
    const phoneNum = phone.replace(/-/g, '').trim();
    console.log(phoneNum);
    const users = await select(CONSTANT.TABLE.USER, { phone2: { value: phoneNum } }, [], '');

    if (users.length > 0) {
      return true;
    }
  }
  return false;
}

async function findIdByEmail(email) {
  const users = await select(CONSTANT.TABLE.USER, { email: { value: email } }, [], '');

  if (users.length > 0) {
    return users[0].user_id;
  }

  return '';
}

async function findIdByPhone(phone) {
  const users = await executeQuery(
    `SELECT * FROM ${CONSTANT.TABLE.USER} WHERE phone2 IN ('${phone}', '0${phone}')`,
    [],
  );

  if (users.length > 0) {
    return users[0].user_id;
  }

  return '';
}

async function updatePasswordByName(user_id, ci, password) {
  password = await Bcrypt.hash(password, 2);
  const result = await update(CONSTANT.TABLE.USER, { password }, { ci, user_id });
  console.log('updatePasswordByName ', result);
  if (result === 0) {
    return false;
  }

  return true;
}

async function updatePassword(user, payload) {
  // old_password, new_password
  if (!payload || !payload.oldPassword || !payload.newPassword) {
    throw new Error('Invalid payload');
  }
  const password = await Bcrypt.hash(payload.newPassword, 2);

  const users = await select(CONSTANT.TABLE.USER, { id: { value: user.id } }, [], '');
  if (users.length === 0) {
    throw new Error('Invalid user');
  }
  if (!users[0].activated) {
    throw new Error('Invalid user');
  }
  if (!Bcrypt.compareSync(payload.oldPassword, users[0].password)) {
    throw new Error('Invalid email or password');
  }
  const result = await update(CONSTANT.TABLE.USER, { password }, { id: user.id });

  if (result.affectedRows === 0) {
    return false;
  }
  return true;
}

async function validateByEmail(email) {
  const users = await select(CONSTANT.TABLE.USER, { email: { value: email } }, [], '');

  if (users.length > 0) {
    users[0].token = generateJWT(users[0]);
    return users[0];
  }

  return null;
}

async function validateCi(user, ci) {
  if (user.ci === ci) {
    return true;
  }

  return false;
}

async function validateIdAndCi(user_id, ci) {
  const users = await select(CONSTANT.TABLE.USER, { user_id: { value: user_id }, ci: { value: ci } }, [], '');

  if (users.length > 0) {
    users[0].token = generateJWT(users[0]);
    delete users[0].password;
    // delete users[0].role;
    // delete users[0].activated;
    // delete users[0].created_at;
    // delete users[0].name;
    // delete users[0].phone1;
    // delete users[0].phone2;
    // delete users[0].phone3;
    // delete users[0].day;
    // delete users[0].month;
    // delete users[0].year;
    //
    return users[0];
    // return {
    //   id: users[0].id,
    //   token: generateJWT(users[0]),
    // };
  }
  return null;
}

module.exports = {
  login,
  register,
  leave,
  updateUser,
  sendSmsCode,
  loginByPhone,
  idDuplicateCheck,
  emailDuplicateCheck,
  phoneDuplicateCheck,
  findIdByEmail,
  findIdByPhone,
  updatePasswordByName,
  updatePassword,
  validateByEmail,
  validateCi,
  validateIdAndCi,
};
