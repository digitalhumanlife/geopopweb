const express = require('express');
const path = require('path');

const app = express();

app.get('/', (req, res) => {
  // get filename query
  const filename = req.query.filename;

  // find file in uploads folder
  const file = path.join(__dirname, '../../uploads', filename);

  // send file, set filename in header
  res.download(file, filename);
  // res.sendFile(file);
});

module.exports = app;
