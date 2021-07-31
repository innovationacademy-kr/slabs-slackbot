const express = require('express');
const router = express.Router();
const { Suggestion, Logging } = require('../models');
const logging = require('../models/logging');

router.get('/', function (req, res, next) {
  res.render('index', { title: "42vin" });
});

router.get('/suggestions', async function (req, res, next) {
  let suggestionsData = new Array;
  await Suggestion.findAll().then((data) => {
      console.log("Suggestions database called");
      data.forEach(element => {
        suggestionsData.push(element.dataValues.content);
      })
    }).catch((err) => {
      console.log("Sequelize selection err");
      next(err);
    });
  res.status(200).render('../views/suggestions', {
    title: `Suggestions`,
    data: suggestionsData,
  });
});

router.get('/logs', async function (req, res, next) {
  let loggingData = new Array;
  await Logging.findAll().then((data) => {
      console.log("Loggings database called");
      data.forEach(element => {
        const tmpDate = element.dataValues.createdAt.toString().split(' ');
        const newDate = `🗓${tmpDate[3]}-${tmpDate[1]}-${tmpDate[2]}⏱${tmpDate[4]}`;
        element.dataValues.createdAt = newDate;
        console.log(element.dataValues);
        loggingData.push(element.dataValues);
      })
    }).catch((err) => {
      console.log("Sequelize selection err");
      next(err);
    });
  res.status(200).render('../views/logs', {
    title: `Loggings`,
    data: loggingData,
  });
});

module.exports = router;