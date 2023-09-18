import axios from 'axios';

async function login(values: any) {
  const { data } = await axios.post('/auth/login', values);
  return data;
}

async function individualRegister(values: any) {
  console.log(values);
  const formData = new FormData();

  formData.append('user_id', values.user_id);
  formData.append('password', values.password);
  formData.append('confirmPassword', values.confirmPassword);
  formData.append('name', values.name);
  formData.append('phone1', values.phone1);
  formData.append('phone2', values.phone2);
  formData.append('phone3', values.phone3);
  formData.append('email', values.email);
  formData.append('address', values.address);
  formData.append('address_detail', values.address_detail);
  formData.append('year', values.year);
  formData.append('month', values.month);
  formData.append('day', values.day);
  formData.append('gender', values.gender);
  formData.append('bankName', values.bankName);
  formData.append('accountNum', values.accountNum);
  formData.append('bankbook', values.bankbook);
  formData.append('idCard', values.idCard);
  formData.append('sms_send_agree', values.sms_send_agree);
  formData.append('email_send_agree', values.email_send_agree);
  formData.append('auth_document', values.auth_document);
  formData.append('type', values.type);
  formData.append('ci', values.ci);

  const reqConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const { data } = await axios.post('/auth/register', formData, reqConfig);
  return data;
}

async function corporateRegister(values: any) {
  const formData = new FormData();

  formData.append('user_id', values.user_id);
  formData.append('password', values.password);
  formData.append('confirmPassword', values.confirmPassword);
  formData.append('name', values.name);
  formData.append('phone1', values.phone1);
  formData.append('phone2', values.phone2);
  formData.append('phone3', values.phone3);
  formData.append('email', values.email);
  formData.append('company_name', values.company_name);
  formData.append('address', values.address);
  formData.append('address_detail', values.address_detail);
  formData.append('business_number', values.business_number);
  formData.append('file', values.file);
  formData.append('sms_send_agree', values.sms_send_agree);
  formData.append('email_send_agree', values.email_send_agree);
  formData.append('auth_document', values.auth_document);
  formData.append('register_certified', values.register_certified);
  formData.append('type', values.type);
  formData.append('ci', values.ci);
  formData.append('gender', values.gender);
  formData.append('year', values.year);
  formData.append('month', values.month);
  formData.append('day', values.day);

  const reqConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const { data } = await axios.post('/auth/register', formData, reqConfig);
  return data;
}

async function updateUser(values: any) {
  const formData = new FormData();

  formData.append('user_id', values.user_id);
  formData.append('password', values.password);
  formData.append('confirmPassword', values.confirmPassword);
  formData.append('name', values.name);
  formData.append('phone1', values.phone1);
  formData.append('phone2', values.phone2);
  formData.append('phone3', values.phone3);
  formData.append('email', values.email);
  formData.append('address', values.address);
  formData.append('address_detail', values.address_detail);
  formData.append('year', values.year);
  formData.append('month', values.month);
  formData.append('day', values.day);
  formData.append('gender', values.gender);
  formData.append('sms_send_agree', values.sms_send_agree);
  formData.append('email_send_agree', values.email_send_agree);
  formData.append('type', values.type);
  formData.append('ci', values.ci);
  formData.append('bank_name', values.bank_name);
  formData.append('account_num', values.account_num);
  formData.append('bankbook', values.bankbook);
  formData.append('id_card', values.id_card);
  formData.append('auth_document', values.auth_document);

  const reqConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const { data } = await axios.post('/auth/update', formData, reqConfig);
  return data;
}

async function updateBusinessUser(values: any) {
  const formData = new FormData();
  console.log(values);
  formData.append('user_id', values.user_id);
  formData.append('password', values.password);
  formData.append('confirmPassword', values.confirmPassword);
  formData.append('name', values.name);
  formData.append('phone1', values.phone1);
  formData.append('phone2', values.phone2);
  formData.append('phone3', values.phone3);
  formData.append('email', values.email);
  formData.append('company_name', values.company_name);
  formData.append('address', values.address);
  formData.append('address_detail', values.address_detail);
  formData.append('business_number', values.business_number);
  formData.append('file', values.file);
  formData.append('sms_send_agree', values.sms_send_agree);
  formData.append('email_send_agree', values.email_send_agree);
  formData.append('type', values.type);
  formData.append('ci', values.ci);
  formData.append('bank_name', values.bank_name);
  formData.append('account_num', values.account_num);
  formData.append('bankbook', values.bankbook);
  formData.append('id_card', values.id_card);
  formData.append('auth_document', values.auth_document);
  formData.append('register_certified', values.register_certified);

  const reqConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const { data } = await axios.post('/auth/update', formData, reqConfig);
  return data;
}

async function removeUser(password: string) {
  const { data } = await axios.post('/auth/leave', { password });
  return data;
}

async function forgotPassword(email: string) {
  const { data } = await axios.post('/auth/forgot-password', { email });
  return data;
}

async function changePassword(oldPassword: string, newPassword: string) {
  const { data } = await axios.post('/auth/update-password', {
    oldPassword,
    newPassword,
  });
  return data;
}

async function checkResetPasswordToken(token: string) {
  const { data } = await axios.post('/auth/check-reset-password-token', {
    token,
  });
  return data;
}

async function sendSmsCode(postal: string, phone: string) {
  const { data } = await axios.post('/auth/send-sms', {
    postal,
    phone,
  });
  return data;
}

async function loginByPhone(postal: string, phone: string, code: string) {
  const { data } = await axios.post('/auth/login-by-phone', {
    postal,
    phone,
    code,
  });
  return data;
}

async function idDuplicateCheck(id: string) {
  const { data } = await axios.post('/auth/id-duplicate-check', {
    id,
  });

  return data;
}

async function emailDuplicateCheck(email: string) {
  const { data } = await axios.post('/auth/email-duplicate-check', {
    email,
  });

  return data;
}

async function phoneDuplicateCheck(phone: number) {
  const { data } = await axios.post('/auth/phone-duplicate-check', {
    phone,
  });

  return data;
}

async function findId(type: string, value: string) {
  const { data } = await axios.post('/auth/find-id', {
    type,
    value,
  });

  return data;
}

async function checkCiId(ci: string, user_id: string) {
  const { data } = await axios.post('/auth/user-ci', { ci, user_id });
  return data;
}

async function findPw(ci: string, password: string, user_id: string) {
  const { data } = await axios.post('/auth/find-pw', {
    ci,
    password,
    user_id,
  });

  return data;
}

async function SSO(email: string) {
  const { data } = await axios.post('/auth/sso', {
    email,
  });

  return data;
}

async function validateCi(ci: string) {
  const { data } = await axios.post('/auth/ci', {
    ci,
  });

  return data;
}

export default {
  login,
  individualRegister,
  corporateRegister,
  updateUser,
  updateBusinessUser,
  removeUser,
  forgotPassword,
  changePassword,
  checkResetPasswordToken,
  sendSmsCode,
  loginByPhone,
  idDuplicateCheck,
  emailDuplicateCheck,
  phoneDuplicateCheck,
  findId,
  findPw,
  checkCiId,
  SSO,
  validateCi,
};
