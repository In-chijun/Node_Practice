const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post('/login', (req, res, next) => { //로그인요청 API
    passport.authenticate('local', (authError, user, info) => { // 인자로 전달되는 것이 local인 경우
        if (user) req.login(user, loginError => res.redirect('/'));
        else next(`Login fail!`);
    })(req, res, next);
});

router.get('/logout', (req, res, next) => { //로그아웃 API
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/' }),
    (req, res) => res.redirect('/')
);

module.exports = router;
