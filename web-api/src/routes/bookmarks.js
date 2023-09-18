const express = require('express');
const { getBookmarks, saveBookmark, removeBookmark } = require('../services/bookmarks');
const { verifyToken } = require('../utils/utils');

const app = express();

app.get('/', verifyToken, (req, res) => {
  getBookmarks(req.user).then(data => {
    res.json({
      success: true,
      data: data,
    });
  });
});

app.post('/', verifyToken, (req, res) => {
  saveBookmark(req.user, req.body).then(() => {
    res.json({
      success: true,
      data: 'ok',
    });
  });
});

app.delete('/', verifyToken, (req, res) => {
  removeBookmark(req.user, req.query.id).then(() => {
    res.json({
      success: true,
      data: 'ok',
    });
  });
});

module.exports = app;
