require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const PORT = process.env.PORT || 3000;
const logger = require('morgan');
let token = '';
global.token = token;

const app = express();

const slackEventRouter = require('./routes/slack_events');
const slackSlashRouter = require('./routes/slack_slashs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

const db = require('./models');
const { Suggestion } = require('./models');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SECRET
}));

app.use('/slack/events', slackEventRouter);
app.use('/slack/slashs', slackSlashRouter);

app.get('/', (req, res, next) => {
  Suggestion.findAll().then((users) => {
    res.send(users)
  }).catch((err) => {
    console.log("err");
  });
  next();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(404).send('Not Found');
})

db.sequelize.sync().then((req) => {
  app.listen(PORT, () => {
    console.log(`Listening on ${ PORT }`)
  });
});