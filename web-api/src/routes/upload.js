const express = require('express');
const { uploadDocuments, getDocuments, updateStatus, getDocument } = require('../services/upload');

const app = express();

app.post('/upload', (req, res) => {
  uploadDocuments(req.files, req.body).then((id) => {
    res.json({
      success: true,
      data: id,
    });
  });
});

app.get('/list', (req, res) => {
  getDocuments().then((data) => {
    res.json({
      success: true,
      data,
    });
  });
});

app.get('/download/:id/:doc/:fileName', (req, res) => {
  const file = `./uploads/${req.params.id}/${req.params.doc}/${req.params.fileName}`;
  res.download(file);
});

app.get('/request/:id', (req, res) => {
  getDocument(req.params.id).then((data) => {
    res.json({
      success: true,
      data,
    });
  });
});

app.put('/updateStatus/:id/:status', (req, res) => {
  updateStatus(req.params.id, req.params.status).then(() => {
    res.json({
      success: true,
      data: 'ok',
    });
  });
});

module.exports = app;
