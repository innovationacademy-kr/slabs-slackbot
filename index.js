require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();

const helmet = require('helmet');

const path = require('path');
const PORT = process.env.PORT || 3000;
const logger = require('morgan');

// NOTE DB model setting
const db = require('./models');

// NOTE view engine setting
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


global.token = '';

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(helmet());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
/*
app.use(express.urlencoded({ extended: false }));
*/

app.use('/', require('./routes'));
app.use('/slack/events', require('./routes/slack_events'));
app.use('/slack/slashs', require('./routes/slack_slashs'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(404).send('Not Found');
})

db.sequelize.sync().then((req) => {
  app.listen(PORT, () => {
    console.log(`Listening on ${ PORT }`)
  });
});