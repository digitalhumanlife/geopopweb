const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getInvestments,
  saveInvestment,
  removeInvestment,
  getMyInvestments,
  updateRecruitmentComplete,
  getInvestBanking,
} = require('../services/investment');
const { verifyToken } = require('../utils/utils');
const { isEmpty } = require('lodash');
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
  const auth = req.headers['authorization'];
  let token = '';
  if (!isEmpty(auth)) {
    token = auth.split(' ')[1];
  }
  getInvestments(req.query.id || '', token)
    .then((data) => {
      res.json({
        success: true,
        data,
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        data: err.message,
      });
    });
});

app.post(
  '/',
  upload.fields([
    { name: 'panel_image', maxCount: 1 },
    { name: 'thumbnail1', maxCount: 1 },
    { name: 'thumbnail2', maxCount: 1 },
    { name: 'thumbnail3', maxCount: 1 },
    { name: 'detailImage1', maxCount: 1 },
    { name: 'detailImage2', maxCount: 1 },
    { name: 'detailImage3', maxCount: 1 },
    { name: 'floor_plan_image', maxCount: 1 },
    { name: 'perspective_drawing_image1', maxCount: 1 },
    { name: 'perspective_drawing_image2', maxCount: 1 },
    { name: 'perspective_drawing_image3', maxCount: 1 },
    { name: 'document1', maxCount: 1 },
    { name: 'document2', maxCount: 1 },
    { name: 'document3', maxCount: 1 },
    { name: 'document4', maxCount: 1 },
    { name: 'document5', maxCount: 1 },
    { name: 'expected_schedule_image', maxCount: 1 },
  ]),
  verifyToken,
  (req, res) => {
    const payload = req.body;

    if (req.files.panel_image) {
      payload.panel_image = req.files.panel_image[0].filename;
      payload.panel_image_org = req.files.panel_image[0].originalname;
    }
    if (req.files.thumbnail1) {
      payload.thumbnail1 = req.files.thumbnail1[0].filename;
      payload.thumbnail1_org = req.files.thumbnail1[0].originalname;
    }
    if (req.files.thumbnail2) {
      payload.thumbnail2 = req.files.thumbnail2[0].filename;
      payload.thumbnail2_org = req.files.thumbnail2[0].originalname;
    }
    if (req.files.thumbnail3) {
      payload.thumbnail3 = req.files.thumbnail3[0].filename;
      payload.thumbnail3_org = req.files.thumbnail3[0].originalname;
    }
    if (req.files.detailImage1) {
      payload.detailImage1 = req.files.detailImage1[0].filename;
      payload.detailImage1_org = req.files.detailImage1[0].originalname;
    }
    if (req.files.detailImage2) {
      payload.detailImage2 = req.files.detailImage2[0].filename;
      payload.detailImage2_org = req.files.detailImage2[0].originalname;
    }
    if (req.files.detailImage3) {
      payload.detailImage3 = req.files.detailImage3[0].filename;
      payload.detailImage3_org = req.files.detailImage3[0].originalname;
    }

    if (req.files.floor_plan_image) {
      payload.floor_plan_image = req.files.floor_plan_image[0].filename;
      payload.floor_plan_image_org = req.files.floor_plan_image[0].originalname;
    }
    if (req.files.perspective_drawing_image1) {
      payload.perspective_drawing_image1 = req.files.perspective_drawing_image1[0].filename;
      payload.perspective_drawing_image1_org = req.files.perspective_drawing_image1[0].originalname;
    }
    if (req.files.perspective_drawing_image2) {
      payload.perspective_drawing_image2 = req.files.perspective_drawing_image2[0].filename;
      payload.perspective_drawing_image2_org = req.files.perspective_drawing_image2[0].originalname;
    }
    if (req.files.perspective_drawing_image3) {
      payload.perspective_drawing_image3 = req.files.perspective_drawing_image3[0].filename;
      payload.perspective_drawing_image3_org = req.files.perspective_drawing_image3[0].originalname;
    }

    if (req.files.document1) {
      payload.document1 = req.files.document1[0].filename;
      payload.document1_org = req.files.document1[0].originalname;
    }
    if (req.files.document2) {
      payload.document2 = req.files.document2[0].filename;
      payload.document2_org = req.files.document2[0].originalname;
    }
    if (req.files.document3) {
      payload.document3 = req.files.document3[0].filename;
      payload.document3_org = req.files.document3[0].originalname;
    }
    if (req.files.document4) {
      payload.document4 = req.files.document4[0].filename;
      payload.document4_org = req.files.document4[0].originalname;
    }
    if (req.files.document5) {
      payload.document5 = req.files.document5[0].filename;
      payload.document5_org = req.files.document5[0].originalname;
    }

    if (req.files.expected_schedule_image) {
      payload.expected_schedule_image = req.files.expected_schedule_image[0].filename;
      payload.expected_schedule_image_org = req.files.expected_schedule_image[0].originalname;
    }

    saveInvestment(req.user, payload)
      .then(() => {
        res.json({
          success: true,
          data: 'ok',
        });
      })
      .catch((err) => {
        res.json({
          success: false,
          data: err.message,
        });
      });
  },
);

app.post('/:id/recruitment/complete', verifyToken, (req, res) => {
  const complete = req.body.recruitment_complete;
  if (complete === undefined) {
    res.json({
      success: false,
      data: 'recruitment_complete is required',
    });
    return;
  }
  updateRecruitmentComplete(req.params.id, complete)
    .then(() => {
      res.json({
        success: true,
        data: 'ok',
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        data: err.message,
      });
    });
});

app.delete('/:id', verifyToken, (req, res) => {
  removeInvestment(req.params.id)
    .then(() => {
      res.json({
        success: true,
        data: 'ok',
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        data: err.message,
      });
    });
});

app.get('/my', verifyToken, (req, res) => {
  getMyInvestments(req.user)
    .then((data) => {
      res.json({
        success: true,
        data,
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        data: err.message,
      });
    });
});

app.get('/:id/banking', verifyToken, (req, res) => {
  getInvestBanking(req.params.id)
    .then((data) => {
      res.json({
        success: true,
        data,
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        data: err.message,
      });
    });
});

module.exports = app;
