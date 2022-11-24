const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
  passport.use(new Strategy({
    usernameField: 'id', //html파일에서의 name이 id인 body값을 전달한다.
    passwordField: 'password'
  }, async (id, password, done) => {

    try {
      const user = await User.findOne({ where: { id } });
      if (user) {
        const result = await bcrypt.compare(password, user.password);
        if (result) 
          done(null, user);
        else
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
      } else
        done(null, false, { message: '가입되지 않은 회원입니다.' });
    } catch (error) {
      done(error);
    }
  }));
};
