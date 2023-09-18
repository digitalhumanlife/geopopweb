const express = require('express');
const axios = require('axios');
const { validateAndGetToken } = require('../services/nice');

const app = express();

app.get('/token', async (req, res) => {
  const token = await validateAndGetToken();

  res.json({
    success: true,
    data: token,
  });
});

app.post('/crypto', async (req, res) => {
  const {
    body: { access_token, ...dataBody },
  } = req;
  const current_timestamp = new Date().getTime();
  const unix_timestamp = Math.floor(current_timestamp / 1000).toString();
  const CLIENT_ID = process.env.NICE_API_CLIENT_ID;

  const bearer_token = Buffer.from(`${access_token}:${unix_timestamp}:${CLIENT_ID}`).toString('base64');
  try {
    const { data } = await axios.post(
      'https://svc.niceapi.co.kr:22001/digital/niceid/api/v1.0/common/crypto/token',
      {
        dataHeader: {
          CNTY_CD: 'ko',
        },
        dataBody,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${bearer_token}`,
          client_id: CLIENT_ID,
          productID: '2101979031',
        },
      },
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error.response.data);
  }
});

module.exports = app;
