const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getVoteById,
  getVoteRecordById,
  saveVoteRecord,
  saveVote,
  removeVote,
  getVotes,
  updateVoteStatus,
  getVoteByInvestmentId,
} = require('../services/vote');
const { verifyToken } = require('../utils/utils');

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
      const filename = path.basename(file.originalname, extEncoded) + ext;
      done(null, filename);
    },
  }),
  limits: {fileSize: 100 * 1024 * 1024}, // 100메가로 용량 제한
});

app.get('/votes', verifyToken, async (req, res) => {
  try {
    const votes = await getVotes(req.query.investment_id, req.user);
    res.json({
      success: true,
      data: votes,
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      message: e.message,
    });
  }
});

app.get('/vote', verifyToken, async (req, res) => {
  try {
    const vote = await getVoteById(req.query.id, req.user);
    res.json({
      success: true,
      data: vote,
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      message: e.message,
    });
  }
});

app.get('/vote-record', verifyToken, async (req, res) => {
  try {
    const voteRecord = await getVoteRecordById(req.query.id, req.user);
    res.json({
      success: true,
      data: voteRecord,
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      message: e.message,
    });
  }
});

app.post('/vote-record', verifyToken, async (req, res) => {
  try {
    const voteRecord = await saveVoteRecord(req.body, req.user);
    res.json({
      success: true,
      data: voteRecord,
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      message: e.message,
    });
  }
});

app.post('/vote-status', verifyToken, async (req, res) => {
  try {
    const vote = await updateVoteStatus(req.body, req.user);

    res.json({
      success: true,
      data: vote,
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      message: e.message,
    });
  }
});

app.post('/vote', upload.single('file'), verifyToken, async (req, res) => {
  try {
    const payload = req.body;
    if (req.file) payload.file = req.file.filename;

    const vote = await saveVote(payload, req.user);
    res.json({
      success: true,
      data: vote,
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      message: e.message,
    });
  }
});

app.delete('/vote', verifyToken, async (req, res) => {
  try {
    const vote = await removeVote(req.query.id);
    res.json({
      success: true,
      data: vote,
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      message: e.message,
    });
  }
});

app.get('/result', verifyToken, async (req, res) => {
  try {
    const { investment, userInvestments } = await getVoteByInvestmentId(req.query.investment_id, req.query.vote_id, req.query.masked);
    res.json({
      success: true,
      data: { investment, userInvestments },
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      message: e.message,
    });
  }
});

module.exports = app;
