const express = require('express');
const { getNotices, saveNotice, removeNotice, saveInvestmentNotice } = require('../services/notices');
const { verifyToken } = require('../utils/utils');

const app = express();

app.get('/', (req, res) => {
  getNotices(req.query.id || '').then(data => {
    res.json({
      success: true,
      data,
    });
  });
});

app.post('/', verifyToken, (req, res) => {
  saveNotice(req.user, req.body).then(() => {
    res.json({
      success: true,
      data: 'ok',
    });
  });
});

app.post('/investment', verifyToken, (req, res) => {
  saveInvestmentNotice(req.user, req.body).then(() => {
    res.json({
      success: true,
      data: 'ok',
    });
  }).catch(err => {
    res.json({
      success: false,
      data: err.message,
    });
  });
});

app.delete('/:id', verifyToken, (req, res) => {
  removeNotice(req.params.id).then(() => {
    res.json({
      success: true,
      data: 'ok',
    });
  });
});

module.exports = app;
