const express = require('express');
const { getUserGuides, saveUserGuide, removeUserGuide } = require('../services/user-guides');
const { verifyToken } = require('../utils/utils');

const app = express();

app.get('/', (req, res) => {
  getUserGuides(req.query.id || '').then((data) => {
    res.json({
      success: true,
      data,
    });
  });
});

app.post('/', verifyToken, (req, res) => {
  saveUserGuide(req.user, req.body).then(() => {
    res.json({
      success: true,
      data: 'ok',
    });
  });
});

app.delete('/:id', verifyToken, (req, res) => {
  removeUserGuide(req.params.id).then(() => {
    res.json({
      success: true,
      data: 'ok',
    });
  });
});

module.exports = app;
