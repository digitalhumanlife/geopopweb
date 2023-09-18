const express = require('express');
const { getUsers, createOrUpdateUser } = require('../services/admin');
const { getAuditLogs } = require('../services/audit-log');
const { getAllBought, confirmPaid, getBoughtById } = require('../services/user-invest');
const { verifyToken } = require('../utils/utils');

const app = express();

app.get('/users', verifyToken, (req, res) => {
  getUsers()
    .then((users) => {
      res.json({
        success: true,
        data: users,
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

app.post('/users', verifyToken, (req, res) => {
  createOrUpdateUser(req.user, req.body)
    .then((user) => {
      res.json({
        success: true,
        data: user,
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

app.get('/audit-logs', verifyToken, (req, res) => {
  getAuditLogs(req.query.offset, req.query.total)
    .then((data) => {
      res.json({
        success: true,
        data: data,
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

app.get('/bought', verifyToken, (req, res) => {
  getAllBought().then((data) => {
    res.json({
      success: true,
      data,
    });
  });
});

app.get('/bought/:id', verifyToken, (req, res) => {
  getBoughtById(req.params.id).then((data) => {
    res.json({
      success: true,
      data,
    });
  });
});

app.put('/investment-paid/:id', verifyToken, (req, res) => {
  confirmPaid(req.params.id).then(() => {
    res.json({
      success: true,
      data: 'ok',
    });
  });
});

module.exports = app;
