const express = require('express');
const { getBanners, saveBanner, removeBanner, updatePriority } = require('../services/banner');
const { verifyToken } = require('../utils/utils');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const app = express();

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, true);
  },
  storage: multer.diskStorage({
    destination: function (req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const extEncoded = Buffer.from(ext, 'latin1').toString('utf8');
      // const filename = path.basename(file.originalname, extEncoded) + ext;
      const uuidName = crypto.randomUUID();
      const filename = path.basename(uuidName, extEncoded) + ext;
      done(null, filename);
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100메가로 용량 제한
});

app.get('/', (req, res) => {
  getBanners().then((data) => {
    res.json({
      success: true,
      data,
    });
  });
});

app.post('/', upload.fields([{ name: 'image', maxCount: 1 }]), verifyToken, (req, res) => {
  const payload = req.body;

  if (req.files.image) {
    payload.image = req.files.image[0].filename;
  }

  saveBanner(payload).then(() => {
    res.json({
      success: true,
      data: 'ok',
    });
  });
});

app.post('/priority', verifyToken, (req, res) => {
  updatePriority(req.body).then(() => {
    res.json({
      success: true,
      data: 'ok',
    });
  });
});

// app.post('/', verifyToken, (req, res) => {
//   saveBanners(req.user, req.body).then(() => {
//     res.json({
//       success: true,
//       data: 'ok',
//     });
//   }).catch(err => {
//     res.json({
//       success: false,
//       data: err.message,
//     });
//   });
// });

app.delete('/:id', verifyToken, (req, res) => {
  removeBanner(req.params.id).then(() => {
    res.json({
      success: true,
      data: 'ok',
    });
  });
});

module.exports = app;
