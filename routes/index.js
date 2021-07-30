const express = require('express');
const router = express.Router();
const { Suggestion, Logging } = require('../models');

router.get('/', function (req, res, next) {
  res.render('index', { title: "42vin" });
});

router.get('/suggestions', async function (req, res, next) {
  let suggestionsData = new Array;
  await Suggestion.findAll().then((data) => {
      console.log("Suggestions database called");
      let i = 0;
      while (data[i]) {
        const content = data[i].dataValues.content;
        suggestionsData.push(content);
        ++i;
      }
    }).catch((err) => {
      console.log("Sequelize selection err");
      next(err);
    });
  res.status(200).render('../views/suggestions', {
    title: `Suggestions`,
    data: suggestionsData,
  });
});

router.get('/logging', async function (req, res, next) {
  let loggingData = new Array;
  // 각각 따로 모델링
  await Logging.findAll().then((data) => {
      console.log("Loggings database called");
      let i = 0;
      while (data[i]) {
        const content = data[i].dataValues.content;
        loggingData.push(content);
        ++i;
      }
    }).catch((err) => {
      console.log("Sequelize selection err");
      next(err);
    });
  res.status(200).render('../views/suggestions', {
    title: `Suggestions`,
    data: loggingData,
  });
});

module.exports = router;