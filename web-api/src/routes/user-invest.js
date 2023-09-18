const express = require('express');
const {getBought, saveBuy, getPrice} = require('../services/user-invest');
const {verifyToken} = require('../utils/utils');

const app = express();

app.get('/', verifyToken, (req, res) => {
  getBought(req.user)
    .then(data => {
      res.json({
        success: true,
        data,
      });
    })
    .catch((e) => {
      console.log(e);
      res.json({
        success: false,
        message: e.message,
      });
    });
});

app.post('/', verifyToken, (req, res) => {
  saveBuy(req.user, req.body)
    .then(() => {
      res.json({
        success: true,
        data: 'ok',
      });
    })
    .catch((e) => {
      console.log(e);
      res.json({
        success: false,
        message: e.message,
      });
    });
});

app.get('/price', verifyToken, (req, res) => {
  getPrice(req.user, req.query.investment_id)
    .then(data => {
      res.json({
        success: true,
        data,
      });
    })
    .catch((e) => {
      console.log(e);
      res.json({
        success: false,
        message: e.message,
      });
    });
});

module.exports = app;
