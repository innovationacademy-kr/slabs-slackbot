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
app.use('/slack/events', require('./routes/slack_events'));
global.flag = false;
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