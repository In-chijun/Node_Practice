const passport = require('passport');
const local = require('./local');
const kakao = require('./kakao');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => { // 로그인 요청 처리를 위한 미들웨어
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => { // 로그인 처리를 해주는 미들웨어
    User.findOne({
      where: { id }
    })
    .then(user => done(null, user))
    .catch(err => done(err));
  });

  local();
  kakao();
};
