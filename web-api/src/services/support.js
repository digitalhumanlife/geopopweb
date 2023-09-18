const axios = require('axios');
const { select, insert } = require('../db/queries');
const CONSTANT = require('../utils/constant');
const crypto = require('crypto');

async function getQnAs() {
  const qnas = await select(CONSTANT.TABLE.QNA, {}, [], 'id DESC');
  return qnas;
}

async function getMyQnAs(user) {
  return await select(CONSTANT.TABLE.QNA, { created_by: { value: user.id } }, [], 'id DESC');
}

async function saveQnA(payload) {
  payload.created_by = 0;
  payload.created_at = new Date();
  await insert(CONSTANT.TABLE.QNA, payload);
}

async function saveMyQnA(user, payload) {
  payload.created_by = user.id;
  payload.created_at = new Date();
  await insert(CONSTANT.TABLE.QNA, payload);

  // 이메일 전송
  const email = `${payload.email}@${payload.domain}`;
  const emailPayload = {
    title: payload.title,
    body: `
      이름: ${payload.name}
      연락처: ${payload.phone1}-${payload.phone2}-${payload.phone3}
      이메일: ${email}
      내용: ${payload.content}
    `,
    email: `support@groundcontrol.co.kr`,
  };
  await sendMail(emailPayload);
}

// curl -i -s -X POST \
//  -H "Content-Type:application/json" \
//  -H "x-ncp-apigw-timestamp:1521787414578" \
//  -H "x-ncp-iam-access-key:6uxz1nKkcYwUjWRG5Q1V7NsW0i5jErlu2NjBXXgy" \
//  -H "x-ncp-apigw-signature-v2:iJFK773KH0WwQ79PasqJ+ZGixtpDQ/abS57WGQdld2M=" \
//  "https://mail.apigw.ntruss.com/api/v1/mails"\
//  -d '{"senderAddress":"no_reply@company.com","title":"${customer_name}님 반갑습니다. ","body":"귀하의 등급이 ${BEFORE_GRADE}에서 ${AFTER_GRADE}로 변경되었습니다.","recipients":[{"address":"hongildong@naver_.com","name":"홍길동","type":"R","parameters":{"customer_name":"홍길동","BEFORE_GRADE":"SILVER","AFTER_GRADE":"GOLD"}},{"address":"chulsoo@daum_.net","name":null,"type":"R","parameters":{"customer_name":"철수","BEFORE_GRADE":"BRONZE","AFTER_GRADE":"SILVER"}}],"individual":true,"advertising":false}'

async function sendMail(payload) {
  // name, email, phone, title, content
  const URL = `https://mail.apigw.ntruss.com/api/v1/mails`;
  const body = {
    senderAddress: 'noreply@geopop.co.kr',
    title: payload.title,
    body: payload.body,
    recipients: [
      {
        // address: 'support@groundcontrol.co.kr',
        // address: 'noreply@geopop.co.kr',
        // address: 'jhpark@openerd.com',
        address: payload.email,
        // name: payload.name,
        type: 'R',
      },
    ],
  };

  const timestamp = new Date().getTime();

  const signature = crypto
    .createHmac('sha256', process.env.NCP_SECRET_KEY)
    .update('POST /api/v1/mails\n' + timestamp + '\n' + process.env.NCP_ACCESS_KEY_ID)
    .digest('base64');

  try {
    const { data } = await axios.post(URL, body, {
      headers: {
        'Content-Type': 'application/json',
        'x-ncp-apigw-timestamp': new Date().getTime(),
        'x-ncp-iam-access-key': process.env.NCP_ACCESS_KEY_ID,
        'x-ncp-apigw-signature-v2': signature,
      },
    });

    return data;
  } catch (error) {
    console.log(error.response.data);
    throw Error(error.response.data.message);
  }
}

async function sendSms(to, content) {
  // name, email, phone, title, content
  const URL = `https://sens.apigw.ntruss.com/sms/v2/services/${process.env.NCP_SMS_SERVICE_ID}/messages`;
  const body = {
    type: 'SMS',
    contentType: 'COMM',
    countryCode: '82',
    from: process.env.NCP_SMS_FROM,
    content: `${content}`,
    messages: [
      {
        to: to,
        content: `${content}`,
      },
    ],
  };

  const timestamp = new Date().getTime();

  const signature = crypto
    .createHmac('sha256', process.env.NCP_SECRET_KEY)
    .update('POST /sms/v2/services/' + process.env.NCP_SMS_SERVICE_ID + '/messages\n' + timestamp + '\n' + process.env.NCP_ACCESS_KEY_ID)
    .digest('base64');

  try {
    const { data } = await axios.post(URL, body, {
      headers: {
        'Content-Type': 'application/json',
        'x-ncp-apigw-timestamp': new Date().getTime(),
        'x-ncp-iam-access-key': process.env.NCP_ACCESS_KEY_ID,
        'x-ncp-apigw-signature-v2': signature,
      },
    });

    return data;
  } catch (error) {
    console.log(error.response.data);
    throw Error(error.response.data.message);
  }
}

module.exports = {
  saveQnA,
  getQnAs,
  getMyQnAs,
  saveMyQnA,
  sendMail,
  sendSms,
};
