const express = require('express');
const session = require('express-session');
const path = require('path');
const PORT = process.env.PORT || 3000;
const logger = require('morgan');
const db = require('./models');
const { Suggestion } = require('./models');
const helmet = require('helmet');
const app = express();

require('dotenv').config();
let token = '';
global.token = token;

app.use(helmet());
app.use('/slack/events', require('./routes/slack_events'));
app.use('/slack/slashs', require('./routes/slack_slashs'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
/*
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
*/
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SECRET
}));

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