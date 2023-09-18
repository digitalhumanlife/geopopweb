const express = require('express');
const {
  login,
  register,
  leave,
  sendSmsCode,
  loginByPhone,
  idDuplicateCheck,
  emailDuplicateCheck,
  phoneDuplicateCheck,
  findIdByEmail,
  findIdByPhone,
  validateByEmail,
  updatePasswordByName,
  updatePassword,
  updateUser,
  validateCi,
  validateIdAndCi,
} = require('../services/auth');
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

app.post('/login', (req, res) => {
  login(req.body.email, req.body.password)
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

app.post(
  '/register',
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'bankbook', maxCount: 1 },
    { name: 'id_card', maxCount: 1 },
    { name: 'auth_document', maxCount: 1 },
    { name: 'register_certified', maxCount: 1 },
  ]),
  (req, res) => {
    const payload = req.body;

    if (req.files.file) {
      payload.file = req.files.file[0].filename;
    }
    if (req.files.bankbook) {
      payload.bankbook = req.files.bankbook[0].filename;
    }
    if (req.files.id_card) {
      payload.id_card = req.files.id_card[0].filename;
    }
    if (req.files.auth_document) {
      payload.auth_document = req.files.auth_document[0].filename;
    }
    if (req.files.register_certified) {
      payload.register_certified = req.files.register_certified[0].filename;
    }

    console.log('payload.type: ', payload.type);
    if (payload.type === 'business') {
      // 법인회원 관리자 승인 플래그 처리
      payload.business_confirm = false;
    } else {
      // 개인회원은 관리자 승인이 필요 없으므로 true로 처리해 둔다
      payload.business_confirm = true;
    }

    register(payload)
      .then(() => {
        res.json({
          success: true,
        });
      })
      .catch((e) => {
        console.log(e);
        res.json({
          success: false,
          message: e.message,
        });
      });
  },
);

app.post('/leave', verifyToken, (req, res) => {
  leave(req.user, req.body.password)
    .then(() => {
      res.json({
        success: true,
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

app.delete('/leave', verifyToken, (req, res) => {
  leave(req.user, req.body.password)
    .then(() => {
      res.json({
        success: true,
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

app.post(
  '/update',
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'bankbook', maxCount: 1 },
    { name: 'id_card', maxCount: 1 },
    { name: 'auth_document', maxCount: 1 },
    { name: 'register_certified', maxCount: 1 },
  ]),
  verifyToken,
  (req, res) => {
    const payload = req.body;

    if (req.files.file) {
      payload.file = req.files.file[0].filename;
    }
    if (req.files.bankbook) {
      payload.bankbook = req.files.bankbook[0].filename;
    }
    if (req.files.id_card) {
      payload.id_card = req.files.id_card[0].filename;
    }
    if (req.files.auth_document) {
      payload.auth_document = req.files.auth_document[0].filename;
    }
    if (req.files.register_certified) {
      payload.register_certified = req.files.register_certified[0].filename;
    }

    if (payload.type === 'business') {
      // 법인회원 관리자 승인 플래그 처리
      payload.business_confirm = false;
    } else {
      // 개인회원은 관리자 승인이 필요 없으므로 true로 처리해 둔다
      payload.business_confirm = true;
    }

    updateUser(req.user, payload)
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
  },
);

app.post('/send-sms', (req, res) => {
  sendSmsCode(req.body.postal, req.body.phone)
    .then((user) => {
      console.log(user);
      res.json({
        success: true,
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

app.post('/login-by-phone', (req, res) => {
  loginByPhone(req.body.postal, req.body.phone, req.body.code)
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

app.post('/id-duplicate-check', (req, res) => {
  idDuplicateCheck(req.body.id)
    .then((result) => {
      res.json({
        success: true,
        data: {
          isDuplicated: result,
        },
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

app.post('/email-duplicate-check', (req, res) => {
  emailDuplicateCheck(req.body.email)
    .then((result) => {
      res.json({
        success: true,
        data: {
          isDuplicated: result,
        },
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

app.post('/phone-duplicate-check', (req, res) => {
  phoneDuplicateCheck(req.body.phone)
    .then((result) => {
      res.json({
        success: true,
        data: {
          isDuplicated: result,
        },
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

app.post('/find-id', (req, res) => {
  const { type, value } = req.body;

  if (type === 'email') {
    findIdByEmail(value)
      .then((result) => {
        if (result.length === 0) {
          res.json({
            success: false,
            message: 'Invalid user',
          });
          return;
        }

        const idLength = result.length;
        const maskedId = result.substring(0, 2) + '*'.repeat(idLength - 4) + result.substring(idLength - 2, idLength);

        res.json({
          success: true,
          data: {
            id: maskedId,
          },
        });
        return;
      })
      .catch((e) => {
        console.log(e);
        res.json({
          success: false,
          message: e.message,
        });
      });
  }

  if (type === 'phone') {
    findIdByPhone(value)
      .then((result) => {
        if (result.length === 0) {
          res.json({
            success: false,
            message: 'Invalid user',
          });
          return;
        }

        const idLength = result.length;
        const maskedId = result.substring(0, 2) + '*'.repeat(idLength - 4) + result.substring(idLength - 2, idLength);

        res.json({
          success: true,
          data: {
            id: maskedId,
          },
        });
        return;
      })
      .catch((e) => {
        console.log(e);
        res.json({
          success: false,
          message: e.message,
        });
      });
  }
});

app.post('/find-pw', (req, res) => {
  updatePasswordByName(req.body.user_id, req.body.ci, req.body.password)
    .then((result) => {
      res.json({
        success: true,
        data: result,
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

app.post('/update-password', verifyToken, (req, res) => {
  const payload = req.body;
  updatePassword(req.user, payload)
    .then((result) => {
      res.json({
        success: true,
        data: result,
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

app.post('/sso', (req, res) => {
  validateByEmail(req.body.email)
    .then((user) => {
      if (user === null) {
        res.json({
          success: false,
          message: '가입 이력이 없는 유저입니다',
        });
        return;
      }

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

app.post('/ci', verifyToken, (req, res) => {
  validateCi(req.user, req.body.ci)
    .then((success) => {
      res.json({
        success,
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

app.post('/user-ci', (req, res) => {
  console.log('/user-ci ', req.body);
  validateIdAndCi(req.body.user_id, req.body.ci)
    .then((user) => {
      if (user === null) {
        res.json({
          success: false,
          data: 'invalid user',
        });
        return;
      }

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

module.exports = app;
