const express = require('express');
const router = express.Router();
const { Suggestion } = require('../models');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

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

module.exports = router;