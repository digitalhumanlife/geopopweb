const http = require('http');
const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const helmet = require('helmet');
const cors = require('cors');
const timeout = require('connect-timeout');
const { createProxyMiddleware } = require('http-proxy-middleware');
// const fileUpload = require('express-fileupload');
const schedule = require('node-schedule');

// const mapRoutes = require('./routes/map');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');
const supportRoutes = require('./routes/support');
const investmentRoutes = require('./routes/investment');
const userInvestmentRoutes = require('./routes/user-invest');
const bookmarksRoutes = require('./routes/bookmarks');
const noticesRoutes = require('./routes/notices');
const userGuidesRoutes = require('./routes/user-guides');
const contentRoutes = require('./routes/content');
const voteRoutes = require('./routes/vote');
const niceRoutes = require('./routes/nice');
const notificationRoutes = require('./routes/notification');
const { sendNotification } = require('./workers/notification');
const bannerRoutes = require('./routes/banner');

// const twilioService = require('./services/twilio');

const rule = new schedule.RecurrenceRule();
// 배열 방식
rule.dayOfWeek = [1, 2, 3, 4, 5]; // 월 ~ 금
rule.hour = 9; // 9시
rule.minute = 0; // 0분
rule.tz = 'Asia/Seoul'; // 한국 시간대
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const job = schedule.scheduleJob(rule, function () {
  //실행
  console.log('job start');
  sendNotification().then((r) => {
    console.log(r);
    console.log('job finish');
  });
});

const app = express();

// app.use(
//   fileUpload({
//     limits: { fileSize: 50 * 1024 * 1024 },
//     createParentPath: true,
//   }),
// );

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use(
  '/nid',
  createProxyMiddleware({
    target: 'https://nid.naver.com/',
    changeOrigin: true,
    pathRewrite: {
      '^/nid': '',
    },
  }),
);
app.use(
  '/openapi-naver',
  createProxyMiddleware({
    target: 'https://openapi.naver.com/',
    changeOrigin: true,
    pathRewrite: {
      '^/openapi-naver': '',
    },
  }),
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());
app.use(methodOverride());
app.use(timeout(120000));
app.use((req, res, next) => {
  req.socket.setTimeout(60000);
  next();
});

// secure apps by setting various HTTP headers
app.use(helmet());

app.get('/', (req, res, next) => {
  next(createError(403));
});

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/document', uploadRoutes);
app.use('/support', supportRoutes);
app.use('/investments', investmentRoutes);
app.use('/user-invest', userInvestmentRoutes);
app.use('/bookmarks', bookmarksRoutes);
app.use('/notices', noticesRoutes);
app.use('/user-guides', userGuidesRoutes);
app.use('/content', contentRoutes);
app.use('/vote', voteRoutes);
app.use('/nice', niceRoutes);
app.use('/notification', notificationRoutes);
app.use('/banner', bannerRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = http.createServer(app);

module.exports = server;
