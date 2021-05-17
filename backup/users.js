const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const ObjectUtils = require('../common/ObjectUtils');
const userService = require('../services/userService');
//const DateUtils = require('../common/DateUtils.js');
//const ImageUtils = require('../common/ImageUtils');
//const TransUtils = require('../common/TransUtils');

/* GET users listing. */
router.get('/', ensureLoggedIn('/login/42'), async function (req, res, next) {
  const username = req.query.u;
  const refresh = req.query.r;

  let userInfo;
  try {
    userInfo = await userService.getUserData(username, req.session.accessToken);
  } catch (err) {
    // user 없는 경우: timeout, user가 자리에 없는 경우
    const error = new Error("[user.js] getUserData: " + err.message);
    error.status = (err.response) ? err.response.status : 500;
    if (error.status === 401) {
      res.redirect('/login/42');
      return;
    } else if (error.status === 404) {
      console.log("없는 유저입니다.");
      res.redirect('/login/42');
      return;
    }
    next(error);
    return;
  }

  const userLocation = userInfo.location;
  const userLogin = userInfo.login;
  if (userLocation) {
    req.session.data = userLocation;
    console.log(`${userLogin}님이 ${userLocation}에 있습니다.`);
  } else if (userLocation === null) {
    req.session.data = undefined;
    console.log(`${userLogin}님이 자리에 없습니다.`);
  }
});

module.exports = router;