const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/message', (req, res) => {
    res.locals.title = 'Info-Message';
    res.locals.message = req.body.msg;
    res.render("info"); //파일 이름을 문자열로 넣어주면 된다.
});

router.get('/:id', (req, res) => {
    res.locals.title = 'Info-ID';
    res.locals.message = req.params.id;
    res.render("info");
});

router.post('/password', async (req, res) => {
    global.password = await bcrypt.hash(req.body.password, 12); // 해시값을 12번 구한다.
    res.locals.title = 'Encrypted';
    res.locals.message = global.password;
    res.render("info");
});

router.post('/compare', async (req, res) => {
    const auth = await bcrypt.compare(req.body.password, global.password);
    res.locals.title = 'Auth';
    res.locals.message = auth;
    res.render("info");
    // res.render("info", {  위와 같은 작동을 하는 코드이다.
    //     title: 'Auth',
    //     message: auth
    // });
});

module.exports = router;
