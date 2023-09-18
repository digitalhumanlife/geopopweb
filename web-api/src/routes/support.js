const express = require('express');
const {saveQnA, getQnAs, sendMail, getMyQnAs, saveMyQnA, sendSms} = require('../services/support');
const {verifyToken} = require("../utils/utils");

const app = express();

app.get('/', (req, res) => {
  getQnAs().then((data) => {
    res.json({
      success: true,
      data,
    });
  });
});

app.get('/inquiry/my', verifyToken, (req, res) => {
  getMyQnAs(req.user).then((data) => {
    res.json({
      success: true,
      data,
    });
  }).catch((error) => {
    res.json({
      success: false,
      data: {
        message: error.message,
      },
    });
  });
});

app.post('/inquiry/my', verifyToken, (req, res) => {
  saveMyQnA(req.user, req.body).then(() => {
    res.json({
      success: true,
      data: 'ok',
    });
  }).catch((error) => {
    res.json({
      success: false,
      data: {
        message: error.message,
      },
    });
  });
});

app.post('/', (req, res) => {
  saveQnA(req.body).then(() => {
    res.json({
      success: true,
      data: 'ok',
    });
  });
});

app.post('/send-mail', (req, res) => {
  sendMail(req.body)
    .then((data) => {
      res.json({
        success: true,
        data,
      });
    })
    .catch((error) => {
      console.log(`error`, error);
      res.json({
        success: false,
        data: {
          message: error.message,
        },
      });
    });
});

app.post('/send-sms', (req, res) => {
  sendSms(req.body.to, req.body.content)
    .then((data) => {
      res.json({
        success: true,
        data,
      });
    })
    .catch((error) => {
      console.log(`error`, error);
      res.json({
        success: false,
        data: {
          message: error.message,
        },
      });
    });
});

module.exports = app;
