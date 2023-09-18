const axios = require('axios');
const { select, insert, update } = require('../db/queries');
const CONSTANT = require('../utils/constant');

async function validateAndGetToken() {
  const token = await select(CONSTANT.TABLE.NICE_TOKEN, {}, [], 'id DESC');

  if (token.length === 0) {
    const newToken = await getNewToken();
    const payload = {
      ...newToken,
      created_at: new Date(),
    };

    await insert(CONSTANT.TABLE.NICE_TOKEN, payload);

    return payload;
  }

  const now = new Date();

  if (now.getTime() - token[0].created_at.getTime() > token[0].expires_in) {
    await revokeAccessToken(token[0].access_token);
    const newToken = await getNewToken();
    const payload = {
      ...newToken,
      created_at: new Date(),
    };

    await update(CONSTANT.TABLE.NICE_TOKEN, payload, { id: token[0].id });

    return payload;
  }

  return token[0];
}

async function getNewToken() {
  const URL = `https://svc.niceapi.co.kr:22001/digital/niceid/oauth/oauth/token`;
  const CLIENT_ID = process.env.NICE_API_CLIENT_ID;
  const CLIENT_SECRET = process.env.NICE_API_CLIENT_SECRET;
  const AUTHORIZATION = encodeBase64(`${CLIENT_ID}:${CLIENT_SECRET}`);

  const response = await axios.post(
    `${URL}?grant_type=client_credentials&scope=default`,
    {},
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${AUTHORIZATION}`,
      },
    },
  );

  return response.data.dataBody;
}

const revokeAccessToken = async (accessToken) => {
  const URL = `https://svc.niceapi.co.kr:22001/digital/niceid/oauth/oauth/token/revokeById`;
  const CLIENT_ID = process.env.NICE_API_CLIENT_ID;
  const CURRENT_TIMESTAMP = new Date().getTime();
  const AUTHORIZATION = encodeBase64(`${accessToken}:${CURRENT_TIMESTAMP}:${CLIENT_ID}`);

  const response = await axios.post(
    URL,
    {},
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${AUTHORIZATION}`,
      },
    },
  );

  return response.data.dataBody;
};

const encodeBase64 = (data) => {
  return Buffer.from(data).toString('base64');
};

module.exports = {
  validateAndGetToken,
};
