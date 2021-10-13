require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const session = require('express-session');

const app = express();
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
}));

const path = require('path');
const PORT = process.env.PORT || 3000;

// NOTE DB model setting
const db = require('./models');

// NOTE view engine setting
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(helmet());
app.use(logger('dev'));

app.use('/', require('./routes'));

// NOTE: event subscriptions를 사용하는 부분입니다. 현재 사용하고 있지 않습니다.
// 기능 추가를 위해 scope 수정 및 추가할 기능에 대해 논의가 필요합니다.
// const slackEventsRoute = require('./routes/slack/events');
// app.use('/slack/events', slackEventsRoute);

// NOTE: slash command를 사용하는 부분입니다.
global.flag = false;
const slackSlashsRoute = require('./routes/slack/slashs');
app.use('/slack/slashs', slackSlashsRoute);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(404).send('Not Found');
})

db.sequelize.sync().then((req) => {
  app.listen(PORT, () => {
    console.log(`Listening on ${ PORT }`)
  });
});