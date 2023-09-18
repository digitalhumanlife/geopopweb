const express = require('express');
const {getNotification, addNotification, removeNotification} = require('../services/notification');
const {verifyToken} = require('../utils/utils');

const app = express();

app.get('/', verifyToken, (req, res) => {
  getNotification(req.query.investment_id, req.user.id)
    .then(data => {
      res.json({
        success: true,
        data,
      });
    }).catch(e => {
    res.json({
      success: false,
      data: e.message,
    });
  });
});

app.post('/', verifyToken, (req, res) => {
  const payload = req.body
  payload.user_id = req.user.id
  addNotification(payload)
    .then(() => {
      res.json({
        success: true,
        data: 'ok',
      });
    }).catch(e => {
    res.json({
      success: false,
      data: e.message,
    });
  });
});

app.delete('/:id', verifyToken, (req, res) => {
  removeNotification(req.params.id).then(() => {
    res.json({
      success: true,
      data: 'ok',
    });
  }).catch(e => {
    res.json({
      success: false,
      data: e.message,
    });
  });
});

module.exports = app;
